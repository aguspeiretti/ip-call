import { useState, useEffect } from "react";
import { createPeer } from "../peerService";

const CallButton = () => {
  const [callIds, setCallIds] = useState(""); // IDs de los peers a llamar
  const [peerId, setPeerId] = useState(null);
  const [stream, setStream] = useState(null);
  const [calls, setCalls] = useState([]); // Almacenar múltiples llamadas
  const peer = createPeer();

  useEffect(() => {
    peer.on("open", (id) => {
      setPeerId(id);
    });

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

  const callPeers = () => {
    const ids = callIds.split(","); // IDs separados por comas
    ids.forEach((id) => {
      const call = peer.call(id.trim(), stream); // Llamamos a cada peer
      setCalls((prevCalls) => [...prevCalls, call]);

      call.on("stream", (remoteStream) => {
        const videoElement = document.getElementById(`remote-video-${id}`);
        if (videoElement) {
          videoElement.srcObject = remoteStream;
        }
      });
    });
  };

  return (
    <div>
      <h3>Tu ID: {peerId}</h3>
      <input
        type="text"
        placeholder="IDs de los usuarios a llamar (separados por comas)"
        value={callIds}
        onChange={(e) => setCallIds(e.target.value)}
      />
      <button onClick={callPeers}>Llamar</button>
      <div>
        <video
          id="local-video"
          autoPlay
          muted
          style={{ width: "300px" }}
        ></video>
        {callIds.split(",").map((id) => (
          <video
            key={id}
            id={`remote-video-${id.trim()}`}
            autoPlay
            style={{ width: "300px" }}
          ></video>
        ))}
      </div>
    </div>
  );
};

export default CallButton;
