import React, { useContext, useEffect } from "react";

import Typography from "@mui/material/Typography";

import { createHash } from "../utils";
import { EActionType, StepContext } from "../state";
import { CustomStep } from "./CustomStep";

export const Step2: React.FC = () => {
  return <CustomStep index={1} title={<Title />} content={<Content />} />;
};

const Title: React.FC = () => {
  const { toBeUploadedHashes } = useContext(StepContext);

  const info = toBeUploadedHashes.length + " can be uploaded";

  return <Typography>{info}</Typography>;
};

const Content: React.FC = () => {
  const { fileList, dispatch } = useContext(StepContext);

  useEffect(() => {
    if (!fileList) return;

    const files = Array.from(fileList);

    dispatch({
      type: EActionType.UPDATE_STATE,
      payload: { toBeUploadedHashesLoading: true },
    });

    Promise.all(files.map(createHash)).then((hashes) => {
      fetch(`http://localhost:3000/api/v1/files/check-by-hash`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hashes,
        }),
      }).then((res) => {
        if (res.ok) {
          res.json().then((toBeUploadedHashes) =>
            dispatch({
              type: EActionType.UPDATE_STATE,
              payload: {
                toBeUploadedHashes,
                toBeUploadedHashesLoading: false,
              },
            })
          );
        }
      });
    });
  }, [fileList, dispatch]);

  return null;
};
