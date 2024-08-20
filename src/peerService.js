import Peer from "peerjs";
import { v4 as uuidv4 } from "uuid";

let peerId = localStorage.getItem("peerId");

if (!peerId) {
  peerId = uuidv4(); // Genera un nuevo ID único
  localStorage.setItem("peerId", peerId);
}

// Crea una instancia de Peer utilizando un servidor gratuito de PeerJS
const peer = new Peer(peerId, {
  host: "0.peerjs.com",
  port: 443,
  secure: true,
});

export const createPeer = () => peer;
