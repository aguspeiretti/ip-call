import Peer from "peerjs";

// Crea una instancia de Peer utilizando un servidor gratuito de PeerJS
const peer = new Peer({
  host: "peerjs-server.herokuapp.com",
  port: 443,
  secure: true,
});

export const createPeer = () => peer;
