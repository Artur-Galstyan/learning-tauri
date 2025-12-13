import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { NavLink } from "react-router";

import "./app.css";

function App() {
  return (
    <main>
      Hi! Learn more about it <NavLink to="/about">About</NavLink>
    </main>
  );
}

export default App;
