import React, { useState, useEffect, useCallback } from "react";
import { createPeer } from "../peerService";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [peerId, setPeerId] = useState(null);
  const [peers, setPeers] = useState({});
  const [stream, setStream] = useState(null);
  const peer = createPeer();

  useEffect(() => {
    peer.on("open", (id) => {
      console.log("Mi ID de Peer es:", id);
      setPeerId(id);
    });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
      })
      .catch((err) => console.error("Error al obtener media stream:", err));

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      Object.values(peers).forEach((call) => call.close());
    };
  }, []);

  useEffect(() => {
    if (!peer) return;
    peer.on("call", handleIncomingCall);
    return () => {
      peer.off("call", handleIncomingCall);
    };
  }, [peer, stream]);

  const handleIncomingCall = useCallback(
    (call) => {
      call.answer(stream);
      call.on("stream", (remoteStream) => {
        setPeers((prevPeers) => ({
          ...prevPeers,
          [call.peer]: call,
        }));
      });
    },
    [stream]
  );

  const createRoom = useCallback(() => {
    const newRoomId = Math.random().toString(36).substring(7);
    const newRoom = { id: newRoomId, participants: [peerId] };
    setRooms((prevRooms) => [...prevRooms, newRoom]);
    console.log(`Created new room: ${newRoomId}`);
  }, [peerId]);

  const joinRoom = useCallback(
    (roomId) => {
      const room = rooms.find((r) => r.id === roomId);
      if (!room) return;

      room.participants.forEach((participantId) => {
        if (participantId !== peerId) {
          const call = peer.call(participantId, stream);
          call.on("stream", (remoteStream) => {
            setPeers((prevPeers) => ({
              ...prevPeers,
              [participantId]: call,
            }));
          });
        }
      });

      setCurrentRoom(room);
      console.log(`Joined room: ${roomId}`);
    },
    [rooms, peerId, stream, peer]
  );

  const leaveRoom = useCallback(() => {
    Object.values(peers).forEach((call) => call.close());
    setPeers({});
    setCurrentRoom(null);
    console.log("Left the room");
  }, [peers]);

  return (
    <div className="flex h-screen">
      <div className="w-1/3 p-4 bg-gray-100 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Gestión de Salas</h2>
        <button
          onClick={createRoom}
          className="w-full mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Crear nueva sala
        </button>
        <h3 className="text-lg font-semibold mb-2">Salas disponibles:</h3>
        <ul>
          {rooms.map((room) => (
            <li key={room.id} className="mb-2">
              <button
                onClick={() => joinRoom(room.id)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Unirse a sala {room.id} ({room.participants.length}{" "}
                participantes)
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-2/3 p-4 bg-white">
        {currentRoom ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Sala: {currentRoom.id}</h2>
            <button
              onClick={leaveRoom}
              className="mb-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Abandonar sala
            </button>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(peers).map((peerId) => (
                <div
                  key={peerId}
                  className="aspect-video bg-gray-200 rounded-lg overflow-hidden"
                >
                  <video
                    autoPlay
                    playsInline
                    ref={(video) => {
                      if (video) video.srcObject = peers[peerId].remoteStream;
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <video
                  autoPlay
                  muted
                  playsInline
                  ref={(video) => {
                    if (video) video.srcObject = stream;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl text-gray-500">
              Selecciona o crea una sala para comenzar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomManagement;
