import { useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { chunk, set } from "lodash-es";
import { doc, writeBatch, deleteField } from "firebase/firestore";

import { projectScope } from "@src/atoms/projectScope";
import { tableScope, _bulkWriteDbAtom } from "@src/atoms/tableScope";
import { BulkWriteFunction } from "@src/types/table";
import { firebaseDbAtom } from "@src/sources/ProjectSourceFirebase";

/**
 * Sets the value of _bulkWriteDb atom
 */
export default function useBulkWriteDb() {
  // Set _bulkWriteDb function
  const [firebaseDb] = useAtom(firebaseDbAtom, projectScope);
  const setBulkWriteDb = useSetAtom(_bulkWriteDbAtom, tableScope);
  useEffect(() => {
    setBulkWriteDb(
      () =>
        async (
          operations: Parameters<BulkWriteFunction>[0],
          onBatchCommit: Parameters<BulkWriteFunction>[1]
        ) => {
          // Chunk operations into batches of 500 (Firestore limit is 500)
          const operationsChunked = chunk(operations, 500);

          // Loop through chunks of 500, then commit the batch sequentially
          for (const [index, operationsChunk] of operationsChunked.entries()) {
            // Create Firestore batch transaction
            const batch = writeBatch(firebaseDb);
            // Loop through operations and write to batch
            for (const operation of operationsChunk) {
              // New document
              if (operation.type === "add") {
                batch.set(doc(firebaseDb, operation.path), operation.data);
              }
              // Update existing document and merge values and delete fields
              else if (operation.type === "update") {
                const updateToDb = { ...operation.data };
                if (Array.isArray(operation.deleteFields)) {
                  for (const field of operation.deleteFields) {
                    set(updateToDb as any, field, deleteField());
                  }
                }
                batch.set(doc(firebaseDb, operation.path), operation.data, {
                  merge: true,
                });
              }
              // Delete existing documents
              else if (operation.type === "delete") {
                batch.delete(doc(firebaseDb, operation.path));
              }
            }
            // Commit batch and wait for it to finish before continuing
            // to prevent Firestore rate limits
            await batch.commit().then(() => console.log("Batch committed"));
            if (onBatchCommit) onBatchCommit(index + 1);
          }
        }
    );

    return () => setBulkWriteDb(undefined);
  }, [firebaseDb, setBulkWriteDb]);
}
