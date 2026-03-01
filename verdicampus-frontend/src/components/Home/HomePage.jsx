import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Typography, Container, Button, Grid, Card, CardContent,
  Paper, Divider, useTheme, IconButton, Tooltip
} from '@mui/material';
import { Link } from 'react-router-dom';
import SpaIcon from '@mui/icons-material/Spa';
import SchoolIcon from '@mui/icons-material/School';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

const quotes = [
  { text: "The greatest threat to our planet is the belief that someone else will save it.", author: "Robert Swan" },
  { text: "Earth provides enough to satisfy every man's needs, but not every man's greed.", author: "Mahatma Gandhi" },
  { text: "The environment is where we all meet; where all have a mutual interest; it is the one thing all of us share.", author: "Lady Bird Johnson" },
  { text: "He that plants trees loves others besides himself.", author: "Thomas Fuller" }
];

// Animated Counter Component
const AnimatedCounter = ({ target, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !hasStarted) setHasStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [hasStarted, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const HomePage = () => {
  const theme = useTheme();
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteVisible, setQuoteVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteVisible(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setQuoteVisible(true);
      }, 400);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const actionCards = [
    {
      title: 'Digital Submission',
      desc: 'Submit your journals and assignments paper-free.',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      path: '/student-dashboard',
      gradient: 'linear-gradient(135deg, #2e7d32, #00897b)'
    },
    {
      title: 'Smart Notices',
      desc: 'Real-time campus updates delivered to your phone.',
      icon: <NotificationsActiveIcon sx={{ fontSize: 40 }} />,
      path: '/notices',
      gradient: 'linear-gradient(135deg, #1b5e20, #2e7d32)'
    },
    {
      title: 'Impact Analytics',
      desc: 'Watch the campus forest grow as we save paper.',
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      path: '/analytics',
      gradient: 'linear-gradient(135deg, #00897b, #0091ea)'
    },
    {
      title: 'Resources Hub',
      desc: 'Access textbooks and schedules digitally.',
      icon: <LocalLibraryIcon sx={{ fontSize: 40 }} />,
      path: '/resources',
      gradient: 'linear-gradient(135deg, #43a047, #00c853)'
    }
  ];

  // Generate floating leaves for hero
  const floatingLeaves = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${10 + Math.random() * 80}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${6 + Math.random() * 6}s`,
    size: 16 + Math.random() * 24,
  }));

  return (
    <Box>
      {/* === HERO SECTION with Animated Gradient & Floating Leaves === */}
      <Box sx={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 30%, #00897b 70%, #1b5e20 100%)',
        backgroundSize: '300% 300%',
        animation: 'gradientShift 8s ease infinite',
        color: 'white',
        pt: { xs: 8, md: 12 },
        pb: { xs: 10, md: 15 },
        borderRadius: { xs: 0, md: '0 0 50px 50px' },
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
      }}>
        {/* Floating leaf particles */}
        {floatingLeaves.map((leaf) => (
          <Box key={leaf.id} sx={{
            position: 'absolute',
            left: leaf.left,
            top: '-40px',
            opacity: 0,
            animation: `leafFloat ${leaf.duration} linear ${leaf.delay} infinite`,
            pointerEvents: 'none',
            zIndex: 1
          }}>
            <SpaIcon sx={{ fontSize: leaf.size, color: 'rgba(255,255,255,0.25)' }} />
          </Box>
        ))}

        {/* Background Decorative Elements */}
        <Box sx={{
          position: 'absolute', top: -20, right: -20, opacity: 0.06,
          transform: 'rotate(45deg)',
          animation: 'float 6s ease-in-out infinite'
        }}>
          <SpaIcon sx={{ fontSize: 300 }} />
        </Box>
        <Box sx={{
          position: 'absolute', bottom: -50, left: -50, opacity: 0.06,
          animation: 'float 8s ease-in-out infinite 1s'
        }}>
          <SpaIcon sx={{ fontSize: 250 }} />
        </Box>

        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Box sx={{
                position: 'relative', zIndex: 2,
                animation: 'fadeInUp 0.8s ease-out both'
              }}>
                <Typography variant="overline" sx={{
                  letterSpacing: 4,
                  fontWeight: 'bold',
                  opacity: 0.85,
                  fontSize: '0.85rem'
                }}>
                  ✦ INTRODUCING GREEN-SYNC ✦
                </Typography>
                <Typography variant="h1" sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2.2rem', sm: '3rem', md: '4.5rem' },
                  mb: 2,
                  lineHeight: 1.1,
                  background: 'linear-gradient(135deg, #ffffff 0%, #a5d6a7 50%, #ffffff 100%)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'shimmer 4s linear infinite',
                }}>
                  VerdiCampus
                </Typography>
                <Typography variant="h5" sx={{
                  mb: 4, opacity: 0.9, fontWeight: 400, lineHeight: 1.6,
                  fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' },
                  animation: 'fadeInUp 0.8s ease-out 0.2s both'
                }}>
                  Our mission is to eliminate 100% of campus paper waste through a unified digital ecosystem. Join the movement toward a sustainable future.
                </Typography>
                <Box sx={{
                  display: 'flex', gap: 2, flexWrap: 'wrap',
                  animation: 'fadeInUp 0.8s ease-out 0.4s both'
                }}>
                  <Button
                    component={Link}
                    to="/student-dashboard"
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: 'white',
                      color: '#1b5e20',
                      fontWeight: 'bold',
                      px: 4,
                      background: 'white !important',
                      '&:hover': {
                        bgcolor: '#f0f0f0',
                        background: '#f0f0f0 !important',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                      }
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    component={Link}
                    to="/analytics"
                    variant="outlined"
                    size="large"
                    sx={{
                      color: 'white',
                      borderColor: 'rgba(255,255,255,0.6)',
                      px: 4,
                      borderWidth: 2,
                      backdropFilter: 'blur(4px)',
                      '&:hover': {
                        borderColor: 'white',
                        bgcolor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-3px)'
                      }
                    }}
                  >
                    View Live Impact
                  </Button>
                </Box>
              </Box>
            </Grid>

            {/* Tree Visual for the Hero */}
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <Box sx={{
                width: '100%',
                maxWidth: 400,
                height: 400,
                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 70%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                animation: 'scaleIn 1s ease-out 0.3s both'
              }}>
                <SpaIcon sx={{
                  fontSize: 240,
                  color: 'white',
                  opacity: 0.9,
                  animation: 'float 5s ease-in-out infinite',
                  filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.2))'
                }} />
                <Box sx={{
                  position: 'absolute',
                  bottom: 40,
                  bgcolor: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(12px)',
                  p: 2,
                  borderRadius: 3,
                  border: '1px solid rgba(255,255,255,0.2)',
                  animation: 'fadeInUp 0.8s ease-out 0.6s both'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    <AnimatedCounter target={1200} suffix="+" /> Trees Saved
                  </Typography>
                  <Typography variant="caption">Projected yearly impact</Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* === QUOTE SECTION with Crossfade === */}
      <Container maxWidth="md" sx={{ mt: { xs: -4, md: -6 }, px: { xs: 2, sm: 3 }, position: 'relative', zIndex: 2 }}>
        <Paper elevation={10} sx={{
          p: 4,
          borderRadius: 4,
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: '4px solid transparent',
          borderImage: 'linear-gradient(90deg, #2e7d32, #00897b, #00bfa5) 1',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
            transform: 'translateY(-4px)'
          }
        }}>
          <FormatQuoteIcon sx={{ fontSize: 60, color: '#00897b', mb: -2, opacity: 0.4 }} />
          <Box sx={{
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            opacity: quoteVisible ? 1 : 0,
            transform: quoteVisible ? 'translateY(0)' : 'translateY(10px)'
          }}>
            <Typography variant="h5" sx={{
              fontStyle: 'italic', fontWeight: 500, mb: 2,
              fontSize: { xs: '1rem', sm: '1.3rem', md: '1.5rem' }
            }}>
              "{quotes[quoteIndex].text}"
            </Typography>
            <Typography variant="subtitle1" sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #2e7d32, #00897b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              — {quotes[quoteIndex].author}
            </Typography>
          </Box>
        </Paper>
      </Container>

      {/* === ACTION CARDS with Staggered Entrance === */}
      <Container maxWidth="lg" sx={{ mt: { xs: 5, md: 10 }, mb: { xs: 5, md: 10 }, px: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" align="center" sx={{
          fontWeight: 800, mb: 6,
          background: 'linear-gradient(135deg, #1b5e20, #00897b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Explore the Ecosystem
        </Typography>
        <Grid container spacing={4}>
          {actionCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                component={Link}
                to={card.path}
                sx={{
                  height: '100%',
                  textDecoration: 'none',
                  borderRadius: 5,
                  border: '1px solid rgba(0,0,0,0.06)',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '4px',
                    background: card.gradient,
                    transition: 'height 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-12px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                    '&::before': { height: '6px' },
                    '& .card-icon': {
                      transform: 'scale(1.15) rotate(-5deg)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }
                  }
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box className="card-icon" sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '20px',
                    background: card.gradient,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}>
                    {card.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: 'text.primary' }}>
                    {card.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* === SUSTAINABILITY STATS SECTION === */}
      <Box sx={{
        background: 'linear-gradient(180deg, #e8f5e9 0%, #e0f2f1 100%)',
        py: 10,
        borderRadius: { md: '80px 80px 0 0' },
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle floating decoration */}
        <SpaIcon sx={{
          position: 'absolute', top: 40, right: 60,
          fontSize: 120, color: 'rgba(46,125,50,0.04)',
          animation: 'float 7s ease-in-out infinite'
        }} />
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{
                p: 2, borderRadius: 5, overflow: 'hidden',
                animation: 'fadeInLeft 0.8s ease-out both'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Nature"
                  style={{
                    width: '100%',
                    borderRadius: '24px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                    transition: 'transform 0.5s ease',
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ animation: 'slideInRight 0.8s ease-out both' }}>
                <Typography variant="h3" sx={{
                  fontWeight: 800, mb: 3,
                  fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
                  background: 'linear-gradient(135deg, #1b5e20, #00897b)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Why Go Paperless?
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem', color: 'text.secondary', lineHeight: 1.8 }}>
                  Academic paper usage is one of the highest contributors to campus carbon footprints. By switching to Green-Sync, we save energy, water, and precious forests. Every digital journal uploaded is a step towards a healthier planet.
                </Typography>
                <Box sx={{ display: 'flex', gap: { xs: 3, sm: 4 }, flexWrap: 'wrap' }}>
                  <Box sx={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}>
                    <Typography variant="h4" sx={{
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #00c853, #00897b)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      <AnimatedCounter target={80} suffix="%" />
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Less Water Used</Typography>
                  </Box>
                  <Divider orientation="vertical" flexItem />
                  <Box sx={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}>
                    <Typography variant="h4" sx={{
                      fontWeight: 900,
                      background: 'linear-gradient(135deg, #00c853, #00897b)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>
                      <AnimatedCounter target={50} suffix="kg" />
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>CO2 per Tree</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
