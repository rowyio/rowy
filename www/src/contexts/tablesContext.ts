import React from "react";

interface TablesContextInterface {
  value: any[] | undefined;
}

const TablesContext = React.createContext<TablesContextInterface>({
  value: undefined,
});

export default TablesContext;
