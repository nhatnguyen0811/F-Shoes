import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

export default function LabelTitle({ text }) {
  return (
    <Box sx={{ my: 1 }}>
      <Box
        sx={{
          borderBottom: "2px solid black",
        }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "monospace",
            fontSize: "20px",
            fontWeight: 700,
            color: "black",
            display: "inline-block",
            border: "2px solid black",
            borderBottom: "none",
            p: 0.5,
          }}>
          {text}
        </Typography>
      </Box>
    </Box>
  );
}
