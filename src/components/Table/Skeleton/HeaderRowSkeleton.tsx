import { Stack, Skeleton, Button } from "@material-ui/core";
import AddColumnIcon from "assets/icons/AddColumn";

const NUM_CELLS = 5;

export default function HeaderRowSkeleton() {
	return (
		<Stack direction="row" alignItems="center">
			{new Array(NUM_CELLS + 1).fill(undefined).map((_, i) => (
				<Skeleton
					key={i}
					variant="rectangular"
					sx={{
						bgcolor: "background.default",
						border: "1px solid",
						borderColor: "divider",
						borderLeftWidth: 0,
						width: i === NUM_CELLS ? 46 : 150,
						height: 44,
						borderRadius: i === NUM_CELLS ? 1 : 0,
						borderTopLeftRadius: 0,
						borderBottomLeftRadius: 0,
					}}
				/>
			))}

			<Skeleton sx={{ transform: "none", ml: (-46 + 6) / 8, borderRadius: 1 }}>
				<Button variant="contained" startIcon={<AddColumnIcon />}>
					Add Column
				</Button>
			</Skeleton>
		</Stack>
	);
}
