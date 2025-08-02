// Since the CDN approach works and CanvasKit is a large WASM library that doesn't bundle well anyway, 
// I'd actually recommend sticking with the CDN approach for production. 
// It's more reliable, loads faster (CDN caching), and avoids bundler complexity.

declare global {
  interface Window {
    CanvasKitInit: any;
  }
}

export const loadCanvasKit = async () => {
  // Check if already loaded
  if (window.CanvasKitInit) {
    return await window.CanvasKitInit({
      locateFile: (file: string) => `https://unpkg.com/canvaskit-wasm/bin/full/${file}`,
    });
  }

  // Load the script
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/canvaskit-wasm/bin/full/canvaskit.js';
    script.onload = async () => {
      try {
        const CanvasKit = await window.CanvasKitInit({
          locateFile: (file: string) => `https://unpkg.com/canvaskit-wasm/bin/full/${file}`,
        });
        resolve(CanvasKit);
      } catch (error) {
        reject(error);
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};