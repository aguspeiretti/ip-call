import Peer from "peerjs";

// Crea una instancia de Peer utilizando un servidor gratuito de PeerJS
const peer = new Peer({
  host: "peerjs-server.herokuapp.com",
  port: 443,
  secure: true,
  config: {
    iceServers: [
      { url: "stun:stun.l.google.com:19302" },
      { url: "stun:stun1.l.google.com:19302" },
    ],
  },
  fetch: {
    mode: "no-cors",
  },
});

export const createPeer = () => peer;
