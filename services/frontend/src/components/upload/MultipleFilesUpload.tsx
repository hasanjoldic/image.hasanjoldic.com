import React, { useReducer } from "react";

import { INITIAL_STATE, reducer, StepContext } from "./state";
import { Steps } from "./steps";

const numberOfSteps = 3;

export const MultipleFilesUpload: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const {
    activeStep,
    fileList,
    hashes,
    toBeUploadedHashes,
    toBeUploadedHashesLoading,
    uploadedHashes,
  } = state;

  return (
    <StepContext.Provider
      value={{
        activeStep,
        fileList,
        hashes,
        toBeUploadedHashes,
        toBeUploadedHashesLoading,
        uploadedHashes,
        dispatch,
        numberOfSteps,
      }}
    >
      <Steps />
    </StepContext.Provider>
  );
};
