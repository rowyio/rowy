import React from "react";

interface TablesContextInterface {
  value: { collection: string; name: string }[] | undefined;
}

const TablesContext = React.createContext<TablesContextInterface>({
  value: undefined,
});

export default TablesContext;
