import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { REGISTER_DIALOG_ID, Toast } from "../lib/notifications";

interface User {
  collectionId: string;
  collectionName: string;
  id: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  name: string;
  avatar: string;
  created: Date;
  updated: Date;
}

interface ApiError {
  status: number;
  message: string;
  data: Record<string, any>;
}

function RegisterDialog() {
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  function validatePassword(event: React.ChangeEvent<HTMLInputElement>) {
    const password = event.target.value;
    if (!password) return false;
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const validity = regex.test(password);
    return validity;
  }

  function isApiError(data: any): data is ApiError {
    return data && typeof data.status === "number";
  }

  async function register() {
    const res: string = await invoke("register_with_password", {
      email: userEmail,
      password: password,
      passwordConfirm: passwordConfirm,
    });
    const parsed = JSON.parse(res);
    if (isApiError(parsed)) {
      const error = parsed as ApiError;
      Toast.fire({
        icon: "error",
        title: "Failed to register",
        text: error.message,
      });
      return;
    } else {
      const user = parsed as User;
      Toast.fire({
        icon: "success",
        title: "Registration successful",
        text: "Successfully registered",
      });
      console.log("user", user);
      return;
    }
  }

  return (
    <>
      <dialog id={REGISTER_DIALOG_ID} className="modal">
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
                const passwordValid = validatePassword(e);
                setIsValidPassword(passwordValid);
              }}
              placeholder="Password"
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
            />

            <input
              type="password"
              className="input"
              required
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
              }}
              placeholder="Password"
              title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"
            />

            {!isValidPassword && (
              <p className="text-error">
                Must be more than 8 characters, including
                <br />
                At least one number
                <br />
                At least one lowercase letter
                <br />
                At least one uppercase letter
              </p>
            )}
            {!(password === passwordConfirm) && (
              <p className="text-error">Passwords don't match</p>
            )}
            <button onClick={register} className="btn" type="button">
              Register
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

export default RegisterDialog;
