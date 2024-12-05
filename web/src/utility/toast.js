import Toastif from "toastify-js";
export function showSuccessToast({ text, dest = null }) {
  Toastif({
    text: text,
    duration: 3000,
    destination: dest,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}

export function showErrorToast({ text, dest = null }) {
  Toastif({
    text: text,
    duration: 3000,
    destination: dest,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(to right, #ff4e50, #f9d423)",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
}
