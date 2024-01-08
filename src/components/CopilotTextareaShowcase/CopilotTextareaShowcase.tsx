import React from "react";
import {
  CopilotTextarea,
  HTMLCopilotTextAreaElement,
} from "@copilotkit/react-textarea";

const CopilotTextareaShowcase: React.FC = () => {
  const handleChange = (
    event: React.ChangeEvent<HTMLCopilotTextAreaElement>
  ): void => {
    console.log(event.target.value);
  };

  return (
    <CopilotTextarea
      value=""
      onChange={handleChange}
      autosuggestionsConfig={{
        textareaPurpose: "comment",
      }}
    />
  );
};
export default CopilotTextareaShowcase;
