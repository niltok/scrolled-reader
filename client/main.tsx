import * as React from 'react'
import { List, Map } from 'immutable'
import { uuid } from './utils'
import { bookKey, bookTable, db, session } from './storage'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link } from 'react-router-dom'
import { useKV, useTemp } from './hook'
import { importEpub } from './importEpub'
import { Remote } from './remote'
import { useContext } from 'react'
import { encode, decode } from '@msgpack/msgpack'
import { RemoteContext } from './types'

const { useState } = React

function SessionList() {
    const sessionInfo = useLiveQuery(() =>
        session.toArray()
    )
    return (
        <ul>
            { sessionInfo?.map((s, i) => <li key={i}><Link to={`view/${s.id}`}>{ 
                "[ " + Math.floor(s.pos / s.size * 100 * 10) / 10 + "% ] -> " + s.name
            }</Link></li>)}
        </ul>
    )
}

async function uploadBook(remote: RemoteContext, bid: string) {
    const book = await bookTable.get(bid)
    if (!book) return
    const data = encode(book)
    console.log(data.byteLength)
    console.log(decode(data))
    const url = new URL(remote.url)
    const res = await fetch(url.toString(), {
        method: 'POST',
        headers: {
            operation: 'upload',
            username: remote.auth.username,
            password: remote.auth.password,
            bid: book.id,
            title: book.title,
            size: book.size.toString(),
        },
        body: data,
    })
}

function BookList() {
    const bookInfo = useLiveQuery(() => 
        bookKey.toArray()
    )
    const [remote] = useTemp<RemoteContext>('remote')
    return (
    <ul>
        { bookInfo?.map((book, index) => <li key={index}>
            { remote ? <a href='#' onClick={() => uploadBook(remote, book.id)}>Upload</a> : <></>}
            <Link to={`view/${uuid()}?book=${book.id}`}>{book.title}</Link>
        </li>) }
    </ul>)
}

function InjEditor() {
    const [inj, timestamp, setInj] = useKV('injection', '')
    const [text, setText] = useState('')
    const [saveTime, setSaveTime] = useState(0)
    if (timestamp > saveTime) {
        setText(inj)
        setSaveTime(timestamp)
    }
    return (
    <div>
        <textarea value={text} onChange={e => setText(e.target.value)} style={{
            width: '100%',
            height: '20em',
            maxWidth: '100%',
        }}/>
        <br/>
        <button onClick={() => {
            setSaveTime(Date.now())
            setInj(text)
        }}>Save</button>
    </div>)
}

function Setting() {
    return (<div>
        <p><button onClick={() => {db.delete()}}>Reset Database</button></p>
    </div>)
}

export function Main() {
    const [log, setLog] = useState(List<string>())
    const [page, setPage] = useState('Sessions')
    const pageTable = Map({
        'Sessions': <SessionList />,
        'Books': <BookList />,
        'Injection': <InjEditor />,
        'Remote': <Remote />,
        'Setting': <Setting />,
    })
    React.useEffect(() => {
        document.title = 'Scrolled Reader'
    })
    const logger = (msg: string) => setLog(list => list.push(msg))
    return (
    <div style={{
        margin: '100px auto',
        width: '90%',
        maxWidth: '650px',
        fontSize: '0.8em'
    }}>
        <p style={{}}>
            <span>Import .epub: </span>
            <span>
            <input title=' ' type="file" accept=".epub" onChange={ e => {
                const files = e.target.files
                if (files && files.length > 0)
                    importEpub(URL.createObjectURL(files[0]), logger, files[0].name)
            } }/>
            </span>
        </p>
        <ul style={{
            fontSize: '11px',
        }}>
            { log.map((l, i) => <li key={i}>{l}</li>) }
        </ul>
        <p>
            { pageTable.keySeq().map(key => 
                <button key={key} onClick={ () => setPage(key) }>{key}</button>
            ) }
        </p>
        { pageTable.get(page) }
    </div>)
}