import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { styled } from "@mui/system";

import { io } from "socket.io-client"; // to connect to the server from client
import { useParams } from "react-router-dom"; // get the slug from the url(id)

const MyDiv = styled("div")({
  backgroundColor: "#F5F5F5",
});

// copied from => https://quilljs.com/docs/modules/toolbar/
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

const Editor = () => {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  console.log(useParams());
  const { id } = useParams(); // get the slug from the url, 'id' is the name of the slug mentioned in App.js

  // calls first when the component is mounted
  useEffect(() => {
    // this #editor is the id of the div in the index.html where the editor will be rendered
    const quillServer = new Quill("#editor", {
      modules: { toolbar: toolbarOptions },
      theme: "snow",
    });
    quillServer.disable(); // disable the editor till document not loaded from DB
    quillServer.setText("Loading the document..."); // set the text to loading till document not loaded from DB
    setQuill(quillServer); // assign the quill object to the state
  }, []);

  // initialise the socket object when the component is mounted
  useEffect(() => {
    const ioServer = io("http://localhost:9000"); // same port as the server
    setSocket(ioServer); // assign the socket object to the state

    return () => {
      // disconnect on unmount
      ioServer.disconnect();
    };
  }, []);

  // by now quill has been initialized and socket has been connected, so we can send changes to the server
  useEffect(() => {
    // check if both quill and socket are initialized
    if (socket === null || quill === null) return;

    // method to handle changes made by user as the function was same for mount and unmount
    const handleChanges = (delta, oldDelta, source) => {
      if (source !== "user") return;

      socket && socket.emit("send-changes", delta);
    };

    quill && quill.on("text-change", handleChanges);

    return () => {
      // if the component is unmounted, then remove the event listener and send the changes to the server
      quill && quill.off("text-change", handleChanges); // remove the event listener
    };
  }, [quill, socket]);

  // useeffect runs infinitely if we dont pass the second argument "[]"
  // we want to send changes not once but wheneverr the quill or socket changes

  // square brackets means that this effect will only run once, or when variables inside the square brackets change

  // for recieving changes from other clients
  useEffect(() => {
    if (socket === null || quill === null) return;

    const handleChanges = (delta) => {
      quill && quill.updateContents(delta); // message sent by the server through other clients have to be applied to the editor
    };

    socket && socket.on("receive-changes", handleChanges); // catch the event of recieving changes from other clients

    return () => {
      socket && socket.off("receive-changes", handleChanges); // remove the event listener
    };
  }, [quill, socket]);

  useEffect(() => {
    if (quill === null || socket === null) return;

    socket &&
      socket.once("load-document", (document) => {
        quill && quill.setContents(document);
        quill && quill.enable(); // enable the editor after document is loaded from DB
      });

    // first fetch the document from the server
    socket && socket.emit("get-document", id);
  }, [quill, socket, id]);

  return (
    <MyDiv>
      <Box className="boxdiv" id="editor">
        Hey there
      </Box>
    </MyDiv>
  );
};

export default Editor;
