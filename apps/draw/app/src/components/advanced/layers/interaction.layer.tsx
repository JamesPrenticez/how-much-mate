import styled from "@emotion/styled";
import React, { PropsWithChildren, useEffect, useRef, useState } from "react";
import { initialConfig } from "../config";
import { loadCanvasKit } from "../loader/loader";

import { 
  clamp
} from "../utils";

import { CanvasKitInstance, View } from "../models";
import { useCanvasStore } from "../stores/canvas.store";
import { useCanvasKitLoader } from "../loader";

const Container = styled.div`
  position: relative;

  touch-action: none;
  border: red solid 1px;

  & > * {
    transform: translate(25px, 25px);
  }
`

export const InteractionLayer = ({ children }: PropsWithChildren) => {
  useCanvasKitLoader();

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
