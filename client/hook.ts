import { useLiveQuery } from 'dexie-react-hooks'
import { useState, useEffect } from 'react'
import { syncSession } from './dbus'
import { bookKey, bookTable, db, kv, session } from './storage'
import { Session } from './types'

export function useTemp<T>(key: string, val?: T)
        : [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>] {
    const [temp, setTemp] = useState(val)
    useEffect(() => {
        const t = sessionStorage.getItem(key)
        if (t) setTemp(JSON.parse(t).val)
    }, [key])
    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify({key, val: temp}))
    }, [key, temp])
    return [temp, setTemp]
}

export function useCacheAsync<T>(f: () => Promise<T>): T | undefined {
    const [data, setData] = useState<T>()
    useEffect(() => {
        f().then(setData)
    }, [])
    return data
}

export function useSession(id: string, bid: string | null): 
        [Session | undefined, React.Dispatch<React.SetStateAction<Session | undefined>>] {
    const [value, setValue] = useState<Session | undefined>(undefined)
    const live = useLiveQuery(() => session.get(id), [id])
    if (live && (!value || live.timestamp > value.timestamp)) {
        console.log('db new session', live)
        setValue(live)
    }
    useEffect(() => {(async () => {
        const s = await session.get(id)
        if (s || !bid) return
        const bk = await bookKey.get(bid)
        if (!bk) return null
        await session.put({ 
            id, 
            name: bk.title, 
            size: bk.size, 
            book: bid, 
            pos: 0, 
            per: 0,
            timestamp: 0
        })
    })()}, [id, bid])
    useEffect(() => {
        if (value && (!live || value.timestamp > live.timestamp)) {
            session.put(value)
            syncSession(value)
        }
    }, [value, live])
    return [value, setValue]
}

export const useKV = <T>(key: string, val: T): [T, number, React.Dispatch<React.SetStateAction<T>>] => {
    const [value, setValue] = useState(val)
    const [timestamp, setTimestamp] = useState(0)
    const live = useLiveQuery(() => db.kv.get(key), [key])
    if (live && live.timestamp > timestamp) {
        setValue(live.val as T)
        setTimestamp(live.timestamp)
    }
    
    useEffect(() => {
        db.transaction('rw', db.kv, async () => {
            const data = await db.kv.get(key)
            if (!data || data.timestamp < timestamp)
                await db.kv.put({ key, val: value, timestamp })
        })
    }, [key, value])

    function update(v: React.SetStateAction<T>) {
        if (typeof v === 'function')
            setValue((v as (prev: T) => T)(value))
        else setValue(v)
        setTimestamp(Date.now())
    }
    
    return [value, timestamp, update]
}