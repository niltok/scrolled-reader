import * as http from 'http2';

type HttpHandler = (stream: http.ServerHttp2Stream, headers: http.IncomingHttpHeaders) => Promise<void>;
export type Middleware = (stream: http.ServerHttp2Stream, headers: http.IncomingHttpHeaders, next: () => Promise<void>) => Promise<void>;
export const app: Middleware[] = [];
export async function runApp(stream: http.ServerHttp2Stream, headers: http.IncomingHttpHeaders, index: number = 0) {
    if (index >= app.length) {
        stream.respond({
            ":status": 404
        })
        stream.end()
        return
    }
    await app[index](stream, headers, () => runApp(stream, headers, index + 1));
}
