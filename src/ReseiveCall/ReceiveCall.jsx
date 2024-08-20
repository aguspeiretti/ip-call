import React, { useState, useEffect } from "react";
import { createPeer } from "../peerService";

const ReceiveCall = () => {
  const [peerId, setPeerId] = useState(null);
  const [stream, setStream] = useState(null);
  const peer = createPeer();

  useEffect(() => {
    // Obtenemos el ID del peer cuando se abre la conexión
    peer.on("open", (id) => {
      console.log("Mi ID de Peer es:", id);
      setPeerId(id);
    });

    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          setStream(mediaStream);
          call.answer(mediaStream);

          call.on("stream", (remoteStream) => {
            const videoElement = document.getElementById("remote-video");
            if (videoElement) {
              videoElement.srcObject = remoteStream;
            }
          });
        })
        .catch((err) => console.error("Error al obtener media stream:", err));
    });
  }, [peer]);

  return (
    <div>
      <h3>Esperando llamadas... Mi ID es: {peerId}</h3>{" "}
      {/* Mostramos el ID del Peer */}
      <video id="remote-video" autoPlay style={{ width: "300px" }}></video>
    </div>
  );
};

export default ReceiveCall;
