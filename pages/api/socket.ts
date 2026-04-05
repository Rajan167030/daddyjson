import { Server as NetServer } from "http"
import { Server as ServerIO } from "socket.io"
import { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (res.socket?.server?.io) {
    console.log("Socket.io already running")
  } else {
    console.log("Socket.io is initializing")
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: "/api/socket",
    })

    io.on("connection", (socket) => {
      console.log("New client connected")

      socket.on("comment", (comment) => {
        io.emit("comment", comment)
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected")
      })
    })

    res.socket.server.io = io
  }
  res.end()
}