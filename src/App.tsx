import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { CameraSetting } from './CameraSetting';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useMemo } from 'react';

function App() {
  const theme = useMemo(() => {
    const theme = createMuiTheme({
      palette: {
        type: 'dark',
        primary: {
          main: '#81d4fa',
        },
      },
      typography: {
        button: {
          textTransform: 'none',
        },
      },
    });
    return {
      ...theme,
      overrides: {
        MuiFormControlLabel: {
          root: {
            // paddingRight: 8,
            marginLeft: 4,
            marginRight: 4,
          },
        },
      },
    };
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CameraSetting />
    </ThemeProvider>
  );
}

export default App;
