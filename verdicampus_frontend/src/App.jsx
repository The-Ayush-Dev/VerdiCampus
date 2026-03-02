import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, Drawer, List,
  ListItem, ListItemIcon, ListItemText, IconButton, Container,
  Divider, Avatar, ListItemButton, Paper, LinearProgress
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LoginIcon from '@mui/icons-material/Login';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AnalyticsIcon from '@mui/icons-material/Assessment';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import SpaIcon from '@mui/icons-material/Spa';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupsIcon from '@mui/icons-material/Groups';

import LoginPage from './components/Auth/Login.jsx';
import StudentDashboard from './components/Dashboards/StudentDashboard.jsx';
import TeacherDashboard from './components/Dashboards/TeacherDashboard.jsx';
import NoticesPage from './components/Notices/NoticesPage.jsx';
import AnalyticsPage from './components/Analytics/AnalyticsPage.jsx';
import ProfilePage from './components/Profile/ProfilePage.jsx';
import ResourcesHub from './components/Resources/ResourcesHub.jsx';
import CommunityHub from './components/Community/CommunityHub.jsx';
import HomePage from './components/Home/HomePage.jsx';
import EcoBot from './components/EcoBot.jsx';

const drawerWidth = 270;

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [ecoProgress, setEcoProgress] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUserEmail(localStorage.getItem('userEmail'));
    setUserRole(localStorage.getItem('userRole'));
  }, [location.pathname]);

  // Animate eco-level progress bar
  useEffect(() => {
    const timer = setTimeout(() => setEcoProgress(65), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserEmail(null);
    setUserRole(null);
    navigate('/login');
    setMobileOpen(false);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Smart Notices', icon: <NotificationsIcon />, path: '/notices' },
    { text: 'Eco Analytics', icon: <SpaIcon />, path: '/analytics' },
    { text: 'Resources Hub', icon: <MenuBookIcon />, path: '/resources' },
    { text: 'Community Hub', icon: <GroupsIcon />, path: '/community' },
    { text: 'Student Portal', icon: <SchoolIcon />, path: '/student-dashboard', role: 'STUDENT' },
    { text: 'Faculty Portal', icon: <DashboardIcon />, path: '/teacher-dashboard', role: 'TEACHER' },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.role) return true;
    if (!userRole) return false;
    return item.role === userRole;
  });

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fafffe' }}>
      {/* Animated gradient sidebar header */}
      <Toolbar sx={{
        background: 'linear-gradient(135deg, #1b5e20 0%, #00897b 50%, #2e7d32 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradientShift 6s ease infinite',
        color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        mb: 2,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <SpaIcon sx={{ mr: 1, animation: 'swing 3s ease-in-out infinite' }} />
        <Typography variant="h6" noWrap sx={{ fontWeight: 800, letterSpacing: 1.5 }}>
          VERDICAMPUS
        </Typography>
        {/* Decorative shimmer overlay */}
        <Box sx={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s infinite',
          pointerEvents: 'none'
        }} />
      </Toolbar>

      <List sx={{ px: 2, flexGrow: 1 }}>
        {filteredMenuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              disablePadding
              key={item.text}
              sx={{
                mb: 0.5,
                animation: 'fadeInLeft 0.4s ease-out both',
                animationDelay: `${index * 0.05}s`
              }}
            >
              <ListItemButton
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                selected={isActive}
                sx={{
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #2e7d32 0%, #00897b 100%)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)',
                    '&:hover': { background: 'linear-gradient(135deg, #1b5e20 0%, #00695c 100%)' },
                    '& .MuiListItemIcon-root': { color: 'white' }
                  },
                  '&:hover': {
                    bgcolor: 'rgba(46, 125, 50, 0.08)',
                    transform: 'translateX(4px)',
                    '& .MuiListItemIcon-root': {
                      animation: 'bounceSubtle 0.6s ease'
                    }
                  }
                }}
              >
                <ListItemIcon sx={{
                  color: isActive ? 'white' : '#2e7d32',
                  minWidth: 40,
                  transition: 'all 0.3s ease'
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.93rem',
                    letterSpacing: 0.3
                  }}
                />
                {/* Active indicator dot */}
                {isActive && (
                  <Box sx={{
                    width: 6, height: 6, borderRadius: '50%',
                    bgcolor: '#00e676',
                    boxShadow: '0 0 8px #00e676',
                    animation: 'pulse 2s ease-in-out infinite'
                  }} />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {userEmail && (
        <Box sx={{ p: 2, animation: 'fadeInUp 0.6s ease-out 0.3s both' }}>
          <Paper elevation={0} sx={{
            p: 2.5,
            background: 'linear-gradient(135deg, #e8f5e9 0%, #e0f2f1 100%)',
            borderRadius: 4,
            border: '1px solid rgba(46, 125, 50, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 4px 20px rgba(46, 125, 50, 0.15)',
              transform: 'translateY(-2px)'
            }
          }}>
            <SpaIcon sx={{
              position: 'absolute',
              right: -10,
              bottom: -10,
              fontSize: 80,
              color: 'rgba(46, 125, 50, 0.08)',
              animation: 'float 5s ease-in-out infinite',
              zIndex: 0
            }} />
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="caption" sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #2e7d32, #00897b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: 1.5
              }}>
                YOUR ECO-LEVEL
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1b5e20' }}>
                Green Guardian
              </Typography>
              <Box sx={{ mt: 1, mb: 0.5 }}>
                <LinearProgress
                  variant="determinate"
                  value={ecoProgress}
                  sx={{
                    height: 7,
                    borderRadius: 4,
                    bgcolor: 'rgba(46, 125, 50, 0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #2e7d32, #00bfa5)',
                      borderRadius: 4,
                      transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1) !important'
                    }
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                65% to next tree planted 🌳
              </Typography>
            </Box>
          </Paper>
        </Box>
      )}

      <Divider sx={{ mx: 2, borderColor: 'rgba(0,0,0,0.06)' }} />
      <List sx={{ px: 2, py: 2 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            onClick={() => { navigate('/profile'); setMobileOpen(false); }}
            selected={location.pathname === '/profile'}
            sx={{
              borderRadius: 3,
              '&:hover': { bgcolor: 'rgba(0, 137, 123, 0.08)' }
            }}
          >
            <ListItemIcon sx={{ color: '#00897b', minWidth: 40 }}><PersonIcon /></ListItemIcon>
            <ListItemText primary="My Profile" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout} sx={{
            borderRadius: 3,
            '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.06)' }
          }}>
            <ListItemIcon sx={{ minWidth: 40 }}><LoginIcon /></ListItemIcon>
            <ListItemText primary={userEmail ? "Logout" : "Login / Register"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Glassmorphism AppBar */}
      <AppBar position="fixed" elevation={0} sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        color: 'text.primary',
        borderBottom: '1px solid rgba(46, 125, 50, 0.1)',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, #2e7d32, #00897b, #00bfa5, #00897b, #2e7d32)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 4s linear infinite',
        }
      }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <SpaIcon sx={{
            mr: 1,
            color: '#2e7d32',
            animation: 'swing 4s ease-in-out infinite'
          }} />
          <Typography variant="h6" noWrap component="div" sx={{
            flexGrow: 1,
            fontWeight: 800,
            letterSpacing: 1.5,
            background: 'linear-gradient(135deg, #1b5e20 0%, #00897b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            VERDICAMPUS
          </Typography>
          {userEmail && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1 }}>{userEmail.split('@')[0]}</Typography>
                <Typography variant="caption" color="text.secondary">{userRole}</Typography>
              </Box>
              <IconButton
                onClick={() => navigate('/profile')}
                sx={{
                  p: 0.5,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -2, left: -2, right: -2, bottom: -2,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2e7d32, #00bfa5, #2e7d32)',
                    backgroundSize: '200% 200%',
                    animation: 'gradientShift 3s ease infinite',
                    zIndex: 0,
                  }
                }}
              >
                <Avatar sx={{
                  width: 34, height: 34,
                  bgcolor: '#2e7d32',
                  position: 'relative',
                  zIndex: 1,
                  border: '2px solid white'
                }}>
                  <PersonIcon sx={{ fontSize: 20 }} />
                </Avatar>
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, border: 'none', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid rgba(0,0,0,0.06)' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          minHeight: '100vh',
          bgcolor: '#f5faf5',
          px: { xs: 1, sm: 0 },
          overflowX: 'hidden'
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/resources" element={<ResourcesHub />} />
          <Route path="/community" element={<CommunityHub />} />
        </Routes>
      </Box>

      {/* Floating AI Eco-Bot */}
      <EcoBot />
    </Box>
  );
}

export default App;
