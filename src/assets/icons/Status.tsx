import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiPulse } from "@mdi/js";

export default function Status(props: SvgIconProps) {
	return (
		<SvgIcon {...props}>
			<path d={mdiPulse} />
		</SvgIcon>
	);
}
