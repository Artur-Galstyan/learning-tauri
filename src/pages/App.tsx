import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { NavLink } from "react-router";
import { StrongholdSingleton } from "../lib/stronghold";
import { LOGIN_DIALOG_ID, toggleDialog } from "../lib/notifications";
import LoginDialog from "../components/LoginDialog";

function App() {
  async function testStronghold() {
    console.log("retrieving record...");
    console.log(await StrongholdSingleton.getRecord("token"));
    console.log("retrieval done");

    console.log("inserting record...");
    await StrongholdSingleton.insertRecord("token", "test");
    console.log("inserting done");
  }

  return (
    <main>
      Hi! Learn more about it <NavLink to="/about">About</NavLink>
      <button onClick={testStronghold} className="btn">
        Init the stronghold!
      </button>
      <button
        className="btn"
        onClick={() => {
          toggleDialog(LOGIN_DIALOG_ID);
        }}
      >
        Login
      </button>
      <LoginDialog />
    </main>
  );
}

export default App;
