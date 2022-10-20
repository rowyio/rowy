// import {
//   projectScope,
//   tablesAtom,
//   templateSettingsDialogAtom,
// } from "@src/atoms/projectScope";
// import { TemplateSettings } from "@src/components/Tables/Templates";
// import { getTemplateById } from "@src/components/Tables/Templates/utills";
// import { useAtom, useSetAtom } from "jotai";
// import { useEffect, useState } from "react";
import Details from "./Details";

export default function withTemplate(DetailsComponent: typeof Details) {
  //     const [tables] = useAtom(tablesAtom, projectScope);
  //     const setTemplateSettingsDialog = useSetAtom(
  //       templateSettingsDialogAtom,
  //       projectScope
  //     );
  //     const [templateData, setTemplateData] = useState<TemplateSettings | null>(
  //       null
  //     );
  //     const { templateSettings } = tableSettings;
  //     const { draftId, templateId } = templateSettings || {};
  //     useEffect(() => {
  //       if (!templateId) {
  //         throw Error("Template not found");
  //       }
  //       getTemplateById(templateId).then((template) => setTemplateData(template));
  //     }, [templateId]);
  //     const dialogStateInitializer = () => {
  //       const matchingTables =
  //         tables.filter((table) => table.templateSettings?.draftId === draftId) ||
  //         [];
  //       const templateTables = templateData!.tables.map((templateTable) => ({
  //         ...templateTable,
  //         ...matchingTables.find(
  //           (matchingTable) =>
  //             matchingTable.templateSettings?.tableId === templateTable.id
  //         ),
  //       }));
  //       const steps = templateData?.steps.map((step) =>
  //         step.type === "create_table" ? { ...step, completed: true } : step
  //       );
  //       return {
  //         ...templateData,
  //         tables: templateTables,
  //         steps,
  //       } as TemplateSettings;
  //     };
  //     const handleOpenTemplate = () => {
  //       setTemplateSettingsDialog({
  //         type: "set_open",
  //         data: dialogStateInitializer(),
  //       });
  //     };
  //     if (!templateData) {
  //       return null;
  //     }
  return <DetailsComponent handleOpenTemplate={() => {}} />;
}

// export const DetailsWithTemplate = withTemplate(Details);
