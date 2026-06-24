// components/service-worker-register.jsx
"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      // If the page is already loaded, register immediately
      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW);
        return () => window.removeEventListener("load", registerSW);
      }
    }
  }, []);

  return null;
}

function registerSW() {
  navigator.serviceWorker
    .register("/sw.js")
    .then((reg) => console.log("Service Worker registered:", reg.scope))
    .catch((err) => console.error("Service Worker registration failed:", err));
}