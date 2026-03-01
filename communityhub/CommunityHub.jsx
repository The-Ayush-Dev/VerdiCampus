import React, { useState } from 'react';
import { 
  Container, Typography, Grid, Paper, Avatar, Box, Chip, Divider, 
  Button, TextField, CircularProgress, Collapse 
} from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import api from '../../api';

const CommunityHub = () => {
  const [eventDetails, setEventDetails] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePlanEvent = async () => {
    if (!eventDetails.trim()) return;
    setLoading(true);
    try {
      const response = await api.post('/ai/plan-event', { event: eventDetails });
      setPlan(response.data.plan);
    } catch (err) {
      console.error("Planning failed");
    } finally {
      setLoading(false);
    }
  };

  const topics = [
    { user: 'Student A', content: 'What are the best practices for paperless assignments?', time: '2h ago', tags: ['Paperless', 'Tips'] },
    { user: 'Faculty B', content: 'Upcoming Green Drive on Saturday. Join us for tree planting!', time: '5h ago', tags: ['Event', 'GreenDrive'] },
    { user: 'Student C', content: 'Just reached 100 pages saved! My personal impact is growing!', time: '1d ago', tags: ['Milestone', 'Proud'] },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <GroupsIcon sx={{ fontSize: 48, color: 'primary.main' }} />
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
            Community Hub
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Connect and lead the paperless revolution.
          </Typography>
        </Box>
      </Box>

      {/* AI FEATURE: Zero-Waste Event Consultant */}
      <Paper elevation={4} sx={{ p: 4, mb: 6, borderRadius: 5, background: 'linear-gradient(135deg, #f1f8e9 0%, #ffffff 100%)', border: '1px solid #c8e6c9' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <AutoAwesomeIcon color="secondary" sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>AI Zero-Waste Consultant</Typography>
            <Typography variant="body2" color="text.secondary">Planning a campus event? Let AI create a 100% paperless strategy for you.</Typography>
          </Box>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="e.g., Annual Cultural Fest 2026, Sports Meet, Hackathon..."
              value={eventDetails}
              onChange={(e) => setEventDetails(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button 
              fullWidth
              height="100%"
              variant="contained" 
              color="secondary"
              onClick={handlePlanEvent} 
              disabled={loading || !eventDetails.trim()}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <EventAvailableIcon />}
              sx={{ borderRadius: 3, height: '56px', fontWeight: 'bold' }}
            >
              Get Plan
            </Button>
          </Grid>
        </Grid>

        <Collapse in={!!plan}>
          <Box sx={{ mt: 4, p: 3, bgcolor: '#ffffff', borderRadius: 4, borderLeft: '6px solid #1565c0', boxShadow: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#0d47a1' }}>Your Zero-Paper Strategy:</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{plan}</Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="text.secondary">Implementing this plan could save approx. 5,000 sheets per event.</Typography>
          </Box>
        </Collapse>
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>Community Discussions</Typography>
          {topics.map((topic, index) => (
            <Paper key={index} elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>{topic.user[0]}</Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{topic.user}</Typography>
                  <Typography variant="caption" color="text.secondary">{topic.time}</Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>{topic.content}</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {topic.tags.map(tag => <Chip key={tag} label={tag} size="small" variant="outlined" color="success" />)}
              </Box>
            </Paper>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={4} sx={{ p: 3, borderRadius: 3, bgcolor: 'primary.main', color: 'white' }}>
            <LocalFloristIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Green Initiatives</Typography>
            <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
              Be the change. Help us transition more departments to VerdiCampus.
            </Typography>
            <Button variant="contained" sx={{ bgcolor: 'white', color: 'primary.main', fontWeight: 'bold', '&:hover': { bgcolor: '#f1f1f1' } }}>
              Join Movement
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CommunityHub;
