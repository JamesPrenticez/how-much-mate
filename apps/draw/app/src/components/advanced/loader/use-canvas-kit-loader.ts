import { useEffect } from "react";
import { useCanvasStore } from "../stores/canvas.store";
import { loadCanvasKit } from "./loader";

export const useCanvasKitLoader = () => {
  const setCanvasKit = useCanvasStore((s) => s.setCanvasKit);

  useEffect(() => {
    let mounted = true;
    loadCanvasKit().then((ck) => {
      if (mounted) setCanvasKit(ck);
    });
    return () => {
      mounted = false;
    };
  }, [setCanvasKit]);
};
