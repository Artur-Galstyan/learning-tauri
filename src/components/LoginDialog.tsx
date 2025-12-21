import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { LOGIN_DIALOG_ID } from "../lib/notifications";

function LoginDialog() {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const res: string = await invoke("auth_with_password", {
      userEmail: userEmail,
      password: password,
    });
    console.log(res);
  }

  return (
    <>
      <dialog id={LOGIN_DIALOG_ID} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Hello!</h3>
          <form>
            <input
              className="input"
              type="email"
              required
              placeholder="mail@site.com"
              value={userEmail}
              onChange={(e) => {
                setUserEmail(e.target.value);
              }}
            />
            <div className="validator-hint">Enter valid email address</div>

            <input
              type="password"
              className="input"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Password"
            />
            <button onClick={login} className="btn" type="button">
              Login
            </button>
          </form>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}

export default LoginDialog;
