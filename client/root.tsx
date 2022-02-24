import * as React  from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Main } from './main'
import { Viewer } from './viewer'
import { Subscribe } from '@react-rxjs/core'

const { StrictMode, useEffect } = React

async function persist() {
    return await (navigator.storage && navigator.storage.persist &&
        navigator.storage.persist());
}

async function isStoragePersisted() {
    return await (navigator.storage && navigator.storage.persisted &&
      navigator.storage.persisted());
}

function Root() {
    useEffect(() => {
        isStoragePersisted().then(persisted => {
            if (!persisted) persist()
        })
    }, [])
    return (
    <Subscribe>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={ <Main /> }></Route>
                <Route path='/view/:id' element={ <Viewer /> }></Route>
            </Routes>
        </BrowserRouter>
    </Subscribe>)
}

render((<StrictMode>
    <Root />
</StrictMode>), document.getElementById('root'))


