import { useLiveQuery } from "dexie-react-hooks"
import React from "react"
import { useEffect, useRef } from "react"
import { kv } from "./storage"

export function Injection() {
    const script = useLiveQuery(() => 
        kv.get<string>('injection')
    )
    useEffect(() => {
        const elem = document.createElement('div')
        if (script) {
            elem.innerHTML = script
            document.head.append(elem)
        }
        return () => {elem.remove()}
    }, [script])
    return (<div style={{
        display: 'none',
    }}></div>)
}