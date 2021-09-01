import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiTableColumnPlusBefore } from "@mdi/js";

export default function ColumnPlusBefore(props: SvgIconProps) {
	return (
		<SvgIcon {...props}>
			<path d={mdiTableColumnPlusBefore} />
		</SvgIcon>
	);
}
