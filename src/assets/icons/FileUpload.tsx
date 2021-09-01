import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiUpload } from "@mdi/js";

export default function FileUpload(props: SvgIconProps) {
	return (
		<SvgIcon {...props}>
			<path d={mdiUpload} />
		</SvgIcon>
	);
}
