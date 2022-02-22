import { List } from 'immutable'
import { Path } from './types'

export function uuid() {
    const temp_url = URL.createObjectURL(new Blob());
    const uuid = temp_url.toString(); 
    // blob:https://xxx.com/b250d159-e1b6-4a87-9002-885d90033be3
    URL.revokeObjectURL(temp_url);
    return uuid.slice(uuid.lastIndexOf("/") + 1);
}

export async function asyncAll<T>(iter: Iterable<Promise<T>>): Promise<List<T>> {
    return List(await Promise.all(iter))
}

export function flat<T>(iter: List<List<T>>): List<T> {
    return iter.flatMap(x => x)
}

export function resolvePath({ path, root }: Path) {
    if (root) return '/' + path.join('/')
    return path.join('/')
}
