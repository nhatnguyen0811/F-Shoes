import {
  Autocomplete,
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import React from "react";

export default function InputForm({ id, label }) {
  return (
    <FormControl fullWidth sx={{ mt: "10px" }} size="small">
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput id={id} label={label} />
    </FormControl>
  );
}

export function InputFormGrid({ id, label }) {
  return (
    <Grid item xs={6}>
      <InputForm id={id} label={label} />
    </Grid>
  );
}

export function InputFormSelectGrid({ id, options, label }) {
  return (
    <Grid item xs={6}>
      <Autocomplete
        fullWidth
        sx={{ mt: "10px" }}
        size="small"
        disablePortal
        id="select-tinh"
        options={options}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </Grid>
  );
}
