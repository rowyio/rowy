import { useState } from "react";
import SettingsMenu from "./Menu";
//import Webhooks from "./Webhooks";
export default function Settings() {
  const [modal, setModal] = useState("");
  return (
    <>
      <SettingsMenu modal={modal} setModal={setModal} />
      {/* <Webhooks
        open={modal === "Webhooks"}
        handleClose={() => {
          setModal("");
        }}
      /> */}
    </>
  );
}
