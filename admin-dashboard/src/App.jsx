import React, { useState, useEffect } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// 페이지 임포트 (나중에 구현)
// import Dashboard from './pages/Dashboard';
// import Login from './pages/Login';
// import Users from './pages/Users';
// import Drones from './pages/Drones';
// import Missions from './pages/Missions';
// import Header from './components/Common/Header';
// import Sidebar from './components/Common/Sidebar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const dispatch = useDispatch();
  // const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          {/* <Sidebar /> */}
          <Box sx={{ flexGrow: 1 }}>
            {/* <Header /> */}
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Routes>
                {/* <Route path="/" element={<Dashboard />} /> */}
                {/* <Route path="/login" element={<Login />} /> */}
                {/* <Route path="/users" element={<Users />} /> */}
                {/* <Route path="/drones" element={<Drones />} /> */}
                {/* <Route path="/missions" element={<Missions />} /> */}
                <Route path="/" element={
                  <Box sx={{ textAlign: 'center', mt: 10 }}>
                    <h1>🎉 SOONDRONE GCS 관리자 대시보드</h1>
                    <p>준비 중입니다...</p>
                  </Box>
                } />
              </Routes>
            </Container>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
