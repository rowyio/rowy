import { useLocation } from "react-router-dom";
import { useLayoutEffect } from "react";

/** Scrolls to the hash in the URL on component mount */
export function useScrollToHash() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView();

        /**
         * From rafgraph/react-router-hash-link
         * https://github.com/rafgraph/react-router-hash-link/blob/2084a987b2f34479005ffbcb16ab7b9dc1fd6c93/src/HashLink.jsx
         *
         * Copyright (c) 2017 Rafael Pedicini, MIT License
         */

        let originalTabIndex = element.getAttribute("tabindex");
        if (originalTabIndex === null && !isInteractiveElement(element)) {
          element.setAttribute("tabindex", "-1");
        }
        element.focus({ preventScroll: true });
        if (originalTabIndex === null && !isInteractiveElement(element)) {
          element.removeAttribute("tabindex");
        }
      }
    }
  }, [pathname, hash]);
}

export default useScrollToHash;

/**
 * From rafgraph/react-router-hash-link
 * https://github.com/rafgraph/react-router-hash-link/blob/2084a987b2f34479005ffbcb16ab7b9dc1fd6c93/src/HashLink.jsx
 *
 * Copyright (c) 2017 Rafael Pedicini, MIT License
 */
function isInteractiveElement(element: HTMLElement) {
  const formTags = ["BUTTON", "INPUT", "SELECT", "TEXTAREA"];
  const linkTags = ["A", "AREA"];
  return (
    (formTags.includes(element.tagName) && !element.hasAttribute("disabled")) ||
    (linkTags.includes(element.tagName) && element.hasAttribute("href"))
  );
}
