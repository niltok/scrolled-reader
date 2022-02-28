import { useLiveQuery } from 'dexie-react-hooks'
import { List, Map } from 'immutable'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { bookTable } from './storage'
import { Elem } from './types'
import { useSession } from './hook'

function renderElem(
    elem: Elem, 
    table: Map<string, string>, 
    move: (pos: number) => void, 
    key?: string | number, 
    ref?: (e: HTMLElement | null) => void,
    root?: boolean
): JSX.Element {
    if (elem.label == '#text') {
        if (ref) return <p ref={ref} key={key}>{elem.content}</p>
        else return <React.Fragment key={key}>{elem.content}</React.Fragment>
    }
    return React.createElement(elem.label, {
        key,
        ref,
        src: elem.label == 'img' ? table.get(elem.data!!) : undefined,
        href: elem.label == 'a' ? "#" : undefined,
        onClick: elem.label == 'a' ? (e: MouseEvent) => {
            e.preventDefault()
            move(parseInt(elem.data!!.slice(6)))
        } : undefined,
    }, typeof elem.content == 'string' ? elem.content : 
        elem.content?.map((e, i) => renderElem(e, table, move, i)))
}

export function Viewer() {
    const [loading, setLoading] = useState(1)
    const params = useParams()
    const id = params.id!!
    const [searchParams, _] = useSearchParams()
    const bid = searchParams.get('book')
    const [info, setInfo] = useSession(id, bid)
    const book = useLiveQuery(async () => {
        if (!info) return undefined
        return bookTable.get(info.book)
    }, [info?.book])
    const [extendSize, setExtendSize] = useState(10)
    const [top, bot] = info && book ? 
        [Math.max(0, info.pos - extendSize), 
         Math.min(info.pos + extendSize, book.elem.length - 1)]
        : [0, 0]
    const items = book ? book.elem.slice(top, bot + 1): undefined
    let domRef = List<HTMLElement>()
    const [offset, setOffset] = useState(0)
    const box = useRef<HTMLDivElement>(null)
    const viewer = useRef<HTMLDivElement>(null)
    const [tempOffset, setTempOffset] = useState(0)
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)
    useEffect(() => {
        function handler() {
            setHeight(window.innerHeight)
            setWidth(window.innerWidth)
        }
        window.addEventListener('resize', handler)
        return () => {
            window.removeEventListener('resize', handler)
        }
    })
    function move(delta: number) {
        let off = Math.max(0, offset + delta)
        for (let i = 0; i < domRef.size - 1; i++) {
            const e = domRef.get(i)
            const n = domRef.get(i + 1)
            if (!e || !n) return
            if (off < n.offsetTop) {
                setInfo(info => (info ? {
                    ...info, 
                    pos: top + i, 
                    per: (off - e.offsetTop) / (n.offsetTop - e.offsetTop),
                    timestamp: Date.now()
                } : info))
                return
            }
        }
        const e = domRef.last()
        if (!e) return
        setInfo(info => (info ? {
            ...info,
            pos: top + domRef.size - 1,
            per: Math.min(1, (off - e.offsetTop) / e.offsetHeight),
            timestamp: Date.now()
        } : info))
    }
    // 计算渲染结果距离中央偏移
    const updateOffset = () => {
        if (!info) return
        const center = info.pos - top
        const offsetTotal = viewer.current?.offsetHeight || 0
        if (offsetTotal == 0) return
        else setLoading(0)
        if (loading == 0 && offsetTotal < box.current!!.offsetHeight * 3)
            setExtendSize(size => size + 5)
        const e = domRef.get(center)
        const n = domRef.get(center + 1)
        if (!e) return
        const offsetCenter = e.offsetTop + info.per * (n ? n.offsetTop - e.offsetTop : e.offsetHeight)
        setOffset(offsetCenter)
    }
    useEffect(updateOffset)
    const touchStatus = useRef<{ id: number | null, x: number, y: number }>({
        id: null,
        x: 0,
        y: 0,
    })
    function wheel(e: WheelEvent) {
        move(e.deltaY)
    }
    function touchstart(e: TouchEvent) {
        if (touchStatus.current.id) return
        setTempOffset(0)
        touchStatus.current.id = e.changedTouches[0].identifier
        touchStatus.current.x = e.changedTouches[0].screenX
        touchStatus.current.y = e.changedTouches[0].screenY
    }
    function touchmove(e: TouchEvent) {
        e.preventDefault()
        List(e.changedTouches).forEach(t => {
            if (t.identifier == touchStatus.current.id) {
                setTempOffset(touchStatus.current.y - t.screenY)
            }
        })
    }
    function touchend(e: TouchEvent) {
        List(e.changedTouches).forEach(t => {
            if (t.identifier == touchStatus.current.id) {
                touchStatus.current.id = null
                move(touchStatus.current.y - t.screenY)
                setTempOffset(0)
            }
        })
    }
    useEffect(() => {
        if (box.current) {
            box.current.addEventListener('wheel', wheel, { passive: true })
            box.current.addEventListener('touchstart', touchstart, { passive: true })
            box.current.addEventListener('touchmove', touchmove)
            box.current.addEventListener('touchend', touchend, { passive: true })
        }
        return () => {
            if (!box.current) return
            box.current.removeEventListener('wheel', wheel)
            box.current.removeEventListener('touchstart', touchstart)
            box.current.removeEventListener('touchmove', touchmove)
            box.current.removeEventListener('touchend', touchend)
        }
    })
    // 图片 Blob URL
    const table = useMemo(() => {
        if (!book) return Map<string, string>()
        return Map(book.pic).map((val) => URL.createObjectURL(new Blob([val.data], { type: val.type })))
    }, [book])
    useEffect(() => () => {table.forEach((val) => URL.revokeObjectURL(val))}, [])

    useEffect(() => {
        document.title = info?.name || 'Scrolled Reader'
    }, [info?.name])

    if (!info || !book) 
        return (<div><p>Loading...</p></div>)
    return (
    <div ref={box} style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    }}>
        <div style={{
            position: 'relative',
            left: 0,
            top: '50%',
            padding: '1em',
            borderTop: '1px solid #ff000080',
            fontSize: '0.5em',
            lineHeight: 0,
            color: '#ff0000',
        }}>{info.pos}</div>
        <div ref={viewer} className='viewer' style={{
            position: 'relative',
            top: (box.current?.offsetHeight || 0) / 2 - offset - tempOffset,
        }}>
            {items?.map((elem, i) => renderElem(
                elem, 
                table, 
                pos => setInfo(info => info ? { ...info, pos, per: 0, timestamp: Date.now() } : info), 
                i + top, 
                (e: HTMLElement | null) => { if (e) domRef = domRef.push(e) }
            ))}
        </div>
    </div>)
}