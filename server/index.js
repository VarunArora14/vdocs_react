import { Server } from "socket.io";
import connectDB from "./database/db.js";
import { getDocument, updateDocument } from "./controller/doc-controller.js";

const PORT = 9000;

connectDB(); // call the function to connect to the database

console.log("hey");
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

  socket.on("get-document", async (documentId) => {
    const data = "";
    const document = await getDocument(documentId); // get the document from the database
    socket.join(documentId); // join the room
    socket.emit("load-document", document.data); // send the document to the client

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta); // broadcast to same document and not all the clients
      console.log(delta.ops);
    });

    socket.on("save-document", async (data) => {
      await updateDocument(documentId, data); // save the document to the database
    });
  });
});
