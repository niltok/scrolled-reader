import Dexie from 'dexie'
import { JsonBook, JsonBookKey, Session } from './types'

class Storage extends Dexie {
    public kv!: Dexie.Table<{ key: string, val: any }, string>
    public bookKeys!: Dexie.Table<JsonBookKey, string>
    public books!: Dexie.Table<JsonBook, string>
    public session!: Dexie.Table<Session, string>
    public constructor() {
        super(StoreName)
        this.version(1).stores({
            kv: 'key',
            bookKeys: 'id',
            books: 'id',
            session: 'id'
        })
    }
}

const db = new Storage()

export const bookTable = db.books
export const bookKey = db.bookKeys
export const session = db.session

export async function get<T>(key: string): Promise<T | undefined> {
    const value = await db.kv.get(key)
    return value?.val as T
}

export async function set<T>(key: string, val: T): Promise<void> {
    await db.kv.put({key, val: JSON.parse(JSON.stringify(val))})
}
