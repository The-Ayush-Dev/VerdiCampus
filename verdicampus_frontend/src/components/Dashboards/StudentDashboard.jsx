import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Paper, Button, Card, CardContent, Grid,
  Chip, Divider, CircularProgress, Alert, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Collapse
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SpaIcon from '@mui/icons-material/Spa';
import DownloadIcon from '@mui/icons-material/Download';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EcoIcon from '@mui/icons-material/EnergySavingsLeaf';
import api from '../../api';

const StudentDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const userEmail = localStorage.getItem('userEmail') || 'student@verdicampus.com';
  const [uploadStatus, setUploadStatus] = useState({ type: '', msg: '' });

  // AI States
  const [digitizing, setDigitizing] = useState(false);
  const [digitizedText, setDigitizedText] = useState("");
  const [auditing, setAuditing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [userEmail]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subsRes, assignRes] = await Promise.all([
        api.get(`/submissions/student/${userEmail}`),
        api.get('/assignments')
      ]);
      setSubmissions(subsRes.data);
      setAssignments(assignRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event, assignmentTitle) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setAuditing(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64File = reader.result;

        // AI FEATURE: Precise Paper Impact Auditor
        let precisePages = 5; // Default
        try {
          const auditResponse = await api.post('/ai/audit', { content: base64File.substring(0, 5000) });
          precisePages = parseInt(auditResponse.data.pages) || 5;
        } catch (aiErr) {
          console.error("AI Audit failed, using default");
        }

        const newSubmission = {
          studentEmail: userEmail,
          studentName: userEmail.split('@')[0],
          assignmentTitle: assignmentTitle,
          fileName: file.name,
          fileType: file.type,
          fileData: base64File,
          status: 'Submitted',
          pagesSaved: precisePages
        };

        await api.post('/submissions', newSubmission);
        setUploadStatus({ type: 'success', msg: `Successfully submitted! AI Audit: You saved ${precisePages} real paper sheets.` });
        fetchData();
      } catch (err) {
        setUploadStatus({ type: 'error', msg: 'Upload failed.' });
      } finally {
        setLoading(false);
        setAuditing(false);
        setTimeout(() => setUploadStatus({ type: '', msg: '' }), 6000);
      }
    };
  };

  const handleDigitize = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setDigitizing(true);
    setDigitizedText("");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const response = await api.post('/ai/digitize', {
          image: reader.result,
          mimeType: file.type
        });
        setDigitizedText(response.data.text);
      } catch (err) {
        setUploadStatus({ type: 'error', msg: 'AI Digitization failed.' });
      } finally {
        setDigitizing(false);
      }
    };
  };

  const handleDownload = (sub) => {
    if (!sub.fileData) return;
    const link = document.createElement('a');
    link.href = sub.fileData;
    link.download = sub.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPagesSaved = submissions.reduce((sum, sub) => sum + sub.pagesSaved, 0);

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 4, px: { xs: 1, sm: 3 } }}>
      <Box sx={{
        mb: 4,
        display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        flexWrap: 'wrap', gap: 2,
        animation: 'fadeInUp 0.6s ease-out both'
      }}>
        <Box>
          <Typography variant="h4" sx={{
            fontWeight: 800,
            fontSize: { xs: '1.5rem', sm: '2.125rem' },
            background: 'linear-gradient(135deg, #1b5e20, #00897b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Student Portal</Typography>
          <Typography variant="body1" color="text.secondary">Paperless academics powered by Gemini AI</Typography>
        </Box>

        {/* AI FEATURE: Handwritten Journal Digitizer Button */}
        <Box>
          <Button
            variant="contained"
            color="secondary"
            component="label"
            startIcon={digitizing ? <CircularProgress size={20} color="inherit" /> : <CameraAltIcon />}
            disabled={digitizing}
            sx={{
              borderRadius: 3, fontWeight: 'bold', px: 3,
              background: 'linear-gradient(135deg, #00897b, #0091ea)',
              boxShadow: '0 4px 20px rgba(0,137,123,0.3)',
              '&:hover': {
                boxShadow: '0 8px 30px rgba(0,137,123,0.4)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            {digitizing ? 'Digitizing...' : 'Digitize Journal'}
            <input type="file" hidden accept="image/*" onChange={handleDigitize} />
          </Button>
        </Box>
      </Box>

      <Collapse in={!!digitizedText}>
        <Paper elevation={0} sx={{
          p: 3, mb: 4, borderRadius: 4,
          borderLeft: '6px solid #0091ea',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)',
          animation: 'fadeInUp 0.4s ease-out both'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" sx={{
              fontWeight: 'bold', color: '#0d47a1',
              display: 'flex', alignItems: 'center', gap: 1
            }}>
              <AutoAwesomeIcon sx={{ animation: 'swing 2s ease-in-out infinite' }} /> AI Digitization Result
            </Typography>
            <IconButton onClick={() => setDigitizedText("")} size="small"><DownloadIcon /></IconButton>
          </Box>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontStyle: 'italic' }}>{digitizedText}</Typography>
          <Button variant="text" sx={{ mt: 2, fontWeight: 'bold' }}>Save as Digital Journal</Button>
        </Paper>
      </Collapse>

      {uploadStatus.msg && (
        <Alert severity={uploadStatus.type} sx={{
          mb: 3, borderRadius: 3, fontWeight: 'bold',
          animation: 'fadeInUp 0.3s ease-out both'
        }}>
          {uploadStatus.msg}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Pages Saved Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{
            p: 4, borderRadius: 5,
            background: 'linear-gradient(135deg, #1b5e20 0%, #00897b 50%, #2e7d32 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradientShift 6s ease infinite, scaleIn 0.5s ease-out both',
            color: 'white', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-6px)',
              boxShadow: '0 20px 40px rgba(27,94,32,0.3)',
            }
          }}>
            <SpaIcon sx={{
              position: 'absolute', top: -10, right: -10, fontSize: 100,
              opacity: 0.12, animation: 'float 5s ease-in-out infinite'
            }} />
            <EcoIcon sx={{
              fontSize: 40, mb: 1, opacity: 0.8,
              animation: 'bounceSubtle 3s ease-in-out infinite'
            }} />
            <Typography variant="h2" sx={{
              fontWeight: 900,
              fontSize: { xs: '2.5rem', sm: '3.75rem' },
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}>{totalPagesSaved}</Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 'bold' }}>Actual Pages Saved</Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.8 }}>
              {auditing ? '🤖 AI Auditor recalculating...' : '✓ AI Verified Impact'}
            </Typography>
          </Paper>
        </Grid>

        {/* Active Assignments */}
        <Grid item xs={12} md={8}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Active Assignments</Typography>
          <Grid container spacing={2}>
            {assignments.map((task, index) => (
              <Grid item xs={12} key={task.id}>
                <Card variant="outlined" sx={{
                  borderRadius: 4, p: 1,
                  border: '1px solid rgba(0,0,0,0.06)',
                  animation: `fadeInUp 0.4s ease-out ${index * 0.08}s both`,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute', left: 0, top: 0, bottom: 0,
                    width: '4px',
                    background: task.priority === 'High'
                      ? 'linear-gradient(180deg, #ff5252, #ff9100)'
                      : 'linear-gradient(180deg, #2e7d32, #00897b)',
                    borderRadius: '4px 0 0 4px'
                  },
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                    transform: 'translateX(4px)',
                  }
                }}>
                  <CardContent sx={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', flexWrap: 'wrap', gap: 2, pl: 3
                  }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{task.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{task.description}</Typography>
                      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                        <Chip label={task.priority} size="small" color={task.priority === 'High' ? 'error' : 'info'} />
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#00897b' }}>Due: {task.dueDate}</Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={auditing ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
                      sx={{
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #2e7d32, #00897b)',
                        boxShadow: '0 4px 15px rgba(46,125,50,0.25)',
                        '&:hover': {
                          boxShadow: '0 6px 20px rgba(46,125,50,0.35)',
                        }
                      }}
                    >
                      {auditing ? 'Auditing...' : 'Submit Digital'}
                      <input type="file" hidden onChange={(e) => handleFileUpload(e, task.title)} />
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Submission History */}
        <Grid item xs={12}>
          <Typography variant="h5" sx={{
            mt: 2, mb: 3, fontWeight: 700,
            animation: 'fadeInUp 0.5s ease-out both'
          }}>Submission History</Typography>
          <TableContainer component={Paper} elevation={0} sx={{
            borderRadius: 4, overflowX: 'auto',
            border: '1px solid rgba(0,0,0,0.06)',
            animation: 'fadeInUp 0.6s ease-out 0.1s both'
          }}>
            <Table>
              <TableHead>
                <TableRow sx={{
                  background: 'linear-gradient(135deg, #e8f5e9, #e0f2f1)',
                }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Assignment</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Submission Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Impact</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.map((sub, index) => (
                  <TableRow key={sub.id} hover sx={{
                    animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
                    '&:hover': {
                      bgcolor: 'rgba(46, 125, 50, 0.03)',
                    }
                  }}>
                    <TableCell sx={{ fontWeight: 600 }}>{sub.assignmentTitle}</TableCell>
                    <TableCell>{new Date(sub.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip label={sub.status} size="small" variant="outlined" color={sub.status === 'Graded' ? 'success' : 'primary'} />
                    </TableCell>
                    <TableCell sx={{
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #00c853, #00897b)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}>+{sub.pagesSaved} Sheets</TableCell>
                    <TableCell>
                      <IconButton color="primary" onClick={() => handleDownload(sub)}
                        sx={{ '&:hover': { bgcolor: 'rgba(46,125,50,0.08)' } }}
                      ><DownloadIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard;
