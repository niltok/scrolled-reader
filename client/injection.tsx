import { useLiveQuery } from "dexie-react-hooks"
import React from "react"
import { useEffect, useRef } from "react"
import { kv } from "./storage"

export function Injection() {
    const script = useLiveQuery(() => 
        kv.get<string>('injection')
    )
    useEffect(() => {
        const temp = document.head.innerHTML
        if (script) {
            document.head.innerHTML = temp + script
        }
        return () => {document.head.innerHTML = temp}
    }, [script])
    return (<></>)
}