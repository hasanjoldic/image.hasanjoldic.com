import React, { useContext } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";

import LoadingButton from "@mui/lab/LoadingButton";

import { EActionType, StepContext } from "../state";

export const CustomStep: React.FC<{
  index: number;
  title: JSX.Element;
  content?: JSX.Element;
}> = ({ index, title, content }) => {
  const { dispatch, numberOfSteps, activeStep, toBeUploadedHashesLoading } =
    useContext(StepContext);

  const handleNextStep = () => {
    dispatch({ type: EActionType.NEXT_STEP });
  };

  const handlePreviousStep = () => {
    dispatch({ type: EActionType.PREVIOUS_STEP });
  };

  const handleReset = () => {
    dispatch({ type: EActionType.RESET });
  };

  console.log({
    activeStep,
    toBeUploadedHashesLoading,
  });

  return (
    <>
      <StepLabel>{title}</StepLabel>

      <StepContent>
        {content}
        <Box mt={2} display="flex" columnGap={4}>
          <LoadingButton
            onClick={handleNextStep}
            variant="contained"
            loading={activeStep === 1 && toBeUploadedHashesLoading}
          >
            {index < numberOfSteps - 1 ? "Continue" : "Finish"}
          </LoadingButton>
          <Button
            onClick={handlePreviousStep}
            variant="outlined"
            disabled={index === 0}
          >
            Back
          </Button>
          <Button onClick={handleReset} variant="outlined" color="warning">
            Reset
          </Button>
        </Box>
      </StepContent>
    </>
  );
};
