import { makeStyles, createStyles } from "@material-ui/styles";
import {
	useTheme,
	useMediaQuery,
	Drawer,
	DrawerProps,
	Grid,
	IconButton,
	List,
	MenuItem,
	ListItemIcon,
	ListItemText,
} from "@material-ui/core";
import CloseIcon from "assets/icons/Backburger";
import AddIcon from "@material-ui/icons/Add";

import { APP_BAR_HEIGHT } from ".";
import Logo from "assets/Logo";

import { useRowyContext } from "contexts/RowyContext";
import useRouter from "hooks/useRouter";

export const NAV_DRAWER_WIDTH = 300;

const useStyles = makeStyles((theme) =>
	createStyles({
		paper: {
			width: NAV_DRAWER_WIDTH,
			overflowX: "hidden",
			backgroundColor: theme.palette.background.paper,
		},

		logoRow: {
			height: APP_BAR_HEIGHT,
			marginTop: 0,
			marginBottom: theme.spacing(1),

			padding: theme.spacing(0, 2),
		},
		logo: { marginLeft: theme.spacing(1.5) },

		nav: { height: "100%" },
		list: {
			display: "flex",
			flexDirection: "column",
			flexWrap: "nowrap",

			height: "100%",
		},

		createTable: { marginTop: "auto" },
	})
);

export interface INavDrawerProps extends DrawerProps {
	handleCreateTable: () => void;
}

export default function NavDrawer({
	handleCreateTable,
	...props
}: INavDrawerProps) {
	const classes = useStyles();
	const theme = useTheme();
	const isSm = useMediaQuery(theme.breakpoints.down("md"));

	const { sections } = useRowyContext();
	const { location } = useRouter();
	const { hash } = location;

	return (
		<Drawer
			open
			variant={isSm ? "temporary" : "persistent"}
			{...props}
			classes={{ paper: classes.paper }}
		>
			<Grid
				container
				spacing={1}
				wrap="nowrap"
				alignItems="center"
				className={classes.logoRow}
			>
				<Grid item>
					<IconButton
						aria-label="Close navigation drawer"
						onClick={props.onClose as any}
						edge="start"
						size="large"
					>
						<CloseIcon />
					</IconButton>
				</Grid>

				<Grid item className={classes.logo}>
					<Logo />
				</Grid>
			</Grid>

			<nav className={classes.nav}>
				<List className={classes.list}>
					{sections &&
						Object.keys(sections).map((section) => (
							<li key={section}>
								<MenuItem
									component="a"
									href={`#${section}`}
									selected={
										section === decodeURIComponent(hash.replace("#", ""))
									}
									onClick={isSm ? (props.onClose as any) : undefined}
								>
									<ListItemText primary={section} />
								</MenuItem>
							</li>
						))}

					<li className={classes.createTable}>
						<MenuItem onClick={handleCreateTable}>
							<ListItemIcon>
								<AddIcon />
							</ListItemIcon>
							<ListItemText primary="Create Table" />
						</MenuItem>
					</li>
				</List>
			</nav>
		</Drawer>
	);
}
