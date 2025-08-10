import styled from "@emotion/styled";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { initialConfig } from "../config";
import { loadCanvasKit } from "../loader";

import { 
  clamp
} from "../utils";

import { CanvasKitInstance, View } from "../models";
import { useCanvasStore } from "../canvas.store";

const Container = styled.div`
  position: relative;

  touch-action: none;
  border: red solid 1px;

  & > * {
    transform: translate(25px, 25px);
  }
`

export const InteractionLayer = ({ children }: PropsWithChildren) => {
  const setCanvasKit = useCanvasStore((s) => s.setCanvasKit);
  
  // Load CanvasKit once
  useEffect(() => {
    let mounted = true;
    loadCanvasKit().then((ck) => {
      if (mounted) setCanvasKit(ck);
    });
    return () => {
      // throw error
      mounted = false;
    };
  }, [setCanvasKit]);

  return (
    <Container
      style={{
        height: initialConfig.height + 50,
        width: initialConfig.width + 50
      }}
    >
      {children}
    </Container>
  );
}
