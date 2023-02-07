const publicVapidKey =
  "BOjcXb3H8zam6iyaNkBgGNIf2wAY-IjcwaLm93SXCVq_xlHiWGGWDExV_kw6AVd5fNTMx80rkRyAG-c3bSknvyU";

// check service workers
window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) send().catch((err) => console.error(err));

  document.getElementById("clear-cache").addEventListener("click", () => {
    caches.delete("staticCache");
    location.reload();
  });
});

// register sw, register push, send push
async function send() {
  // register sw
  const service = await navigator.serviceWorker.register("sw.js", {
    scope: "/",
  });
  console.log("Service worker registered!", service.scope);

  // register push
  const subs = await service.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });
  console.log("Push registered!");

  // send push
  await fetch("/subscribe", {
    method: "post",
    body: JSON.stringify(subs),
    headers: { "content-type": "application/json" },
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
