import * as http from 'http2'
import * as fs from 'fs'
import { AuthInfo } from './types'
import { encode, decode, decodeAsync } from '@msgpack/msgpack'
import { runApp, app } from './app'
import { cors, corsHeader } from './cors'

const secure = fs.existsSync('cert')

const server = secure ? http.createSecureServer({
    key: fs.readFileSync('cert/server.key'),
    cert: fs.readFileSync('cert/server.crt')
}) : http.createServer()

app.push(cors)
app.push(async (stream, headers, next) => {
    if (headers[':path'] != '/upload') {
        await next()
        return
    }
    console.log((await decodeAsync(stream) as any)['pic'][0][1])
    stream.respond({
        ':status': 200,
        ...corsHeader
    })
    stream.end()
})

server.on('stream', (stream, headers) => runApp(stream, headers))

server.listen(3001, () => {
    console.log(`secure: ${secure}`)
    console.log('listening on port 3001')
})