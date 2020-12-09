import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

export const RouterContext = React.createContext({});

interface ICustomBrowserProps {
  children: React.ReactNode;
}

const CustomBrowserRouter: React.FC<ICustomBrowserProps> = ({ children }) => (
  <BrowserRouter>
    <Route>
      {(routeProps) => (
        <RouterContext.Provider value={routeProps}>
          {children}
        </RouterContext.Provider>
      )}
    </Route>
  </BrowserRouter>
);

export default CustomBrowserRouter;
