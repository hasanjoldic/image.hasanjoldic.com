import { createContext } from "react";

interface State {
  activeStep: number;
  fileList?: FileList;
  hashes: string[];
  toBeUploadedHashes: string[];
  toBeUploadedHashesLoading: boolean;
  uploadedHashes: string[];
}

export const INITIAL_STATE: State = {
  activeStep: 0,
  hashes: [],
  toBeUploadedHashes: [],
  toBeUploadedHashesLoading: false,
  uploadedHashes: [],
};

export interface IStepContext extends State {
  dispatch: React.Dispatch<Action>;
  numberOfSteps: number;
}

export const StepContext = createContext<IStepContext>({
  ...INITIAL_STATE,
  dispatch: () => {},
  numberOfSteps: 0,
});

export enum EActionType {
  UPDATE_STATE = "UPDATE_STATE",
  RESET = "RESET",
  ADD_UPLOADED_HASH = "ADD_UPLOADED_HASH",
  NEXT_STEP = "NEXT_STEP",
  PREVIOUS_STEP = "PREVIOUS_STEP",
}

export interface Action {
  type: EActionType;
  payload?: any;
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case EActionType.UPDATE_STATE: {
      console.log({ ...state, ...action.payload });
      return { ...state, ...action.payload };
    }

    case EActionType.RESET: {
      return INITIAL_STATE;
    }

    case EActionType.ADD_UPLOADED_HASH: {
      return {
        ...state,
        uploadedHashes: [...state.uploadedHashes, action.payload],
      };
    }

    case EActionType.NEXT_STEP: {
      return {
        ...state,
        activeStep: state.activeStep + 1,
      };
    }

    case EActionType.PREVIOUS_STEP: {
      return {
        ...state,
        activeStep: state.activeStep - 1,
      };
    }

    default: {
      return state;
    }
  }
}
