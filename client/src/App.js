import React from "react";
import "./App.css";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

import Editor from "./Editor";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to={`/docs/${uuidV4()}`} />} />
        <Route element={<Editor />} path="/docs/:id" />
      </Routes>
    </Router>
  );
}

// if we reach home page, redirect to a random room from uuid

export default App;
