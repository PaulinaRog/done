import Swal from "sweetalert2";

export const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: "#D4D4D4",
});

export const ToastConf = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: true,
  background: "#D4D4D4",
  confirmButtonColor: "red",
});

export const ToastSuccConf = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: true,
  background: "#D4D4D4",
  confirmButtonColor: "green",
});
