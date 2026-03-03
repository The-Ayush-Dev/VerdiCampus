import React, { useState, useRef, useEffect } from 'react';
import {
  Fab, Box, Paper, Typography, IconButton, TextField, InputAdornment,
  List, ListItem, ListItemText, ListItemAvatar, Avatar, Collapse, Fade
} from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import api from '../api';

const EcoBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm Verdi, your AI Eco-Assistant. How can I help you save paper today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setOpen(!open);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
    setLoading(true);

    try {
      const response = await api.post('/chat', { message: userMsg });
      if (response.data && response.data.success) {
        setMessages(prev => [...prev, { text: response.data.message, sender: 'bot' }]);
      } else {
        const errorMsg = response.data?.message || "Something went wrong with my green circuits.";
        setMessages(prev => [...prev, { text: errorMsg, sender: 'bot' }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { text: "I'm offline right now. Please check back later!", sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <Fade in={open}>
        <Paper elevation={0} sx={{
          mb: 2,
          width: { xs: 300, sm: 350 },
          height: 480,
          display: open ? 'flex' : 'none',
          flexDirection: 'column',
          borderRadius: 4,
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          transformOrigin: 'bottom right',
          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}>
          {/* Header */}
          <Box sx={{
            p: 2,
            background: 'linear-gradient(135deg, #1b5e20, #00897b)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box sx={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              transform: 'skewX(-20deg)', animation: 'shimmer 3s infinite'
            }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 1 }}>
              <Avatar sx={{
                bgcolor: 'white', color: '#1b5e20',
                boxShadow: '0 0 0 2px rgba(255,255,255,0.3)',
                animation: 'pulse 2s infinite'
              }}>
                <AutoAwesomeIcon sx={{ fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>Verdi AI</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>Campus Green Guide</Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={toggleChat} sx={{ color: 'white', position: 'relative', zIndex: 1 }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <List sx={{
            flexGrow: 1, overflowY: 'auto', p: 2,
            bgcolor: 'rgba(245, 250, 245, 0.5)',
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: '10px' }
          }}>
            {messages.map((msg, index) => (
              <ListItem key={index} sx={{
                flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                px: 0, py: 1,
                animation: `fadeInUp 0.3s ease-out both`
              }}>
                <ListItemAvatar sx={{ minWidth: 40, display: 'flex', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                  <Avatar sx={{
                    width: 32, height: 32,
                    bgcolor: msg.sender === 'user' ? '#00897b' : '#2e7d32',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}>
                    {msg.sender === 'user' ? <PersonIcon fontSize="small" /> : <SpaIcon fontSize="small" />}
                  </Avatar>
                </ListItemAvatar>
                <Paper elevation={0} sx={{
                  maxWidth: '75%', p: 1.5,
                  borderRadius: msg.sender === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                  bgcolor: msg.sender === 'user' ? '#e0f2f1' : 'white',
                  color: msg.sender === 'user' ? '#004d40' : 'text.primary',
                  border: msg.sender === 'user' ? 'none' : '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                }}>
                  <Typography variant="body2" sx={{ lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </Typography>
                </Paper>
              </ListItem>
            ))}
            {loading && (
              <ListItem sx={{ px: 0, py: 1, animation: 'fadeInUp 0.3s ease-out both' }}>
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: '#2e7d32' }}><SpaIcon fontSize="small" /></Avatar>
                </ListItemAvatar>
                <Paper elevation={0} sx={{
                  maxWidth: '75%', p: 1.5,
                  borderRadius: '16px 16px 16px 0',
                  border: '1px solid rgba(0,0,0,0.06)',
                  display: 'flex', alignItems: 'center', gap: 0.5
                }}>
                  <div className="typing-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </Paper>
              </ListItem>
            )}
            <div ref={messagesEndRef} />
          </List>

          {/* Input Area */}
          <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask Verdi..."
              variant="outlined"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              InputProps={{
                sx: { borderRadius: 4, bgcolor: '#fafffe' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleSend}
                      disabled={!input.trim() || loading}
                      size="small"
                      sx={{
                        color: input.trim() ? '#2e7d32' : 'action.disabled',
                        transition: 'all 0.2s',
                        '&:hover': { transform: 'scale(1.1) rotate(-10deg)', color: '#00897b' }
                      }}
                    >
                      <SendIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Paper>
      </Fade>

      <Fab
        color="primary"
        aria-label="chat"
        onClick={toggleChat}
        sx={{
          background: 'linear-gradient(135deg, #1b5e20, #00897b)',
          color: 'white',
          position: 'relative',
          width: 60, height: 60,
          boxShadow: '0 4px 20px rgba(27,94,32,0.4)',
          transition: 'all 0.3s ease',
          transform: open ? 'scale(0.9)' : 'scale(1)',
          '&:hover': {
            boxShadow: '0 6px 25px rgba(27,94,32,0.6)',
            transform: open ? 'scale(0.95)' : 'scale(1.05)'
          },
          '&::before': !open ? {
            content: '""', position: 'absolute', top: -5, left: -5, right: -5, bottom: -5,
            borderRadius: '50%', border: '2px solid #00897b',
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
          } : {}
        }}
      >
        {open ? <CloseIcon /> : <SmartToyIcon sx={{ animation: 'bounceSubtle 3s infinite' }} />}
      </Fab>
    </Box>
  );
};

export default EcoBot;
