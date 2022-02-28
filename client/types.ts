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
    size: number
}

export interface BinaryFile {
    type: string
    data: Uint8Array
}

export interface JsonBook extends JsonBookKey {
    menu: Menu[]
    elem: Elem[]
    pic: [string, BinaryFile][]
}

export interface Path {
    path: List<string>
    root: boolean
}

export interface AuthInfo {
    username: string
    password: string
}

export interface RemoteContext {
    url: string
    auth: AuthInfo
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