import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiUpload } from "@mdi/js";

export default function Upload(props: SvgIconProps) {
	return (
		<SvgIcon {...props}>
			<path d={mdiUpload} />
		</SvgIcon>
	);
}
