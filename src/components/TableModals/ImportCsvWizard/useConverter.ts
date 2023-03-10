import { projectScope } from "@src/atoms/projectScope";
import { FieldType } from "@src/constants/fields";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import { doc, DocumentReference as Reference } from "firebase/firestore";
import { useAtom } from "jotai";

const needsConverter = (type: FieldType) =>
  [FieldType.image, FieldType.reference, FieldType.file].includes(type);

export default function useConverter() {
  const [firebaseDb] = useAtom(firebaseDbAtom, projectScope);

  const referenceConverter = (value: string): Reference | null => {
    if (!value) return null;
    if (value.split("/").length % 2 !== 0) return null;
    return doc(firebaseDb, value);
  };

  const imageOrFileConverter = (urls: string): RowyFile[] => {
    return urls.split(",").map((url) => {
      url = url.trim();
      return {
        downloadURL: url,
        name: url.split("/").pop() || "",
        lastModifiedTS: +new Date(),
        type: "",
      };
    });
  };

  const getConverter = (type: FieldType) => {
    switch (type) {
      case FieldType.image:
      case FieldType.file:
        return imageOrFileConverter;
      case FieldType.reference:
        return referenceConverter;
      default:
        return null;
    }
  };

  return {
    needsConverter,
    referenceConverter,
    imageOrFileConverter,
    getConverter,
  };
}
