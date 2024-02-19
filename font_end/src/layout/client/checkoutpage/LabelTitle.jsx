import { Typography } from "@mui/material";
import React from "react";

export default function LabelTitle({ title }) {
  return (
    <Typography
      variant="h6"
      sx={{
        textAlign: "center",
        fontFamily: "monospace",
        fontWeight: "900",
        fontSize: "25px",
      }}>
      {title}
    </Typography>
  );
}
