// handy function for starting the client
import { createServer } from "vite";
import Config from "../vite.config";


export function startVite() {
  createServer(Config).then((server) => {
    console.log(`🌐Vite server running at http://localhost:5173`)
    server.listen()
  }) 
}
