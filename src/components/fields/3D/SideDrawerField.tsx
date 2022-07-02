import { useState } from "react";
import { useTheme, Box } from "@mui/material";
import { ISideDrawerFieldProps } from "@src/components/fields/types";
import { Canvas } from "@react-three/fiber";
import { useGLTF, PresentationControls, Environment } from "@react-three/drei";
import TrapFocus from "@mui/material/Unstable_TrapFocus";
import { spreadSx } from "@src/utils/ui";
import FullScreenButton from "@src/components/FullScreenButton";
export default function _3D({
  value,
  onChange,
  onSubmit,
  disabled,
}: ISideDrawerFieldProps) {
  const theme = useTheme();
  const link =
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/cybertruck/model.gltf";
  const { scene } = useGLTF(link);
  const [fullScreen, setFullScreen] = useState(false);
  const boxSx = {
    borderRadius: 1,
    resize: "vertical",
    overflow: "hidden",
    position: "relative",
  };
  const fullScreenBoxSx: any = {
    overflow: "hidden",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: theme.zIndex.tooltip * 2,
    m: "0 !important",
    resize: "none",
    backgroundColor: theme.palette.background.paper,
    borderRadius: 0,
    "&::after": { display: "none" },
  };
  return (
    <TrapFocus open={fullScreen}>
      <Box
        component="div"
        sx={fullScreen ? [fullScreenBoxSx] : [boxSx]}
        style={fullScreen ? { height: "100%" } : {}}
      >
        <Canvas>
          <ambientLight />
          <Environment files="https://rawcdn.githack.com/pmndrs/drei-assets/aa3600359ba664d546d05821bcbca42013587df2/hdri/potsdamer_platz_1k.hdr" />
          <PresentationControls
            global
            config={{ mass: 2, tension: 500 }}
            rotation={[Math.PI / 8, 0, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
          >
            <primitive scale={1} object={scene} />
          </PresentationControls>
        </Canvas>
        <FullScreenButton
          onClick={() => setFullScreen((f) => !f)}
          active={fullScreen}
          style={{ right: 32 }}
        />
      </Box>
    </TrapFocus>
  );
}
