import SvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";
import { mdiFunctionVariant } from "@mdi/js";

export default function Derivative(props: SvgIconProps) {
	return (
		<SvgIcon {...props}>
			<path d={mdiFunctionVariant} />
		</SvgIcon>
	);
}
