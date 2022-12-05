import { Server } from "socket.io";

const PORT = 9000;
// create a new server
const io = new Server(PORT, {
  // cors is a configuration object that allows you to specify which origins are allowed to connect to your Socket.IO server.
  // https://socket.io/docs/v3/handling-cors/
  cors: {
    origin: "http://localhost:3000", // dont add "/" at the end of the url
    methods: ["GET", "POST"],
  },
});

// create a connection event, first argument is the event name, second argument is a callback function
io.on("connection", (socket) => {
  console.log("connected");
});
