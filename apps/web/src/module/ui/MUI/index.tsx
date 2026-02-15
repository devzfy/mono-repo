import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MUIDataGrid from "./DataGrid";

const muiDark = createTheme({
  palette: { mode: "dark" },
});

export default function MuiPage() {
  return (
    <ThemeProvider theme={muiDark}>
      <CssBaseline />
      <MUIDataGrid />
    </ThemeProvider>
  );
}