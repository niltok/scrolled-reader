import { useLiveQuery } from 'dexie-react-hooks'
import { List, Map } from 'immutable'
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { bookTable, session } from './storage'
import { Elem } from './types'
import { throttle } from 'lodash'
import { useSession } from './hook'

function renderElem(
    elem: Elem, 
    table: Map<string, string>, 
    move: (pos: number) => void, 
    key?: string | number, 
    ref?: (e: HTMLElement) => void
): JSX.Element {
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
    async function move(delta: number) {
        let off = Math.max(0, offset + delta)
        for (let i = 0; i < domRef.size - 1; i++) {
            const e = domRef.get(i)
            const n = domRef.get(i + 1)
            if (!e || !n) return
            if (off < n.offsetTop) {
                setInfo(info => (info ? {
                    ...info, 
                    pos: top + i, 
                    per: (off - e.offsetTop) / (n.offsetTop - e.offsetTop) 
                } : info))
                return
            }
        }
        const e = domRef.last()
        if (!e) return
        setInfo(info => (info ? {
            ...info,
            pos: top + domRef.size - 1,
            per: Math.min(1, (off - e.offsetTop) / e.offsetHeight)
        } : info))
    }
    // 计算渲染结果距离中央偏移
    const updateOffset = () => {
        if (!info) return
        const center = info.pos - top
        const offsetTotal = viewer.current?.offsetHeight || 0
        if (offsetTotal == 0) setLoading(n => n + 1)
        else setLoading(0)
        if (loading == 0 && offsetTotal < box.current!!.offsetHeight * 2)
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
    useEffect(() => {
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
                    move(touchStatus.current.y - t.screenY).then(() => {
                        updateOffset()
                        setTempOffset(0)
                    })
                }
            })
        }
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
        return Map(book.pic).map((val) => URL.createObjectURL(val))
    }, [book])
    useEffect(() => () => {table.forEach((val) => URL.revokeObjectURL(val))}, [])

    if (info === null) return (<div>Bad Parameters</div>)
    return (
    <div ref={box} style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    }}>
        <div ref={viewer} className='viewer' style={{
            position: 'relative',
            top: (box.current?.offsetHeight || 0) / 2 - offset - tempOffset,
        }}>
            {items?.map((elem, i) => renderElem(
                elem, 
                table, 
                pos => setInfo(info => info ? { ...info, pos, per: 0 } : info), 
                i, 
                (e: HTMLElement) => { domRef = domRef.push(e) }
            ))}
        </div>
    </div>)
}