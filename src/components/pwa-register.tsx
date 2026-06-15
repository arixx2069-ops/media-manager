"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          reg.addEventListener("updatefound", () => {
            const installing = reg.installing;
            if (installing) {
              installing.addEventListener("statechange", () => {
                if (
                  installing.state === "activated" &&
                  navigator.serviceWorker.controller
                ) {
                  window.location.reload();
                }
              });
            }
          });
        })
        .catch(() => {});
    }
  }, []);

  return null;
}
