import { IHeavyCellProps } from "../types";
import _get from "lodash/get";

import { makeStyles, createStyles } from "@material-ui/styles";
import { FormControlLabel, Switch } from "@material-ui/core";

import Confirmation from "components/Confirmation";

const useStyles = makeStyles((theme) =>
	createStyles({
		root: {
			marginLeft: 0,
			marginRight: theme.spacing(-1),
			width: `calc(100% + ${theme.spacing(1)})`,
		},

		label: {
			font: "inherit",
			letterSpacing: "inherit",

			flexGrow: 1,
			width: "calc(100% - 58px)",
			overflowX: "hidden",
		},
	})
);

const replacer = (data: any) => (m: string, key: string) => {
	const objKey = key.split(":")[0];
	const defaultValue = key.split(":")[1] || "";
	return _get(data, objKey, defaultValue);
};

export default function Checkbox({
	row,
	column,
	value,
	onSubmit,
	disabled,
}: IHeavyCellProps) {
	const classes = useStyles();

	let component = (
		<Switch
			checked={!!value}
			onChange={() => onSubmit(!value)}
			disabled={disabled}
			color="success"
		/>
	);

	if (column?.config?.confirmation)
		component = (
			<Confirmation
				message={{
					title: column.config.confirmation.title,
					body: column.config.confirmation.body.replace(
						/\{\{(.*?)\}\}/g,
						replacer(row)
					),
				}}
				functionName="onChange"
			>
				{component}
			</Confirmation>
		);

	return (
		<FormControlLabel
			control={component}
			label={column.name}
			labelPlacement="start"
			// className="cell-collapse-padding"
			classes={{ root: classes.root, label: classes.label }}
		/>
	);
}
