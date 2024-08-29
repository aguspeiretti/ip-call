/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { createPeer } from "../peerService";

const ReceiveCall = () => {
  const [peerId, setPeerId] = useState(null);
  const [streams, setStreams] = useState([]); // Almacenar múltiples streams
  const peer = createPeer();

  useEffect(() => {
    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          call.answer(mediaStream);

          call.on("stream", (remoteStream) => {
            setStreams((prevStreams) => [...prevStreams, remoteStream]); // Añadir nuevos streams
          });
        })
        .catch((err) => console.error("Error al obtener media stream:", err));
    });
  }, [peer]);

  return (
    <div>
      <h3>Esperando llamadas... Mi ID es: {peerId}</h3>
      <div>
        {streams.map((stream, index) => (
          <video
            key={index}
            autoPlay
            style={{ width: "300px" }}
            ref={(video) => {
              if (video) video.srcObject = stream;
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ReceiveCall;
