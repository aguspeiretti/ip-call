import { useState, useEffect } from "react";
import { createPeer } from "../peerService";

const CallButton = () => {
  const [callId, setCallId] = useState("");
  const [peerId, setPeerId] = useState(null);
  const [stream, setStream] = useState(null);
  const peer = createPeer();

  useEffect(() => {
    // Obtenemos el ID del peer cuando se abre la conexión
    peer.on("open", (id) => {
      console.log("Mi ID de Peer es:", id);
      setPeerId(id);
    });

    // Capturamos audio y video
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        const videoElement = document.getElementById("local-video");
        if (videoElement) {
          videoElement.srcObject = mediaStream;
        }
      })
      .catch((err) => console.error("Error al obtener media stream:", err));
  }, [peer]);

  const callPeer = (id) => {
    const call = peer.call(id, stream); // Pasamos el stream de audio/video
    call.on("stream", (remoteStream) => {
      const videoElement = document.getElementById("remote-video");
      if (videoElement) {
        videoElement.srcObject = remoteStream;
      }
    });
  };

  return (
    <div>
      <h3>Tu ID: {peerId}</h3> {/* Mostramos el ID del Peer */}
      <input
        type="text"
        placeholder="ID del usuario a llamar"
        value={callId}
        onChange={(e) => setCallId(e.target.value)}
      />
      <button onClick={() => callPeer(callId)}>Llamar</button>
      <div>
        <video
          id="local-video"
          autoPlay
          muted
          style={{ width: "300px" }}
        ></video>
        <video id="remote-video" autoPlay style={{ width: "300px" }}></video>
      </div>
    </div>
  );
};

export default CallButton;
