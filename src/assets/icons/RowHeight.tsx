import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiTableRowHeight } from "@mdi/js";

export default function RowHeight(props: SvgIconProps) {
	return (
		<SvgIcon {...props}>
			<path d={mdiTableRowHeight} />
		</SvgIcon>
	);
}
