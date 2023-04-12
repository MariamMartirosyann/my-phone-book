import { Typography } from "@mui/material";
import { IContact } from "../../app/intrefaces";

export const columns = [
  {
    label: "Name",
    field: "name",
  },
  {
    label: "Number",
    field: "number",
    layout: (row: IContact) => (
      <Typography>
        {row.number.map((i, key) => (
          <li key={i.id}>{i.value}</li>
        ))}
      </Typography>
    ),
  },
  {
    label: "Email",
    field: "email",
    layout: (row: IContact) => (
      <Typography>
        {row.email.map((i, key) => (
          <li key={i.id}>{i.value}</li>
        ))}
      </Typography>
    ),
  },
];

export const columnsSmall = [
  {
    label: "Name",
    field: "name",
  },
 
];


export const removeContactWarningConfig = {
  title: "Warning",
  description: "Are you sure you want to delete this contact???",
};
