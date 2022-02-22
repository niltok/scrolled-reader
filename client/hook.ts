import { useState, useEffect } from 'react'
import { bookTable, get, session, set } from './storage'
import { Session } from './types'

export function useCacheAsync<T>(f: () => Promise<T>): T | undefined {
    const [data, setData] = useState<T>()
    useEffect(() => {
        f().then(setData)
    }, [])
    return data
}

export function useSession(id: string, bid: string | null): 
        [Session | null | undefined, React.Dispatch<React.SetStateAction<Session | null | undefined>>] {
    const [value, setValue] = useState<Session | null | undefined>(undefined)
    useEffect(() => {(async () => {
        const s = await session.get(id)
        if (s) return s
        if (!bid) return null
        const bk = await bookTable.get(bid)
        if (!bk) return null
        await session.put({ 
            id, 
            name: bk.title, 
            size: bk.elem.length, 
            book: bid, 
            pos: 0, 
            per: 0,
            timestamp: Date.now()
        })
        return await session.get(id)
    })().then(s => { if (s) setValue(s) })}, [id, bid])
    useEffect(() => {
        if (value) session.put({ ...value, timestamp: Date.now() })
    }, [value])
    return [value, setValue]
}

export const useKV = <T>(key: string, val: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [value, setValue] = useState(val)

    useEffect(() => {
        get<T>(key).then(value  => {
            if (value) 
                setValue(value)
        })
    }, [key])
    
    useEffect(() => {
        set(key, value)
    }, [key, value])
    
    return [value, setValue]
}