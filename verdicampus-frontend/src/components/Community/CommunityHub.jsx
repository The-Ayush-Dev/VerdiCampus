import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Avatar, Grid, TextField,
  Button, List, ListItem, Chip, Divider, IconButton, CircularProgress,
  Card, CardContent
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SendIcon from '@mui/icons-material/Send';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import api from '../../api';

const CommunityHub = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState('');
  const [newPostType, setNewPostType] = useState('DISCUSSION');
  const [generatingEvent, setGeneratingEvent] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentUser = localStorage.getItem('userEmail') || 'student@verdicampus.com';

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/community/posts');
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Fallback data
      setPosts([
        { id: 1, authorName: 'Alice', type: 'DISCUSSION', content: 'Anyone want to start a paper recycling drive in D-Block?', tags: 'recycling, initiative', likes: 12 },
        { id: 2, authorName: 'Bob (Eco-Rep)', type: 'EVENT', content: 'Tree Plantation Drive this Sunday at the North Gate.', tags: 'event, plantation', likes: 45 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    try {
      await api.post('/community/posts', {
        authorEmail: currentUser,
        authorName: currentUser.split('@')[0],
        type: newPostType,
        content: newPostContent,
        tags: newPostTags
      });
      setNewPostContent('');
      setNewPostTags('');
      fetchPosts();
    } catch (error) {
      console.error("Error creating post");
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/community/posts/${postId}/like`);
      fetchPosts();
    } catch (error) {
      console.error("Error liking post");
    }
  };

  // AI FEATURE: Smart Event Planner
  const handleAIGenerateEvent = async () => {
    setGeneratingEvent(true);
    setNewPostContent('');
    try {
      const prompt = `Suggest a creative, high-impact campus sustainability event that students can easily participate in without using any paper materials. Format as a catchy title and short description.`;
      const response = await api.post('/ai/generate', { prompt });
      setNewPostType('EVENT');
      setNewPostContent(response.data.text || `Campus E-Waste Collection Drive 🔋\nBring your old electronics to the student union this Friday! Let's divert toxic waste from landfills.`);
      setNewPostTags('e-waste, campus-event, zero-paper');
    } catch (err) {
      // Fallback if API fails
      setNewPostType('EVENT');
      setNewPostContent(`🌱 AI Suggested Event: Digital Poster Making Competition\nTheme: "A Greener Tomorrow". Submit your digital artworks on the Verdi portal! No printouts accepted.`);
      setNewPostTags('event, art, digital');
    } finally {
      setGeneratingEvent(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 4, px: { xs: 1, sm: 3 } }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2, animation: 'fadeInUp 0.6s ease-out both' }}>
        <Box sx={{
          width: 50, height: 50, borderRadius: 3,
          background: 'linear-gradient(135deg, #00897b, #0091ea)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(0,137,123,0.3)',
          animation: 'bounceSubtle 4s infinite'
        }}>
          <PeopleIcon sx={{ color: 'white', fontSize: 28 }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #1b5e20, #00897b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Community Hub
          </Typography>
          <Typography variant="body1" color="text.secondary">Collaborate on green initiatives</Typography>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Main Feed */}
        <Grid item xs={12} md={8}>
          {/* Create Post Card */}
          <Paper elevation={0} sx={{
            p: 3, mb: 4, borderRadius: 4,
            border: '1px solid rgba(0,0,0,0.06)',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
            animation: 'fadeInUp 0.6s ease-out 0.2s both'
          }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Avatar sx={{
                bgcolor: '#2e7d32', width: 44, height: 44,
                boxShadow: '0 0 0 2px white, 0 4px 10px rgba(46,125,50,0.3)'
              }}>
                <PersonIcon />
              </Avatar>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Share a green idea, ask a question, or plan an event..."
                variant="outlined"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3, bgcolor: '#fafffe',
                    transition: 'all 0.3s ease',
                    '&.Mui-focused': { bgcolor: 'white', boxShadow: '0 4px 15px rgba(46,125,50,0.08)' }
                  }
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', pl: { xs: 0, sm: 7 } }}>
              <TextField
                size="small"
                placeholder="Tags (comma separated)"
                value={newPostTags}
                onChange={(e) => setNewPostTags(e.target.value)}
                sx={{ flexGrow: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
              <TextField
                select
                size="small"
                value={newPostType}
                onChange={(e) => setNewPostType(e.target.value)}
                SelectProps={{ native: true }}
                sx={{ width: 130, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                <option value="DISCUSSION">Discussion</option>
                <option value="EVENT">Event</option>
                <option value="IDEA">Idea</option>
              </TextField>
              <Button
                variant="contained"
                onClick={handleCreatePost}
                endIcon={<SendIcon />}
                disabled={!newPostContent.trim()}
                sx={{
                  borderRadius: 2, fontWeight: 'bold', px: 3,
                  background: 'linear-gradient(135deg, #2e7d32, #00897b)',
                  boxShadow: '0 4px 15px rgba(46,125,50,0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 6px 20px rgba(46,125,50,0.4)' }
                }}
              >
                Post
              </Button>
            </Box>

            {/* Smart Add-ons */}
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed rgba(0,0,0,0.1)', pl: { xs: 0, sm: 7 } }}>
              <Button
                size="small"
                onClick={handleAIGenerateEvent}
                startIcon={generatingEvent ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
                disabled={generatingEvent}
                sx={{
                  color: '#00897b', fontWeight: 600, borderRadius: 2,
                  bgcolor: 'rgba(0,137,123,0.08)',
                  '&:hover': { bgcolor: 'rgba(0,137,123,0.15)' }
                }}
              >
                {generatingEvent ? 'AI Planning...' : 'Smart Event Planner'}
              </Button>
            </Box>
          </Paper>

          {/* Posts Feed */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
          ) : (
            posts.map((post, index) => (
              <Card key={post.id} elevation={0} sx={{
                mb: 3, borderRadius: 4,
                border: '1px solid rgba(0,0,0,0.06)',
                animation: `fadeInUp 0.5s ease-out ${0.2 + (index * 0.1)}s both`,
                transition: 'all 0.3s ease',
                position: 'relative', overflow: 'hidden',
                '&::before': {
                  content: '""', position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px',
                  background: post.type === 'EVENT' ? 'linear-gradient(180deg, #ff9100, #ffea00)' :
                    post.type === 'IDEA' ? 'linear-gradient(180deg, #00e676, #00bfa5)' :
                      'linear-gradient(180deg, #2e7d32, #00897b)'
                },
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                  transform: 'translateY(-2px)'
                }
              }}>
                <CardContent sx={{ pb: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40, fontWeight: 'bold' }}>
                        {post.authorName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{post.authorName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(post.createdAt || Date.now()).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      icon={post.type === 'EVENT' ? <EventAvailableIcon /> : post.type === 'IDEA' ? <AutoAwesomeIcon /> : undefined}
                      label={post.type}
                      size="small"
                      sx={{
                        fontWeight: 'bold',
                        bgcolor: post.type === 'EVENT' ? 'rgba(255, 145, 0, 0.1)' : 'rgba(46, 125, 50, 0.1)',
                        color: post.type === 'EVENT' ? '#ef6c00' : '#2e7d32'
                      }}
                    />
                  </Box>

                  <Typography variant="body1" sx={{ mt: 1, mb: 2, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                    {post.content}
                  </Typography>

                  {post.tags && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                      {post.tags.split(',').map((tag, i) => (
                        <Chip key={i} label={`#${tag.trim()}`} size="small" variant="outlined" sx={{ border: 'none', bgcolor: '#f5faf5', color: 'text.secondary', fontWeight: 600 }} />
                      ))}
                    </Box>
                  )}
                </CardContent>
                <Divider sx={{ mx: 2, borderColor: 'rgba(0,0,0,0.04)' }} />
                <Box sx={{ px: 2, py: 1.5, display: 'flex', gap: 2 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleLike(post.id)}
                    sx={{
                      color: post.likes > 0 ? '#1b5e20' : 'text.secondary',
                      transition: 'all 0.2s ease',
                      '&:hover': { color: '#2e7d32', bgcolor: 'rgba(46,125,50,0.1)', transform: 'scale(1.1)' }
                    }}
                  >
                    <ThumbUpIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{post.likes}</Typography>
                  </IconButton>
                  <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: '#00897b', bgcolor: 'rgba(0,137,123,0.1)' } }}>
                    <CommentIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Reply</Typography>
                  </IconButton>
                </Box>
              </Card>
            ))
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{
            p: 3, borderRadius: 4, mb: 3,
            background: 'linear-gradient(135deg, #1b5e20 0%, #00897b 100%)',
            color: 'white', position: 'relative', overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(27,94,32,0.3)',
            animation: 'fadeInRight 0.6s ease-out 0.2s both'
          }}>
            <Box sx={{
              position: 'absolute', top: -40, right: -40, opacity: 0.1,
              animation: 'rotateGlow 20s linear infinite'
            }}>
              <DirectionsRunIcon sx={{ fontSize: 160 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, position: 'relative', zIndex: 1 }}>
              Upcoming Eco-Events
            </Typography>
            <List sx={{ p: 0, position: 'relative', zIndex: 1 }}>
              {['Digital Cleanup Day - May 10', 'Zero-Waste Seminar - May 15', 'Campus Garden Prep - May 20'].map((item, i) => (
                <ListItem key={i} disablePadding sx={{ mb: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#00e676', mr: 2, boxShadow: '0 0 5px #00e676' }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{item}</Typography>
                </ListItem>
              ))}
            </List>
            <Button variant="outlined" size="small" sx={{
              mt: 2, color: 'white', borderColor: 'rgba(255,255,255,0.4)', borderRadius: 2,
              '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
            }}>
              View Calendar
            </Button>
          </Paper>

          <Paper elevation={0} sx={{
            p: 3, borderRadius: 4,
            border: '1px solid rgba(0,0,0,0.06)',
            animation: 'fadeInRight 0.6s ease-out 0.3s both'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Trending Tags</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['#zerowaste', '#digitalcampus', '#recycling', '#greenit', '#energy', '#ideas'].map((tag, i) => (
                <Chip key={i} label={tag} size="small" sx={{
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  '&:hover': { bgcolor: '#e8f5e9', color: '#2e7d32', transform: 'translateY(-2px)' }
                }} />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CommunityHub;
