import React from "react";
import {
	IconButton,
	Popover,
	List,
	ListItemAvatar,
	ListItem,
	Avatar,
	ListItemText,
	ListItemSecondaryAction,
	Badge,
} from "@material-ui/core";

import { makeStyles, createStyles } from "@material-ui/styles";

import ErrorIcon from "@material-ui/icons/Error";
import DeleteIcon from "@material-ui/icons/Delete";

import BellIcon from "@material-ui/icons/Notifications";

const useStyles = makeStyles((theme) =>
	createStyles({
		typography: {
			padding: theme.spacing(2),
		},
	})
);

type Notification = {
	title: string;
	subtitle: string;
	link?: string;
	variant: "error" | "success" | "info" | "warning";
};

const Notification = () => {
	const classes = useStyles();
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
		null
	);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;

	const notifications: Notification[] = [
		{
			title: "a",
			subtitle: "a",
			variant: "error",
			link:
				"https://console.cloud.google.com/cloud-build/builds;region=global/f7b8fd9b-eb6e-401f-a889-73c4bf75f232?project=antler-vc",
		},
	];

	const notificationsCount = notifications.length;
	return (
		<>
			<IconButton onClick={handleClick}>
				<Badge
					color={"primary"}
					variant="standard"
					badgeContent={notificationsCount}
				>
					<BellIcon />
				</Badge>
			</IconButton>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "center",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "center",
				}}
			>
				<List>
					{notifications.map((notification) => (
						<ListItem>
							<ListItemAvatar>
								<Avatar>
									<ErrorIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText
								primary={notification.title}
								secondary={notification.subtitle}
							/>
							<ListItemSecondaryAction>
								<IconButton edge="end" aria-label="delete">
									<DeleteIcon />
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
					))}
				</List>
			</Popover>
		</>
	);
};
export default Notification;
