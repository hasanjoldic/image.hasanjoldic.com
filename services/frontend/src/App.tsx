import CssBaseline from "@mui/material/CssBaseline";

import { Page } from "@hasanjoldic/components";
import { ThemeProvider } from "@hasanjoldic/theme";

import { MultipleFilesUpload } from "./components";

function App() {
  return (
    <ThemeProvider cookie={undefined}>
      <CssBaseline />
      <Page onNavigate={console.log}>
        <MultipleFilesUpload />
      </Page>
    </ThemeProvider>
  );
}

export default App;
