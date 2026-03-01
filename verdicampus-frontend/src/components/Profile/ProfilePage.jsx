import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Avatar, Grid, Divider,
  List, ListItem, ListItemText, Chip, CircularProgress, Button
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SpaIcon from '@mui/icons-material/Spa';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const ProfilePage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail') || 'User';
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (userRole === 'STUDENT') {
          const response = await api.get(`/submissions/student/${userEmail}`);
          setSubmissions(response.data);
        } else {
          const response = await api.get('/submissions');
          setSubmissions(response.data);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [userEmail, userRole]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const totalPagesSaved = submissions.reduce((sum, sub) => sum + (sub.pagesSaved || 0), 0);
  const isStudent = userRole === 'STUDENT';

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 4, md: 8 }, mb: 6 }}>
      <Paper elevation={0} sx={{
        p: { xs: 3, sm: 5 },
        borderRadius: 5,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.05)',
        animation: 'fadeInUp 0.6s ease-out both',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background blur */}
        <Box sx={{
          position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46,125,50,0.1) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite'
        }} />

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          mb: 5,
          gap: 4,
          textAlign: { xs: 'center', sm: 'left' },
          position: 'relative', zIndex: 1
        }}>
          {/* Animated Avatar */}
          <Box sx={{ position: 'relative' }}>
            <Box sx={{
              position: 'absolute', top: -6, left: -6, right: -6, bottom: -6,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2e7d32, #00bfa5, #00897b, #2e7d32)',
              backgroundSize: '300% 300%',
              animation: 'rotateGlow 4s linear infinite',
              zIndex: 0
            }} />
            <Avatar sx={{
              width: { xs: 90, sm: 110 }, height: { xs: 90, sm: 110 },
              bgcolor: 'white', color: '#00897b',
              position: 'relative', zIndex: 1,
              border: '4px solid white'
            }}>
              <PersonIcon sx={{ fontSize: { xs: 50, sm: 60 } }} />
            </Avatar>
          </Box>

          <Box>
            <Typography variant="h3" sx={{
              fontWeight: 800,
              fontSize: { xs: '1.8rem', sm: '2.8rem' },
              background: 'linear-gradient(135deg, #1b5e20, #00897b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 0.5
            }}>
              {userEmail.split('@')[0]}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500, mb: 1.5 }}>
              {userEmail}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, mt: 1, justifyContent: { xs: 'center', sm: 'flex-start' }, alignItems: 'center' }}>
              <Chip
                label={isStudent ? 'Eco Student' : 'Faculty Member'}
                sx={{
                  fontWeight: 700,
                  background: isStudent ? 'linear-gradient(135deg, #2e7d32, #00897b)' : 'linear-gradient(135deg, #00897b, #0091ea)',
                  color: 'white',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}
              />
              <Button
                startIcon={<LogoutIcon />}
                color="error"
                size="small"
                variant="outlined"
                onClick={handleLogout}
                sx={{ borderRadius: 3, fontWeight: 'bold' }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 5, borderColor: 'rgba(0,0,0,0.06)' }} />

        {/* Stats Section with Hover Lift */}
        <Grid container spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{
              p: 3, textAlign: 'center', borderRadius: 4,
              border: '1px solid rgba(46,125,50,0.15)',
              background: 'linear-gradient(180deg, #f5faf5, #ffffff)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              animation: 'fadeInUp 0.5s ease-out 0.2s both',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 30px rgba(46,125,50,0.12)',
                borderColor: 'rgba(46,125,50,0.4)'
              }
            }}>
              <SpaIcon sx={{ fontSize: 44, mb: 1.5, color: '#2e7d32', animation: 'float 5s infinite' }} />
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#2e7d32' }}>
                {isStudent ? totalPagesSaved : '-'}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {isStudent ? 'Total Pages Saved' : 'Eco-Impact Managed'}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{
              p: 3, textAlign: 'center', borderRadius: 4,
              border: '1px solid rgba(0,137,123,0.15)',
              background: 'linear-gradient(180deg, #f0fdfb, #ffffff)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              animation: 'fadeInUp 0.5s ease-out 0.3s both',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 30px rgba(0,137,123,0.12)',
                borderColor: 'rgba(0,137,123,0.4)'
              }
            }}>
              <AssignmentIcon sx={{ fontSize: 44, mb: 1.5, color: '#00897b', animation: 'bounceSubtle 4s infinite' }} />
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#00897b' }}>
                {submissions.length}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {isStudent ? 'Projects Submitted' : 'Submissions Handled'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: 700, animation: 'fadeInUp 0.5s ease-out 0.4s both' }}>
          {isStudent ? 'Recent Activity' : 'Recent Submissions'}
        </Typography>
        <Paper variant="outlined" sx={{
          borderRadius: 4,
          border: '1px solid rgba(0,0,0,0.06)',
          animation: 'fadeInUp 0.5s ease-out 0.5s both',
          overflow: 'hidden'
        }}>
          <List sx={{ p: 0 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
            ) : submissions.length === 0 ? (
              <ListItem sx={{ p: 3 }}><ListItemText primary="No recent activity found. Start contributing to the green campus!" /></ListItem>
            ) : (
              submissions.slice(0, 5).map((sub, idx) => (
                <React.Fragment key={sub.id || idx}>
                  <ListItem sx={{
                    p: 2.5,
                    transition: 'background-color 0.2s ease',
                    '&:hover': { bgcolor: 'rgba(46,125,50,0.03)' }
                  }}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{sub.assignmentTitle}</Typography>
                      }
                      secondary={!isStudent ? `By ${sub.studentName} on ${new Date(sub.submittedAt).toLocaleDateString()}` : `Submitted on ${new Date(sub.submittedAt).toLocaleDateString()}`}
                    />
                    <Chip
                      label={sub.status}
                      sx={{
                        fontWeight: 'bold',
                        color: sub.status === 'Graded' ? 'white' : 'primary.main',
                        background: sub.status === 'Graded' ? 'linear-gradient(135deg, #2e7d32, #00c853)' : 'rgba(46,125,50,0.1)'
                      }}
                      size="small"
                    />
                  </ListItem>
                  {idx < Math.min(submissions.length, 5) - 1 && <Divider />}
                </React.Fragment>
              ))
            )}
          </List>
        </Paper>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
