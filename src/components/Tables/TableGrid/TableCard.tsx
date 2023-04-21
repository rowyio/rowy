import { Link, useNavigate } from "react-router-dom";

import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  Button,
  Box,
} from "@mui/material";
import { Go as GoIcon } from "@src/assets/icons";
import { TableSettings } from "@src/types/table";

export interface ITableCardProps extends TableSettings {
  link: string;
  actions?: React.ReactNode;
}

export default function TableCard({
  thumbnailURL,
  section,
  name,
  description,
  link,
  actions,
}: ITableCardProps) {
  const navigate = useNavigate();
  return (
    <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardActionArea component={Link} to={link}>
        <CardContent style={{ paddingBottom: 0 }}>
          <Typography variant="overline" component="p">
            {section}
          </Typography>
          <Typography variant="h6" component="h3" gutterBottom>
            {name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardContent style={{ flexGrow: 1, paddingTop: 0 }}>
        {thumbnailURL && (
          <Box
            sx={{
              paddingBottom: "56.25%",
              position: "relative",
              backgroundColor: "action.input",
              borderRadius: 1,
              overflow: "hidden",
              "&:hover": {
                cursor: "pointer",
              },
            }}
            onClick={() => navigate(link)}
          >
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundImage: `url("${thumbnailURL}")`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }}
            />
          </Box>
        )}
        {description && (
          <Typography
            color="textSecondary"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            component="div"
          >
            {description}
          </Typography>
        )}
      </CardContent>

      <CardActions>
        <Button
          variant="text"
          color="primary"
          endIcon={<GoIcon />}
          component={Link}
          to={link}
        >
          Open
        </Button>

        <div style={{ flexGrow: 1 }} />

        {actions}
      </CardActions>
    </Card>
  );
}
