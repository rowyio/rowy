import { useCallback, Ref } from "react";

// From https://github.com/adazzle/react-data-grid/blob/main/src/hooks/useCombinedRefs.ts
// The MIT License (MIT)

// Original work Copyright (c) 2014 Prometheus Research
// Modified work Copyright 2015 Adazzle

// For the original source code please see https://github.com/prometheusresearch-archive/react-grid

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
export default function useCombinedRefs<T>(...refs: readonly Ref<T>[]) {
  return useCallback(
    (handle: T | null) => {
      for (const ref of refs) {
        if (typeof ref === "function") {
          ref(handle);
        } else if (ref !== null) {
          // @ts-expect-error: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31065
          ref.current = handle;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  );
}
