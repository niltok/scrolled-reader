import { useLiveQuery } from "dexie-react-hooks"
import React from "react"
import { useEffect, useRef } from "react"
import { kv } from "./storage"

export function Injection() {
    const script = useLiveQuery(() => 
        kv.get<string>('injection')
    )
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (ref.current && script) {
            ref.current.innerHTML = script
        }
    }, [script])
    return (<div style={{
        display: 'none',
    }} ref={ref}></div>)
}