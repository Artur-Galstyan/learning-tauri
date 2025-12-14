import { useState } from "react";
import { LOGIN_DIALOG_ID } from "../lib/notifications";

function LoginDialog() {
  const [isValidPassword, setIsValidPassword] = useState(false);

  function validatePassword(event: React.ChangeEvent<HTMLInputElement>) {
    const password = event.target.value;
    if (!password) return false;
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const validity = regex.test(password);
    setIsValidPassword(validity);
    return validity;
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
            />
            <div className="validator-hint">Enter valid email address</div>

            <input
              type="password"
              className="input"
              required
              onChange={validatePassword}
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
            <button className="btn" type="button">
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
