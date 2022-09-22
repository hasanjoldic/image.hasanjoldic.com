import React, { useContext } from "react";

import Typography from "@mui/material/Typography";
import TextField, { TextFieldProps } from "@mui/material/TextField";

import { calculateFileListSize } from "../utils";
import { EActionType, StepContext } from "../state";

import { CustomStep } from "./CustomStep";

export const Step1: React.FC = () => {
  return <CustomStep index={0} title={<Title />} content={<Content />} />;
};

const Title: React.FC = () => {
  const { fileList } = useContext(StepContext);

  const length = fileList?.length ?? 0;

  const info =
    length + " files selected " + `(${calculateFileListSize(fileList)})`;

  return <Typography>{info}</Typography>;
};

const Content: React.FC = () => {
  const { dispatch } = useContext(StepContext);

  const handleChange: TextFieldProps["onChange"] = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch({
      type: EActionType.UPDATE_STATE,
      payload: { fileList: event.target.files || undefined },
    });
  };

  return (
    <TextField
      type="file"
      inputProps={{ multiple: true }}
      onChange={handleChange}
      fullWidth
    />
  );
};
