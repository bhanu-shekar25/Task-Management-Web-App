import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7, Logout, Home } from '@mui/icons-material';
import { ThemeContext } from '../context/ThemeContext.jsx';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const { toggleDarkMode, isDarkMode } = useContext(ThemeContext);

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      // Also clear any other auth-related data
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate even if localStorage fails
      navigate('/login');
    }
  };

  const handleHomeClick = () => {
    navigate('/dashboard');
  };

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Button
          color="inherit"
          onClick={handleHomeClick}
          startIcon={<Home />}
          sx={{ 
            textTransform: 'none',
            fontSize: '1.25rem',
            fontWeight: 600,
            marginRight: 'auto'
          }}
        >
          TaskTrackr
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
            <IconButton 
              color="inherit" 
              onClick={toggleDarkMode}
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Logout">
            <IconButton 
              color="inherit" 
              onClick={handleLogout}
              aria-label="Logout"
            >
              <Logout />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;