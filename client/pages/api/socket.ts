import { VercelRequest, VercelResponse } from '@vercel/node'
import { Server } from 'ws'

const wss = new Server({ noServer: true })

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('received: %s', message)
  })

  ws.send('something from server')
})

module.exports = (req: VercelRequest, res: VercelResponse) => {
  if (!('upgrade' in req.headers)) {
    return res.status(426).send('Expected an upgrade header')
  }

  // handle as WebSocket connection
  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws) => {
    wss.emit('connection', ws, req)
  })
}
