import * as React  from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Main } from './main'
import { Viewer } from './viewer'

const { StrictMode } = React

function Root() {
    return (<BrowserRouter basename={ RouteRoot }>
        <Routes>
            <Route path='/' element={ <Main /> }></Route>
            <Route path='/view/:id' element={ <Viewer /> }></Route>
        </Routes>
    </BrowserRouter>)
}

render((<StrictMode>
    <Root />
</StrictMode>), document.getElementById('root'))

async function persist() {
    return await (navigator.storage && navigator.storage.persist &&
        navigator.storage.persist());
}

async function isStoragePersisted() {
    return await (navigator.storage && navigator.storage.persisted &&
      navigator.storage.persisted());
}

isStoragePersisted().then(persisted => {
    if (!persisted) persist()
})
