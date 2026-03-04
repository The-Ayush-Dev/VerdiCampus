import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Paper, List, ListItem, ListItemText,
  Chip, Divider, CircularProgress, Alert, Button, Collapse, IconButton, Tooltip
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import api from '../../api';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Critical': return 'error';
    case 'High': return 'warning';
    case 'Medium': return 'info';
    case 'Low': return 'success';
    default: return 'default';
  }
};

const getPriorityGradient = (priority) => {
  switch (priority) {
    case 'Critical': return 'linear-gradient(180deg, #d32f2f, #ff5252)';
    case 'High': return 'linear-gradient(180deg, #f57c00, #ffb74d)';
    case 'Medium': return 'linear-gradient(180deg, #1976d2, #64b5f6)';
    case 'Low': return 'linear-gradient(180deg, #388e3c, #81c784)';
    default: return 'linear-gradient(180deg, #757575, #bdbdbd)';
  }
};

const NoticesPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaries, setSummaries] = useState({});
  const [summarizing, setSummarizing] = useState({});

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await api.get('/notices');
        setNotices(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching notices:", err);
        setError("Failed to load notices. Showing sample data instead.");
        setLoading(false);
        setNotices([
          { id: 1, title: 'Holi Holidays 2026', content: 'The campus will remain closed on March 13th and 14th for the Holi celebrations.', category: 'Event', priority: 'Medium', date: '2026-03-13' },
          { id: 2, title: 'Semester Exam Schedule Out', content: 'The final semester examination schedule has been published. Check portal.', category: 'Academic', priority: 'High', date: '2026-04-15' },
          { id: 3, title: 'Campus Wi-Fi Maintenance', content: 'Main core switches will be upgraded tonight. Expect 2 hours of downtime.', category: 'IT', priority: 'Critical', date: '2026-03-05' },
        ]);
      }
    };

    fetchNotices();
  }, []);

  const handleSummarize = async (notice) => {
    const id = notice.id || notice.title;
    setSummarizing({ ...summarizing, [id]: true });
    try {
      const response = await api.post('/summarize', { content: notice.content || notice.title });
      setSummaries({ ...summaries, [id]: response.data.summary });
    } catch (err) {
      setSummaries({ ...summaries, [id]: "AI summary unavailable. Please read the full text." });
    } finally {
      setSummarizing({ ...summarizing, [id]: false });
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: 4, px: { xs: 1, sm: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1, animation: 'fadeInUp 0.6s ease-out both' }}>
        <Box sx={{
          width: 50, height: 50, borderRadius: 3,
          background: 'linear-gradient(135deg, #1b5e20, #00897b)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(27,94,32,0.3)',
          animation: 'float 4s ease-in-out infinite'
        }}>
          <NotificationsActiveIcon sx={{ color: 'white', fontSize: 28 }} />
        </Box>
        <Typography variant="h4" component="h1" sx={{
          color: 'primary.main', fontWeight: 800,
          fontSize: { xs: '1.5rem', sm: '2.125rem' }
        }}>
          Campus Notice Board
        </Typography>
      </Box>
      <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary', ml: 8, animation: 'fadeInUp 0.6s ease-out 0.1s both' }}>
        Official announcements and circulars across all campus wings.
      </Typography>

      {error && <Alert severity="warning" sx={{ mb: 3, borderRadius: 3, animation: 'fadeInUp 0.4s ease-out both' }}>{error}</Alert>}

      <Paper elevation={0} sx={{
        borderRadius: 4, overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(20px)'
      }}>
        <List sx={{ p: 0 }}>
          {notices.length === 0 ? (
            <ListItem><ListItemText primary="No notices found." /></ListItem>
          ) : (
            notices.map((notice, index) => {
              const id = notice.id || notice.title;
              const isCritical = notice.priority === 'Critical';

              return (
                <React.Fragment key={id}>
                  <Box sx={{
                    p: 3,
                    position: 'relative',
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: '#fafffe',
                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)'
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute', top: 0, left: 0, bottom: 0, width: 4,
                      background: getPriorityGradient(notice.priority),
                    },
                    ...(isCritical && {
                      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both, borderGlow 2s infinite`
                    })
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1, mr: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        {notice.title}
                        {isCritical && (
                          <Box sx={{
                            width: 8, height: 8, borderRadius: '50%',
                            bgcolor: 'error.main', animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
                          }} />
                        )}
                      </Typography>
                      <Chip
                        label={notice.priority}
                        color={getPriorityColor(notice.priority)}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>

                    <Typography variant="body1" sx={{ color: 'text.primary', mb: 2, lineHeight: 1.6 }}>
                      {notice.content}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Chip label={notice.category} variant="outlined" size="small" />
                        <Typography variant="caption" color="text.secondary">
                          {notice.date || (notice.createdAt ? new Date(notice.createdAt).toLocaleDateString() : 'Unknown')}
                        </Typography>
                      </Box>

                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        startIcon={summarizing[id] ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
                        onClick={() => handleSummarize(notice)}
                        disabled={summarizing[id]}
                        sx={{
                          borderRadius: 2, textTransform: 'none', fontWeight: 'bold',
                          borderColor: 'secondary.main',
                          '&:hover': {
                            background: 'linear-gradient(135deg, rgba(0,137,123,0.1), rgba(0,137,123,0.2))'
                          }
                        }}
                      >
                        {summarizing[id] ? 'Summarizing...' : 'Quick-Scan AI'}
                      </Button>
                    </Box>

                    <Collapse in={!!summaries[id]}>
                      <Paper elevation={0} sx={{
                        mt: 2,
                        p: 2.5,
                        background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
                        borderRadius: 3,
                        borderLeft: '4px solid #00c853',
                        position: 'relative',
                        boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)'
                      }}>
                        <Typography variant="subtitle2" sx={{
                          fontWeight: 800, mb: 0.5,
                          background: 'linear-gradient(135deg, #1b5e20, #00897b)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          display: 'flex', alignItems: 'center', gap: 1
                        }}>
                          <AutoAwesomeIcon sx={{ fontSize: 16, color: '#00897b' }} /> AI Eco-Bulletin:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
                          {summaries[id]}
                        </Typography>
                        <IconButton
                          size="small"
                          sx={{ position: 'absolute', top: 5, right: 5, color: '#00897b' }}
                          onClick={() => setSummaries({ ...summaries, [id]: null })}
                        >
                          <CloseIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Paper>
                    </Collapse>
                  </Box>
                  {index < notices.length - 1 && <Divider sx={{ mx: 3 }} />}
                </React.Fragment>
              );
            })
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default NoticesPage;
