import React, { useContext, useEffect, useState } from "react";
import { useTemp } from "./hook";
import { RemoteContext } from "./types";

function Login({ setRemote }: { setRemote: (remote: RemoteContext) => void }) {
    const [serverName, setServerName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    let notURL = true
    try {
        new URL(serverName)
        notURL = false
    } catch(e) {}
    function handleLogin() {
        if (notURL) return
        const url = new URL(serverName)
        setRemote({
            url: serverName,
            auth: { username, password },
        })
    }
    return (<div>
        <p>Server:</p>
        <p>
            <input type="url" onChange={e => setServerName(e.target.value)}/>
            {notURL ? "plz enter valid URL" : ""}
        </p>
        <p>User:</p>
        <p><input type="text" onChange={e => setUsername(e.target.value)}/></p>
        <p>Password:</p>
        <p><input type="password" onChange={e => setPassword(e.target.value)}/></p>
        <p><button onClick={handleLogin}>Login!</button></p>
    </div>)
}

export function Remote() {
    const [remote, setRemote] = useTemp<RemoteContext>('remote')
    if (remote) return (<div>Logined</div>)
    else return (<Login setRemote={setRemote}/>)
}