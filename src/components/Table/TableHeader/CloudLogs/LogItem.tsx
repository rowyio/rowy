import {
  styled,
  Accordion as MuiAccordion,
  AccordionProps as MuiAccordionProps,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Accordion = styled((props: MuiAccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))({
  marginTop: 0,
  "&.Mui-expanded:before": { opacity: 1 },
});

export interface ILogItemProps {}

export default function LogItem(props: ILogItemProps) {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
        style={{ padding: 0 }}
      >
        <Typography sx={{ width: "33%", flexShrink: 0 }}>
          General settings
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          I am an accordion
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
          Aliquam eget maximus est, id dignissim quam.
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}
