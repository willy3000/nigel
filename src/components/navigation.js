import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircleOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom'

export default function Navigation() {

  const location = useLocation()

  console.log(location)

  return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
      <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Typography variant="h6">
          Admin Dashboard
        </Typography>
        <Typography variant="h9" sx={{backgroundColor: location.pathname === '/workers' ? 'white' : '', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', transitionDuration: '.3s'}}>
          {/* <Link to='/workers' style={{textDecoration: 'none', color: location.pathname === '/workers' ? 'lightgrey' : 'white', fontSize: location.pathname === '/workers' ? '18px' : '', transitionDuration: '.2s'}}> */}
          <Link to='/workers' style={{textDecoration: 'none', color: location.pathname === '/workers' ? 'black' : 'white', fontSize:location.pathname === '/workers' ? '18px' : ''}}>
          Manage Workers
          </Link>
        </Typography>
        <Typography variant="h9" sx={{backgroundColor: location.pathname === '/payments' ? 'white' : '', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', transitionDuration: '.3s'}}>
          <Link to='/payments' style={{textDecoration: 'none', color: location.pathname === '/payments' ? 'black' : 'white', fontSize:location.pathname === '/payments' ? '18px' : '', transitionDuration: '.2s'}}>
          Manage Payments
          </Link>
        </Typography>
        <Box sx={{display: 'flex', gap:"2px", alignItems: 'center'}}>
        <AccountCircleOutlined></AccountCircleOutlined>
        <Typography color="inherit">Admin</Typography>
        </Box>
      </Toolbar>
    </AppBar>
  </Box>
  )
}
