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