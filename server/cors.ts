import { Middleware } from './app'

export const corsHeader = {
    'access-control-allow-origin': '*',
    'access-control-allow-headers': '*',
    'access-control-allow-methods': '*',
    'access-control-max-age': '86400',
}

export const cors: Middleware = async (stream, headers, next) => {
    if (headers[':method'] == 'OPTIONS') {
        stream.respond({
            ':status': 200,
            'allow': 'GET, POST, OPTIONS',
            ...corsHeader,
        })
        stream.end()
    } else await next()
}