import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiCodeJson } from "@mdi/js";

export default function Json(props: SvgIconProps) {
	return (
		<SvgIcon {...props}>
			<path d={mdiCodeJson} />
		</SvgIcon>
	);
}
