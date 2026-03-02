import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Container, Paper,
  Alert, CircularProgress, Tab, Tabs
} from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import LockIcon from '@mui/icons-material/Lock';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
    department: 'Engineering'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const url = isLogin
      ? '/auth/login'
      : '/auth/register';

    try {
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await api.post(url, payload);

      if (isLogin) {
        setSuccess('Login successful! Redirecting...');
        localStorage.setItem('userEmail', response.data.email);
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userRole', response.data.role);
        localStorage.setItem('userDept', response.data.department);
        setTimeout(() => {
          navigate(response.data.role === 'TEACHER' ? '/teacher-dashboard' : '/student-dashboard');
        }, 1500);
      } else {
        setSuccess('Registration successful! You can now login.');
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Floating leaves for background
  const floatingLeaves = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 90}%`,
    delay: `${Math.random() * 4}s`,
    duration: `${8 + Math.random() * 8}s`,
    size: 20 + Math.random() * 30,
  }));

  return (
    <Box sx={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #e8f5e9 0%, #e0f2f1 30%, #f5faf5 70%, #e8f5e9 100%)',
      backgroundSize: '300% 300%',
      animation: 'gradientShift 12s ease infinite',
    }}>
      {/* Floating leaves background */}
      {floatingLeaves.map((leaf) => (
        <Box key={leaf.id} sx={{
          position: 'absolute',
          left: leaf.left,
          top: '-40px',
          opacity: 0,
          animation: `leafFloat ${leaf.duration} linear ${leaf.delay} infinite`,
          pointerEvents: 'none',
          zIndex: 0
        }}>
          <SpaIcon sx={{ fontSize: leaf.size, color: 'rgba(46, 125, 50, 0.12)' }} />
        </Box>
      ))}

      {/* Background decorative circles */}
      <Box sx={{
        position: 'absolute', top: -100, right: -100,
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(46,125,50,0.06) 0%, transparent 70%)',
        animation: 'float 8s ease-in-out infinite'
      }} />
      <Box sx={{
        position: 'absolute', bottom: -80, left: -80,
        width: 250, height: 250, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,137,123,0.06) 0%, transparent 70%)',
        animation: 'float 10s ease-in-out infinite 2s'
      }} />

      <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper elevation={0} sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 5,
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.6)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          animation: 'scaleIn 0.5s ease-out both',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 16px 60px rgba(0,0,0,0.12)',
          }
        }}>
          {/* Logo icon */}
          <Box sx={{
            width: 56, height: 56, borderRadius: '16px',
            background: 'linear-gradient(135deg, #2e7d32, #00897b)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            mb: 2,
            animation: 'bounceSubtle 3s ease-in-out infinite',
            boxShadow: '0 4px 20px rgba(46,125,50,0.3)'
          }}>
            <SpaIcon sx={{ color: 'white', fontSize: 30 }} />
          </Box>

          <Typography component="h1" variant="h4" sx={{
            fontWeight: 800,
            mb: 0.5,
            background: 'linear-gradient(135deg, #1b5e20, #00897b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {isLogin ? 'Sign in to your eco-campus' : 'Join the green revolution'}
          </Typography>

          <Tabs
            value={isLogin ? 0 : 1}
            onChange={(_, val) => setIsLogin(val === 0)}
            sx={{
              mb: 3,
              '& .MuiTab-root': {
                fontWeight: 600,
                minWidth: 100,
                transition: 'all 0.3s ease',
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: 2,
                background: 'linear-gradient(90deg, #2e7d32, #00897b)',
              }
            }}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab icon={<LockIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Login" />
            <Tab icon={<PersonAddIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Register" />
          </Tabs>

          {error && <Alert severity="error" sx={{ width: '100%', mb: 2, borderRadius: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ width: '100%', mb: 2, borderRadius: 3 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            {!isLogin && (
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              />
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />

            {!isLogin && (
              <TextField
                select
                margin="normal"
                required
                fullWidth
                label="Department / Course"
                name="department"
                value={formData.department}
                onChange={handleChange}
                SelectProps={{ native: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              >
                <option value="Engineering">Engineering</option>
                <option value="BSc">BSc (Science)</option>
                <option value="BCom">BCom (Commerce)</option>
                <option value="Arts">Arts / Humanities</option>
                <option value="UG-Other">Other UG Degrees</option>
                <option value="PG-Degrees">PG Degrees</option>
              </TextField>
            )}

            {!isLogin && (
              <TextField
                select
                margin="normal"
                required
                fullWidth
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                SelectProps={{ native: true }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
              >
                <option value="STUDENT">Student</option>
                <option value="TEACHER">Teacher</option>
              </TextField>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3, mb: 2, py: 1.5, fontSize: '1rem',
                borderRadius: 3,
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2e7d32 0%, #00897b 100%)',
                boxShadow: '0 4px 20px rgba(46, 125, 50, 0.3)',
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(46, 125, 50, 0.4)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : (isLogin ? 'Sign In' : 'Sign Up')}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
