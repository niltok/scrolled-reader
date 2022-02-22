import { List } from 'immutable'


export interface Menu {
    label: string
    pos: number
    sub?: Menu[]
}

export interface Elem {
    label: string
    data?: string
    content?: string | Elem[]
}

export interface JsonBookKey {
    id: string
    title: string
}

export interface JsonBook extends JsonBookKey {
    menu: Menu[]
    elem: Elem[]
    pic: { [key: string]: Blob }
}

export interface Path {
    path: List<string>
    root: boolean
}

export interface Session {
    id: string
    name: string
    size: number
    book: string
    pos: number
    per: number
    timestamp: number
}