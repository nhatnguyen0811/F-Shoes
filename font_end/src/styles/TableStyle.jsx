import { tableCellClasses } from "@mui/material";

export const NoBoder = {
  [`& .${tableCellClasses.root}`]: {
    borderBottom: "none",
  },
};
export const BoderDotted = {
  [`& .${tableCellClasses.root}`]: {
    borderBottom: "1px dotted gray",
  },
};
