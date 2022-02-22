import { useState, useEffect } from 'react'
import { get, set } from './storage'

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