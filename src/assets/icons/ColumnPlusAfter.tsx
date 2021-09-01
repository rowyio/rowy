import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiTableColumnPlusAfter } from "@mdi/js";

export default function ColumnPlusAfter(props: SvgIconProps) {
	return (
		<SvgIcon {...props}>
			<path d={mdiTableColumnPlusAfter} />
		</SvgIcon>
	);
}
