import { ThemeProvider, createTheme } from "@mui/material";
import { useSelector } from "react-redux";

const ThemeProviderWrapper = ({ children }) => {
  const isDark = useSelector((state) => state.theme.isDark);

  const defaultTheme = createTheme();

  const theme = createTheme({
    ...defaultTheme,
    palette: {
      ...defaultTheme.palette,
      type: isDark ? "dark" : "light",
      error: {
        main: isDark ? "#a1128e" : "#ff0000",
      },
      primary: {
        main: isDark ? "#128217" : "#1976D2",
      },
    },
    components: {
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: isDark ? "#055e66" : "#000",
            "&.Mui-error": {
              color: isDark ? "#a1128e" : "#ff0000",
            },
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          filterForm: {
            backgroundColor: isDark ? "#64748B" : "#fff",
          },
          panel: {
            backgroundColor: isDark ? "#64748B" : "#fff",
          },
          panelHeader: {
            backgroundColor: isDark ? "#64748B" : "#fff",
          },
          panelContent: {
            backgroundColor: isDark ? "#64748B" : "#fff",
          },
          panelFooter: {
            backgroundColor: isDark ? "#64748B" : "#fff",
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            color: isDark ? "#fff" : "#000",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: isDark ? "#055e66" : "#000",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            color: isDark ? "#055e66" : "#000",
            "&::placeholder": {
              color: isDark ? "#055e66" : "#000",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: isDark ? "#64748B" : "#c0c082 !important",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: isDark ? "#fff" : "#000",
          },
        },
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            color: isDark ? "#0f240f !important" : "#1976D2",
            "&.homeButtonMargin": {
              margin: "1rem !important",
            },
            "&.socialLoginButtonMargin": {
              backgroundColor: "transparent !important",
              margin: "0 !important",
              marginLeft: "1rem !important",
              flexGrow: 1,
              boxShadow: "none !important",
              "&:hover": {
                backgroundColor: "transparent !important",
                boxShadow: "none !important",
                transition: "none !important",
              },
            },
          },
        },
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default ThemeProviderWrapper;
