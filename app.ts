import { serve } from "https://deno.land/std@0.106.0/http/mod.ts";
import { acceptWebSocket, acceptable } from "https://deno.land/std@0.106.0/ws/mod.ts";
import { chatConnection } from './ws/chatroom.ts';

// setup server
const server = serve({port: 8000});
console.log("http://localhost:8000/");

for await (const req of server)
{
    // serve index page
    if (req.url === "/")
    {
        req.respond(
            {
                status: 200,
                body: await Deno.open('./public/index.html')
            }
        )
    }

    // accept websocket connection
    if (req.url === '/ws')
    {
        if (acceptable(req))
        {
            acceptWebSocket(
                {
                    conn: req.conn,
                    bufReader: req.r,
                    bufWriter: req.w,
                    headers: req.headers,
                }
            )
            .then(chatConnection)
        }
    }
}