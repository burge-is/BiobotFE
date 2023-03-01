import '@/styles/globals.css'
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
     primary: {
        main: '#1976d2',
     },
  },
});
export default function App({ Component, pageProps }) {
  return <ThemeProvider theme={theme}>
    <Component {...pageProps} />
  </ThemeProvider>
}