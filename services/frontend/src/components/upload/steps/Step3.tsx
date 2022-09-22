import React, { useContext, useState } from "react";

import axios from "axios";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import LoadingButton from "@mui/lab/LoadingButton";

import { createHash } from "../utils";
import { EActionType, StepContext } from "../state";

import { CustomStep } from "./CustomStep";

export const Step3: React.FC = () => {
  return <CustomStep index={1} title={<Title />} content={<Content />} />;
};

const Title: React.FC = () => {
  const { uploadedHashes } = useContext(StepContext);

  return <Typography>{uploadedHashes?.length} have been uploaded</Typography>;
};

const Content: React.FC = () => {
  const { dispatch, fileList, uploadedHashes, toBeUploadedHashes } =
    useContext(StepContext);

  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!fileList) return;
    setLoading(true);

    for (const file of fileList) {
      const hash = await createHash(file);

      if (!toBeUploadedHashes.includes(hash)) continue;

      const formData = new FormData();

      formData.append("file", file);
      formData.append("mimeTypeId", "68de3a68-7f4d-4827-9d45-c23a2b7c65de");

      try {
        await axios.request({
          method: "POST",
          url: "http://localhost:3000/api/v1/files",
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        dispatch({
          type: EActionType.ADD_UPLOADED_HASH,
          payload: hash,
        });
      } catch (error) {
        console.log(error);
      }
    }

    setLoading(false);
  };

  const progress = Math.round(
    (uploadedHashes.length / toBeUploadedHashes.length) * 100
  );

  return (
    <Box display="flex" flexDirection="column" rowGap={2}>
      <LoadingButton
        onClick={handleClick}
        variant="contained"
        disabled={loading}
        loading={loading}
      >
        <Box>
          <Typography>Upload {toBeUploadedHashes?.length} files</Typography>
          {loading && (
            <LinearProgress
              variant="determinate"
              value={progress}
              color="info"
            />
          )}
        </Box>
      </LoadingButton>
    </Box>
  );
};
