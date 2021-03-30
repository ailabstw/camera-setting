import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { CameraSetting } from './CameraSetting';
import CssBaseline from '@material-ui/core/CssBaseline';

function App() {
  const theme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        main: '#424242',
      },
      secondary: {
        main: '#81d4fa',
      },
    },
    typography: {
      button: {
        textTransform: 'none',
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CameraSetting />
    </ThemeProvider>
  );
}

export default App;
