import { createSignal } from "@react-rxjs/utils"
import { Session } from "./types"
import { bind } from "@react-rxjs/core"
import { distinctUntilChanged, reduce, scan } from "rxjs"
import { createContext } from "react"

const [session$, syncSession] = createSignal<Session>()
const newestSession$ = session$.pipe(
    scan((acc, val) => acc.timestamp > val.timestamp ? acc : val),
    distinctUntilChanged()
)

export { newestSession$, syncSession }