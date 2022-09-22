import React, { useContext } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";

import { EActionType, StepContext } from "../state";

import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";

export const Steps: React.FC = () => {
  const { dispatch, activeStep, numberOfSteps } = useContext(StepContext);

  return (
    <Box>
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <Step1 />
        </Step>
        <Step>
          <Step2 />
        </Step>
        <Step>
          <Step3 />
        </Step>
      </Stepper>

      {activeStep === numberOfSteps && (
        <Box mt={2}>
          <Button
            onClick={() =>
              dispatch({
                type: EActionType.RESET,
                payload: { activeStep: 0 },
              })
            }
          >
            Upload more files
          </Button>
        </Box>
      )}
    </Box>
  );
};
