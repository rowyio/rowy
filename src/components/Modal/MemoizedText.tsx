import { memo } from "react";

/**
 * Used for global Modals that can have customizable text
 * so that the default text doesn’t appear as the modal closes.
 */
const MemoizedText = memo(
  function MemoizedTextComponent({ text }: { text: React.ReactNode }) {
    return <>{text}</>;
  },
  () => true
);

export default MemoizedText;
