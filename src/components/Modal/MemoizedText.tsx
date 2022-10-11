import { memo, PropsWithChildren } from "react";

/**
 * Used for global Modals that can have customizable text
 * so that the default text doesn’t appear as the modal closes.
 */
const MemoizedText = memo(
  function MemoizedTextComponent({ children }: PropsWithChildren<{}>) {
    return <>{children}</>;
  },
  () => true
);

export default MemoizedText;
