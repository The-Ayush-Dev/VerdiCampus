import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Container, Paper, List, ListItem, ListItemText,
  Button, Card, CardContent, Grid, Chip, Divider, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton, TextField,
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Avatar
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradingIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import api from '../../api';

const TeacherDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openGradeDialog, setOpenGradeDialog] = useState(false);
  const [openAssignmentDialog, setOpenAssignmentDialog] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [grade, setGrade] = useState('');

  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium'
  });

  const teacherEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subsRes, assignRes] = await Promise.all([
        api.get('/submissions'),
        api.get(`/assignments/teacher/${encodeURIComponent(teacherEmail)}`)
      ]);
      setSubmissions(subsRes.data);
      setAssignments(assignRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeSubmit = async () => {
    try {
      await api.patch(`/submissions/${selectedSub.id}/grade`, { grade });
      setOpenGradeDialog(false);
      fetchData();
    } catch (err) {
      console.error("Error grading:", err);
    }
  };

  const handleCreateAssignment = async () => {
    if (!newAssignment.title || !newAssignment.dueDate) {
      alert("Please fill in title and due date");
      return;
    }
    try {
      await api.post('/assignments', { ...newAssignment, teacherEmail });
      setOpenAssignmentDialog(false);
      setNewAssignment({ title: '', description: '', dueDate: '', priority: 'Medium' });
      fetchData();
      alert("Assignment created successfully!");
    } catch (err) {
      console.error("Error creating assignment:", err);
      alert("Failed to create assignment: " + (err.response?.data || err.message));
    }
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

  const statConfigs = [
    {
      title: 'Total Submissions',
      value: submissions.length,
      icon: <AssignmentIcon sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #2e7d32, #00897b)',
      shadow: 'rgba(46,125,50,0.3)'
    },
    {
      title: 'Pending Grading',
      value: submissions.filter(s => s.status !== 'Graded').length,
      icon: <GradingIcon sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #ff9100, #ff5252)',
      shadow: 'rgba(255,145,0,0.3)'
    },
    {
      title: 'Active Students',
      value: new Set(submissions.map(s => s.studentEmail)).size,
      icon: <PeopleIcon sx={{ fontSize: 28 }} />,
      gradient: 'linear-gradient(135deg, #00897b, #0091ea)',
      shadow: 'rgba(0,137,123,0.3)'
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 4, px: { xs: 1, sm: 3 } }}>
      <Box sx={{
        mb: 4,
        display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        animation: 'fadeInUp 0.6s ease-out both'
      }}>
        <Typography variant="h4" sx={{
          fontWeight: 800,
          background: 'linear-gradient(135deg, #1b5e20, #00897b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Faculty Management Portal
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAssignmentDialog(true)}
          sx={{
            borderRadius: 3, fontWeight: 'bold',
            background: 'linear-gradient(135deg, #2e7d32, #00897b)',
            boxShadow: '0 4px 20px rgba(46,125,50,0.3)',
            '&:hover': {
              boxShadow: '0 8px 30px rgba(46,125,50,0.4)',
            }
          }}
        >
          Create Assignment
        </Button>
      </Box>

      {/* Animated Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statConfigs.map((stat, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Paper elevation={0} sx={{
              p: 3, borderRadius: 4,
              display: 'flex', alignItems: 'center', gap: 2.5,
              border: '1px solid rgba(0,0,0,0.05)',
              animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s both`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: `0 12px 30px ${stat.shadow}`,
                '& .stat-icon': { transform: 'scale(1.1) rotate(-5deg)' }
              }
            }}>
              <Box className="stat-icon" sx={{
                width: 52, height: 52, borderRadius: '14px',
                background: stat.gradient,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white',
                boxShadow: `0 4px 15px ${stat.shadow}`,
                transition: 'all 0.3s ease'
              }}>
                {stat.icon}
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800, lineHeight: 1 }}>{stat.value}</Typography>
                <Typography variant="body2" color="text.secondary">{stat.title}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Active Assignments */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Active Assignments
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {assignments.length === 0 ? (
          <Grid item xs={12}><Typography color="text.secondary">No assignments created yet.</Typography></Grid>
        ) : (
          assignments.map((assign, index) => (
            <Grid item xs={12} sm={6} md={4} key={assign.id}>
              <Card variant="outlined" sx={{
                borderRadius: 4,
                border: '1px solid rgba(0,0,0,0.06)',
                animation: `fadeInUp 0.4s ease-out ${index * 0.08}s both`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: '3px',
                  background: assign.priority === 'High'
                    ? 'linear-gradient(90deg, #ff5252, #ff9100)'
                    : 'linear-gradient(90deg, #2e7d32, #00897b)',
                },
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  transform: 'translateY(-4px)',
                }
              }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{assign.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Due: {assign.dueDate}</Typography>
                  <Chip label={assign.priority} size="small" color={assign.priority === 'High' ? 'error' : 'info'} />
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Submissions Table */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Recent Submissions
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{
        borderRadius: 4,
        overflowX: 'auto',
        border: '1px solid rgba(0,0,0,0.06)',
        animation: 'fadeInUp 0.6s ease-out both',
        '& .MuiTable-root': { minWidth: 800 }
      }}>
        <Table>
          <TableHead>
            <TableRow sx={{
              background: 'linear-gradient(135deg, #1b5e20, #00897b)',
            }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Assignment</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Grade</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} align="center"><CircularProgress /></TableCell></TableRow>
            ) : submissions.length === 0 ? (
              <TableRow><TableCell colSpan={6} align="center">No submissions yet.</TableCell></TableRow>
            ) : (
              submissions.map((sub, index) => (
                <TableRow key={sub.id} hover sx={{
                  animation: `fadeInUp 0.3s ease-out ${index * 0.04}s both`,
                  '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.03)' }
                }}>
                  <TableCell>
                    <Typography sx={{ fontWeight: 500 }}>{sub.studentName}</Typography>
                    <Typography variant="caption" color="text.secondary">{sub.studentEmail}</Typography>
                  </TableCell>
                  <TableCell>{sub.assignmentTitle}</TableCell>
                  <TableCell>{new Date(sub.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip label={sub.status} size="small" color={sub.status === 'Graded' ? 'success' : 'warning'} />
                  </TableCell>
                  <TableCell sx={{
                    fontWeight: 'bold',
                    color: sub.grade ? '#2e7d32' : 'text.secondary'
                  }}>{sub.grade || '-'}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="outlined" size="small" onClick={() => { setSelectedSub(sub); setGrade(sub.grade || ''); setOpenGradeDialog(true); }}
                        sx={{ borderRadius: 2, fontWeight: 600 }}
                      >
                        Grade
                      </Button>
                      <IconButton color="primary" onClick={() => handleDownload(sub)} title="Download Submission"
                        sx={{ '&:hover': { bgcolor: 'rgba(46,125,50,0.08)' } }}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Assignment Dialog */}
      <Dialog open={openAssignmentDialog} onClose={() => setOpenAssignmentDialog(false)} fullWidth maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #2e7d32, #00897b)',
          color: 'white',
          fontWeight: 700
        }}>Create New Assignment</DialogTitle>
        <DialogContent sx={{ pt: '24px !important' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Title" fullWidth value={newAssignment.title} onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <TextField label="Description" fullWidth multiline rows={3} value={newAssignment.description} onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <TextField label="Due Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={newAssignment.dueDate} onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <TextField select label="Priority" fullWidth value={newAssignment.priority} onChange={(e) => setNewAssignment({ ...newAssignment, priority: e.target.value })} SelectProps={{ native: true }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpenAssignmentDialog(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button onClick={handleCreateAssignment} variant="contained"
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #2e7d32, #00897b)',
            }}
          >Create</Button>
        </DialogActions>
      </Dialog>

      {/* Grade Dialog */}
      <Dialog open={openGradeDialog} onClose={() => setOpenGradeDialog(false)}
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
      >
        <DialogTitle sx={{
          background: 'linear-gradient(135deg, #2e7d32, #00897b)',
          color: 'white',
          fontWeight: 700
        }}>Grade Submission</DialogTitle>
        <DialogContent sx={{ pt: '24px !important' }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Assign a grade for <strong>{selectedSub?.studentName}</strong>.
          </Typography>
          <TextField fullWidth label="Grade" value={grade} onChange={(e) => setGrade(e.target.value)} variant="outlined" autoFocus
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setOpenGradeDialog(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
          <Button onClick={handleGradeSubmit} variant="contained"
            sx={{
              borderRadius: 2,
              background: 'linear-gradient(135deg, #2e7d32, #00897b)',
            }}
          >Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TeacherDashboard;
