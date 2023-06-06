import { projectScope } from "@src/atoms/projectScope";
import { FieldType } from "@src/constants/fields";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";
import {
  doc,
  DocumentReference as Reference,
  GeoPoint,
} from "firebase/firestore";
import { useAtom } from "jotai";

const needsConverter = (type: FieldType) =>
  [
    FieldType.image,
    FieldType.reference,
    FieldType.file,
    FieldType.geoPoint,
  ].includes(type);

const needsUploadTypes = (type: FieldType) =>
  [FieldType.image, FieldType.file].includes(type);

export default function useConverter() {
  const [firebaseDb] = useAtom(firebaseDbAtom, projectScope);

  const referenceConverter = (value: string): Reference | null => {
    if (!value) return null;
    if (value.charAt(value.length - 1) === "/") {
      value = value.slice(0, -1);
    }
    if (value.split("/").length % 2 === 0) {
      try {
        return doc(firebaseDb, value);
      } catch (e) {
        console.log("error", e);
      }
    }
    return null;
  };

  const imageOrFileConverter = (urls: any): RowyFile[] => {
    try {
      if (!urls) return [];
      if (Array.isArray(urls)) {
        return urls
          .map((url) => {
            if (typeof url === "string") {
              url = url.trim();
              if (url !== "") {
                return {
                  downloadURL: url,
                  name: url.split("/").pop() || "",
                  lastModifiedTS: +new Date(),
                  type: "",
                };
              }
            } else if (url && typeof url === "object" && url.downloadURL) {
              return url;
            } else {
              if (url.url) {
                return {
                  downloadURL: url.url,
                  name: url.filename || url.url.split("/").pop() || "",
                  lastModifiedTS: +new Date(),
                  type: "",
                };
              }
            }
            return null;
          })
          .filter((val) => val !== null) as RowyFile[];
      }
      if (typeof urls === "string") {
        return urls
          .split(",")
          .map((url) => {
            url = url.trim();
            if (url !== "") {
              return {
                downloadURL: url,
                name: url.split("/").pop() || "",
                lastModifiedTS: +new Date(),
                type: "",
              };
            }

            return null;
          })
          .filter((val) => val !== null) as RowyFile[];
      }
      return [];
    } catch (e) {
      return [];
    }
  };

  const geoPointConverter = (value: any) => {
    if (!value) return null;
    if (typeof value === "string") {
      let latitude, longitude;
      // covered cases:
      // [3.2, 32.3]
      // {latitude: 3.2, longitude: 32.3}
      // "3.2, 32.3"
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          [latitude, longitude] = parsed;
        } else {
          latitude = parsed.latitude;
          longitude = parsed.longitude;
        }

        if (latitude && longitude) {
          latitude = parseFloat(latitude);
          longitude = parseFloat(longitude);
        }
      } catch (e) {
        [latitude, longitude] = value
          .split(",")
          .map((val) => parseFloat(val.trim()));
      }

      if (latitude && longitude) {
        return new GeoPoint(latitude, longitude);
      }
    }
    return null;
  };

  const getConverter = (type: FieldType) => {
    switch (type) {
      case FieldType.image:
      case FieldType.file:
        return imageOrFileConverter;
      case FieldType.reference:
        return referenceConverter;
      case FieldType.geoPoint:
        return geoPointConverter;
      default:
        return null;
    }
  };

  const checkAndConvert = (value: any, type: FieldType) => {
    if (needsConverter(type)) {
      const converter = getConverter(type);
      if (converter) return converter(value);
    }
    return value;
  };

  return {
    needsConverter,
    referenceConverter,
    imageOrFileConverter,
    getConverter,
    checkAndConvert,
    needsUploadTypes,
  };
}
