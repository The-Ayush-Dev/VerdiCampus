import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Card, CardContent,
  CardActions, Button, Chip, Tabs, Tab, TextField, InputAdornment, Paper
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SearchIcon from '@mui/icons-material/Search';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DownloadIcon from '@mui/icons-material/Download';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import api from '../../api';

const ResourcesHub = () => {
  const [resources, setResources] = useState([]);
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.get('/resources');
        setResources(response.data);
      } catch (err) {
        console.error("Error fetching resources:", err);
        // Fallback for visual testing
        setResources([
          { id: 1, title: 'Sustainable Engineering Specs', category: 'Engineering', type: 'PDF', addedBy: 'Dr. Smith' },
          { id: 2, title: 'Advanced Calculus Vol 2', category: 'Mathematics', type: 'E-Book', addedBy: 'Library' },
          { id: 3, title: 'Quantum Physics Lecture 4', category: 'Physics', type: 'Video', addedBy: 'Prof. Jones' },
          { id: 4, title: 'Organic Chemistry Basics', category: 'Chemistry', type: 'PDF', addedBy: 'Student Council' },
        ]);
      }
    };
    fetchResources();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'PDF': return <PictureAsPdfIcon sx={{ fontSize: 40, color: '#f44336' }} />;
      case 'E-Book': return <AutoStoriesIcon sx={{ fontSize: 40, color: '#1976d2' }} />;
      case 'Video': return <PlayCircleOutlineIcon sx={{ fontSize: 40, color: '#9c27b0' }} />;
      default: return <AutoStoriesIcon sx={{ fontSize: 40, color: '#4caf50' }} />;
    }
  };

  const getGradient = (type) => {
    switch (type) {
      case 'PDF': return 'linear-gradient(135deg, #ffebee, #ffcdd2)';
      case 'E-Book': return 'linear-gradient(135deg, #e3f2fd, #bbdefb)';
      case 'Video': return 'linear-gradient(135deg, #f3e5f5, #e1bee7)';
      default: return 'linear-gradient(135deg, #e8f5e9, #c8e6c9)';
    }
  };

  const filteredResources = resources.filter(r =>
    (tab === 0 || r.category === ['All', 'Engineering', 'Science', 'Arts', 'General'][tab]) &&
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 4, px: { xs: 1, sm: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 4, alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1, animation: 'fadeInLeft 0.6s ease-out both' }}>
          <Typography variant="h4" sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #1b5e20, #00897b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex', alignItems: 'center', gap: 2
          }}>
            Digital Resource Hub
            <AutoStoriesIcon sx={{ color: '#00897b', animation: 'float 4s ease-in-out infinite' }} />
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            Access all your study materials without printing a single page.
          </Typography>
        </Box>

        <Box sx={{ width: { xs: '100%', md: '300px' }, animation: 'fadeInRight 0.6s ease-out both' }}>
          <TextField
            fullWidth
            placeholder="Search resources..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
              sx: {
                borderRadius: 4,
                bgcolor: 'white',
                '&:hover': { boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }
              }
            }}
          />
        </Box>
      </Box>

      {/* AI Concept Mapper Feature Card */}
      <Paper elevation={0} sx={{
        p: { xs: 3, md: 4 }, mb: 4, borderRadius: 5,
        background: 'linear-gradient(135deg, #004d40 0%, #00897b 100%)',
        color: 'white',
        position: 'relative', overflow: 'hidden',
        animation: 'fadeInUp 0.6s ease-out 0.2s both',
        boxShadow: '0 12px 30px rgba(0,77,64,0.3)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 16px 40px rgba(0,77,64,0.4)',
        }
      }}>
        {/* Animated background lines */}
        <Box sx={{
          position: 'absolute', top: 0, right: 0, bottom: 0, left: '50%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
          transform: 'skewX(-20deg)', animation: 'shimmer 4s infinite'
        }} />

        <Grid container spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoAwesomeIcon sx={{ color: '#00e676', animation: 'pulse 2s infinite' }} /> AI Concept Mapper
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, opacity: 0.9, lineHeight: 1.6 }}>
              Upload any PDF or image, and Verdi AI will instantly generate a visual mind map and study guide. Reduce reading time by 40%.
            </Typography>
            <Button variant="contained" sx={{
              bgcolor: 'white', color: '#004d40', fontWeight: 'bold', borderRadius: 3, px: 3,
              '&:hover': { bgcolor: '#e0f2f1' }
            }}>
              Generate Map
            </Button>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'center' }}>
            <Box sx={{
              width: 120, height: 120, borderRadius: '50%',
              border: '2px dashed rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: 'auto', animation: 'rotateGlow 15s linear infinite'
            }}>
              <AutoAwesomeIcon sx={{ fontSize: 60, color: 'white', opacity: 0.8 }} />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, animation: 'fadeInUp 0.6s ease-out 0.3s both' }}>
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              height: 3, borderRadius: '3px 3px 0 0',
              background: 'linear-gradient(90deg, #1b5e20, #00897b)'
            },
            '& .MuiTab-root': { fontWeight: 600 }
          }}
        >
          <Tab label="All" />
          <Tab label="Engineering" />
          <Tab label="Science" />
          <Tab label="Arts" />
          <Tab label="General" />
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {filteredResources.map((res, index) => (
          <Grid item xs={12} sm={6} md={4} key={res.id}>
            <Card variant="outlined" sx={{
              height: '100%', display: 'flex', flexDirection: 'column',
              borderRadius: 4,
              border: '1px solid rgba(0,0,0,0.06)',
              animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                background: getGradient(res.type)
              },
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                '&::before': { height: '100%', opacity: 0.1 },
                '& .resource-icon': { transform: 'scale(1.1) rotate(5deg)' }
              }
            }}>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box className="resource-icon" sx={{
                    width: 60, height: 60, borderRadius: 3,
                    background: getGradient(res.type),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 0.3s ease',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                  }}>
                    {getIcon(res.type)}
                  </Box>
                  <Chip label={res.category} size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3 }}>{res.title}</Typography>
                <Typography variant="caption" color="text.secondary">Added by: {res.addedBy}</Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                <Chip label={res.type} size="small" sx={{ fontWeight: 600, bgcolor: 'rgba(0,0,0,0.04)' }} />
                <Button size="small" startIcon={<DownloadIcon />} sx={{
                  fontWeight: 'bold', color: '#00897b',
                  '&:hover': { bgcolor: 'rgba(0,137,123,0.08)' }
                }}>
                  Download
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {filteredResources.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
              <AutoStoriesIcon sx={{ fontSize: 64, mb: 2, opacity: 0.2 }} />
              <Typography variant="h6">No resources found.</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default ResourcesHub;
