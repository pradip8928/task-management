import  React,{useContext} from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Container, Toolbar, Typography, Box, Button, IconButton, Menu, MenuItem, Tooltip, Avatar } from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import { AuthContext } from '../../contexts/AuthContext';


const pages = ['dashboard',   'register', 'login'];
const settings = ['profile', 'dashboard', 'logout'];

const Nav = () => {
  const { user, logout } = useContext(AuthContext);
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
  
    const handleOpenNavMenu = (event) => {
      setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
      setAnchorElUser(event.currentTarget);
    };
  
    const handleCloseNavMenu = () => {
      setAnchorElNav(null);
    };
  
    const handleCloseUserMenu = () => {
      setAnchorElUser(null);
    };
    const handleLogout = () => {
      logout(); // Call the logout function
      handleCloseUserMenu(); // Close the user menu
  };

  return (
    <AppBar position="static">
    <Container maxWidth="xl">
        <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography variant="h6" component={Link} to="/" sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none' }}>
                Task 
            </Typography>
            
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
                    <MenuIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorElNav}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                >
                       {user ? (
                            [
                                <MenuItem key="dashboard" component={Link} to="/">Dashboard</MenuItem>,
                                <MenuItem key="tasks" component={Link} to="/">Tasks</MenuItem>,
                                <MenuItem key="logout" onClick={handleLogout}>Logout</MenuItem>
                            ]
                        ) : (
                            [
                                <MenuItem key="register" component={Link} to="/register">Register</MenuItem>,
                                <MenuItem key="login" component={Link} to="/login">Login</MenuItem>
                            ]
                        )}
                </Menu>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {user ? (
                    <>
                        <Button component={Link} to="/" sx={{ my: 2, color: 'white' }}>Dashboard</Button>
                        <Button component={Link} to="/" sx={{ my: 2, color: 'white' }}>Tasks</Button>
                   
                        <Button onClick={handleLogout} sx={{ my: 2, color: 'white' }}>Logout</Button>

                        <Typography variant="h6"    sx={{ my:2,position:'absolute',textAlign:'right',right:'3vw', display: { xs: 'none', md: 'flex' }, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'suc', textDecoration: 'none' }}>
                            Welcome ,{user.username}
                        </Typography>
                    </>
                ) : (
                    <>
                        <Button component={Link} to="/register" sx={{ my: 2, color: 'white' }}>Register</Button>
                        <Button component={Link} to="/login" sx={{ my: 2, color: 'white' }}>Login</Button>
                    </>
                )}
            </Box>
           
        </Toolbar>
    </Container>
</AppBar>
  )
}

export default Nav
