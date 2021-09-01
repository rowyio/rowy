import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiPuzzleOutline } from "@mdi/js";

export default function Extension(props: SvgIconProps) {
	return (
		<SvgIcon {...props}>
			<path d={mdiPuzzleOutline} />
		</SvgIcon>
	);
}
