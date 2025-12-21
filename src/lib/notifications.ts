import Swal from "sweetalert2";

export const LOGIN_DIALOG_ID = "login-dialog-id";
export const REGISTER_DIALOG_ID = "register-dialog-id";

export function toggleDialog(dialogId: string) {
  const dialog = document.getElementById(dialogId) as HTMLDialogElement;
  if (dialog) {
    if (dialog.open) {
      dialog.close();
    } else {
      dialog.showModal();
    }
  }
}

export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  target: (document.querySelector("dialog[open]") as string | null) || "body",
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});
