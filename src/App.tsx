import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useState, useMemo } from 'react';

// Pages
import Home from './pages/Home';
import RecordHappiness from './pages/RecordHappiness';
import ViewHappiness from './pages/ViewHappiness';
import Calendar from './pages/Calendar';
import Profile from './pages/Profile';

// Context
import { HappinessProvider } from './store/HappinessContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#4caf50',
          },
          secondary: {
            main: '#ff9800',
          },
          background: {
            default: darkMode ? '#121212' : '#f5f5f5',
            paper: darkMode ? '#1e1e1e' : '#ffffff',
          },
        },
        typography: {
          fontFamily: "'Noto Sans KR', 'Roboto', 'Arial', sans-serif",
        },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HappinessProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/record" element={<RecordHappiness />} />
            <Route path="/view/:id" element={<ViewHappiness />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/profile" element={<Profile setDarkMode={setDarkMode} darkMode={darkMode} />} />
          </Routes>
        </Router>
      </HappinessProvider>
    </ThemeProvider>
  );
}

export default App;
