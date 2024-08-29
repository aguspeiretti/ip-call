// import express from "express";
// import { createServer } from "http";
// import { Server } from "socket.io";
// import cors from "cors";

// const app = express();
// app.use(cors());

// const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5174",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("Nuevo cliente conectado");

//   socket.on("offer", (offer) => {
//     console.log("Oferta recibida:", offer);
//     socket.broadcast.emit("offer", offer);
//   });

//   socket.on("answer", (answer) => {
//     console.log("Respuesta recibida:", answer);
//     socket.broadcast.emit("answer", answer);
//   });

//   socket.on("ice-candidate", (candidate) => {
//     console.log("Candidato ICE recibido:", candidate);
//     socket.broadcast.emit("ice-candidate", candidate);
//   });

//   socket.on("disconnect", () => {
//     console.log("Cliente desconectado");
//   });
// });

// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () =>
//   console.log(`Servidor escuchando en el puerto ${PORT}`)
// );
