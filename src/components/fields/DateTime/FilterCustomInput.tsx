import { IFilterCustomInputProps } from "@src/components/fields/types";
import DateTimeInput from "./SideDrawerField";
import DateInput from "@src/components/fields/Date/SideDrawerField";

export default function FilterCustomInput({
  onChange,
  operator,
  ...props
}: IFilterCustomInputProps) {
  if (operator && operator.startsWith("date-"))
    return <DateInput {...(props as any)} onChange={onChange} />;

  return <DateTimeInput {...(props as any)} onChange={onChange} />;
}
