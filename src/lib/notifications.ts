export const LOGIN_DIALOG_ID = "login-dialog-id";

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
