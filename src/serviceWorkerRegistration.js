// src/serviceWorkerRegistration.js
// Compact Pool Technician — Full PWA Service Worker Registration
// Handles caching, auto-updates, and graceful offline fallback.

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    // IPv4 localhost pattern
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

// ✅ Register the service worker
export function register(config) {
  if ("serviceWorker" in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) return;

    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // 🧩 Check for valid SW when developing locally
        checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log("🧱 Localhost: Service worker active and ready.");
        });
      } else {
        // 🚀 Production: register directly
        registerValidSW(swUrl, config);
      }
    });
  }
}

// ✅ Register valid service worker (used in production)
function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log("[SW] Registered successfully:", swUrl);

      // Detect updates
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (!installingWorker) return;

        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              console.log("♻️ New version of CPT available.");
              if (config?.onUpdate) config.onUpdate(registration);

              // Optional: Immediately activate updated SW
              registration.waiting?.postMessage({ type: "SKIP_WAITING" });
              window.location.reload();
            } else {
              console.log("✅ App cached for offline use.");
              if (config?.onSuccess) config.onSuccess(registration);
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error("❌ Service worker registration failed:", error);
    });
}

// ✅ Validate service worker — used during development
function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, { headers: { "Service-Worker": "script" } })
    .then((response) => {
      const contentType = response.headers.get("content-type");
      if (
        response.status === 404 ||
        (contentType && !contentType.includes("javascript"))
      ) {
        // No SW found — clean reload
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => window.location.reload());
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log("⚠️ Offline mode: CPT is running without network connection.");
    });
}

// ✅ Allow unregistering SW manually if needed
export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => registration.unregister())
      .catch((error) =>
        console.error("Error during service worker unregistration:", error)
      );
  }
}