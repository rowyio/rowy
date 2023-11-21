import { useRegisterActions } from "kbar";

interface TableActionObject {
  id: string;
  name: string;
  keywords: string;
  perform: () => void;
}

const SearchTableActionRegister = ({
  tableObjects,
}: {
  tableObjects: TableActionObject[];
}) => {
  useRegisterActions([...tableObjects]);
  return null;
};

export default SearchTableActionRegister;
