import * as React from 'react'
import { Book, NavItem } from 'epubjs'
import { List, Map } from 'immutable'
import { Path } from './types'
import { Elem, Menu } from './types'
import { uuid, asyncAll, resolvePath } from './utils'
import { SpineItem } from 'epubjs/types/section'
import { bookTable, bookKey, session } from './storage'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'

const { useState } = React

function foldElem(elem: Element, base: Path, book: Book): Elem {
    const name = elem.nodeName.toLowerCase()
    const withBase = (str: string) => resolvePath({
        path: base.path.concat(List(str.split('/'))),
        root: base.root
    })
    return {
        label: name == 'image' ? 'img' : name,
        data: 
            name == 'img' ? (elem as HTMLImageElement).src : 
            name == 'a' ? (elem as HTMLAnchorElement).href : 
            name == 'image' ? withBase((elem as SVGImageElement).href.baseVal) : undefined,
        content: elem.childElementCount ? Array.from(elem.children).map(dom => foldElem(dom, base, book)) : 
            elem.textContent ? elem.textContent : undefined
    }
}

function foldMenu(nav: List<NavItem>, table: Map<string, number>): Menu[] {
    return nav.map(item => {
        const label = item.label
        const href = item.href.split('#')[0].split('?')[0]
        return {
            label,
            pos: table.get(href) || 0,
            sub: item.subitems ? foldMenu(List(item.subitems), table) : undefined
        }
    }).toArray()
}

async function getSpine(items: List<SpineItem>, book: Book) {
    return (await asyncAll(items.map(async item => {
        const href = item.href || item.url
        if (href == undefined) return undefined
        const base: Path = {
            path: List(href.split('/')).pop(),
            root: href.length > 0 && href[0] == '/'
        }
        const doc = await book.load(href) as Document
        let top: Element = doc.body
        while (top.childElementCount == 1 && top.firstElementChild!!.childElementCount)
            top = top.firstElementChild!!
        const nodes = Array.from(top.children).map(node => foldElem(node, base, book))
        return {
            href,
            elem: nodes
        }
    }))).reduce((acc, val) => {
        if (!val) return acc
        const size = acc.elem.length
        return {
            table: acc.table.set(val.href, size),
            elem: acc.elem.concat(val.elem)
        }
    }, { 
        table: Map<string, number>(), 
        elem: new Array<Elem>()
    })
}

async function removeHead(str: string | undefined, then: (s: string) => Promise<string>) {
    if (!str) return undefined
    try {
        const url = new URL(str)
        return url.host == location.host ? await then(url.pathname.slice(1)) : str
    } catch (e) {
        console.log(e)
        return await then(str.split('#')[0].split('?')[0])
    }
}

async function extractImg(es: Elem[], book: Book) {
    let pic = Map<string, Blob>()
    for (const e of es) {
        if (e.label == 'img') {
            const s = await removeHead(e.data, async s => s)
            if (!s) continue
            const data = await book.archive.request(book.resolve(s), 'blob') as Blob
            pic = pic.set(s, data)
        }
        if (typeof e.content == 'object') {
            pic = pic.merge(await extractImg(e.content, book))
        }
    }
    return pic
}

async function mapURL(es: Elem[], table: Map<string, number>, book: Book): Promise<Elem[]> {
    const elem: Elem[] = await Promise.all(es.map(async e => {
        const data = e.label == 'img' ? await removeHead(e.data, async s => s).catch(() => e.data) :
            e.label == 'a' ? await removeHead(e.data, async x => "pos://" + table.get(x)) : undefined
        const content = typeof e.content == 'object' ? await mapURL(e.content, table, book) : e.content
        return {
            ...e,
            data,
            content
        }
    }))
    return elem
}

async function importEpub(
        url: string,
        logger: (msg: string) => void,
        optionalName: string) {
    const book = new Book()
    await book.open(url, "epub")
    console.log(book)
    const meta = await book.loaded.metadata
    const navi = await book.loaded.navigation
    const spine = await book.loaded.spine
    const info = await getSpine(List((spine as unknown as {items: SpineItem[]}).items), book)
    const elem = await mapURL(info.elem, info.table, book)
    const pic = (await extractImg(elem, book)).toObject()
    const menu = foldMenu(List(navi.toc), info.table)
    const id = uuid()
    const title = meta.title || optionalName
    bookTable.add({ id, title, elem, menu, pic, })
    bookKey.add({ id, title, })
    logger("Successfully imported " + title)
    logger("Book ID: " + id)
}

export function SessionList() {
    const sessionInfo = useLiveQuery(() =>
        session.toArray()
    )
    return (
        <ul>
            { sessionInfo?.map((s, i) => <li key={i}><Link to={`view/${s.id}`}>{ 
                "[ " + s.pos + " / " + s.size + " ] -> " + s.name
            }</Link></li>)}
        </ul>
    )
}

export function BookList() {
    const bookInfo = useLiveQuery(() => 
        bookKey.toArray()
    )
    return (
    <ul>
        { bookInfo?.map((book, index) => <li key={index}>
            <Link to={`view/${uuid()}?book=${book.id}`}>{book.title}</Link>
        </li>) }
    </ul>)
}

export function Main() {
    const [url, setUrl] = useState('')
    const [log, setLog] = useState(List<string>())
    const [page, setPage] = useState('Sessions')
    const pageTable = Map({
        'Sessions': <SessionList />,
        'Books': <BookList />,
    })
    const logger = (msg: string) => setLog(list => list.push(msg))
    return (
    <div style={{
        margin: '100px auto',
        width: '90%',
        maxWidth: '650px',
    }}>
        <p style={{display: 'flex'}}>
            <span>
                <input type="text" value={url} onChange={ e => setUrl(e.target.value) }/>
                <button onClick={ () => importEpub(url, logger, url) }>Import from URL</button>
            </span>
            <span>
            <input title=' ' type="file" accept=".epub" onChange={ e => {
                const files = e.target.files
                if (files && files.length > 0)
                    importEpub(URL.createObjectURL(files[0]), logger, files[0].name)
            } }/>
            </span>
        </p>
        <div>{ log.map((l, i) => <p key={i}>{l}</p>) }</div>
        <p>
            { pageTable.keySeq().map(key => 
                <button key={key} onClick={ () => setPage(key) }>{key}</button>
            ) }
        </p>
        { pageTable.get(page) }
    </div>)
}