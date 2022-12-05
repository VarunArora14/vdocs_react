import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { styled } from "@mui/system";

import { io } from "socket.io-client"; // to connect to the server from client

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
  // calls first when the component is mounted
  useEffect(() => {
    // this #editor is the id of the div in the index.html where the editor will be rendered
    const quill = new Quill("#editor", { modules: { toolbar: toolbarOptions }, theme: "snow" });
    return () => {
      // called when unmounted
      console.log("unmounted quill useEffect");
    };
  }, []);

  useEffect(() => {
    const ioServer = io("http://localhost:9000"); // same port as the server

    return () => {
      // disconnect on unmount
      ioServer.disconnect();
    };
  });

  // square brackets means that this effect will only run once, or when variables inside the square brackets change

  return (
    <MyDiv>
      <Box className="boxdiv" id="editor">
        Hey there
      </Box>
    </MyDiv>
  );
};

export default Editor;
