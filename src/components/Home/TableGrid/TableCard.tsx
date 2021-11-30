import { Link } from "react-router-dom";

import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import GoIcon from "@src/assets/icons/Go";

import { Table } from "@src/contexts/ProjectContext";

export interface ITableCardProps extends Table {
  link: string;
  actions?: React.ReactNode;
}

export default function TableCard({
  section,
  name,
  description,
  link,
  actions,
}: ITableCardProps) {
  return (
    <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardActionArea
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          borderRadius: 2,
        }}
        component={Link}
        to={link}
      >
        <CardContent>
          <Typography variant="overline" component="p">
            {section}
          </Typography>
          <Typography variant="h6" component="h3" gutterBottom>
            {name}
          </Typography>
          <Typography
            color="textSecondary"
            sx={{
              minHeight: (theme) =>
                (theme.typography.body2.lineHeight as number) * 2 + "em",
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>

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
