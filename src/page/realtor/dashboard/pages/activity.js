import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  CircularProgress,
  Paper,
  Chip,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  Person, 
  Email, 
  Event, 
  Computer, 
  HowToReg,
  Login,
  Update,
  Visibility,
  Payment,
  AddHome
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const activityIcons = {
  registration: <HowToReg color="primary" />,
  login: <Login color="info" />,
  profile_update: <Update color="warning" />,
  property_view: <Visibility color="secondary" />,
  property_add: <AddHome color="success" />,
  transaction: <Payment color="action" />
};

const ActivityPage = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const getUserData = () => {
    const realtorData = localStorage.getItem('realtorData');

    if (realtorData) {
      const user = JSON.parse(realtorData);
      return { id: user._id, role: 'realtor' };
    }
   
    return null;
  };
  
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const user = getUserData();
        
        if (!user) {
          toast.error('User data not found');
          navigate('/login');
          return;
        }

        const response = await axios.get(`https://newportal-backend.onrender.com/activity/activities`, {
          params: {
            page,
            activityType: filter === 'all' ? undefined : filter,
            userId: user.id,
            role: user.role
          }
        });
        
        setActivities(response.data.activities);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching activities:', error);
        toast.error(error.response?.data?.message || 'Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [page, filter, navigate]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        My Activity Log
      </Typography>
      
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="subtitle1">Filter:</Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Activity Type</InputLabel>
            <Select
              value={filter}
              label="Activity Type"
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="all">All Activities</MenuItem>
              <MenuItem value="registration">Registrations</MenuItem>
              <MenuItem value="login">Logins</MenuItem>
              <MenuItem value="profile_update">Profile Updates</MenuItem>
              <MenuItem value="property_view">Property Views</MenuItem>
              <MenuItem value="property_add">Property Added</MenuItem>
              <MenuItem value="transaction">Transactions</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : activities.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No activities found.
        </Typography>
      ) : (
        <>
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {activities.map((activity, index) => (
              <React.Fragment key={activity._id}>
                <ListItem alignItems="flex-start">
                  <Box sx={{ mr: 2 }}>
                    {activityIcons[activity.activityType] || <Event />}
                  </Box>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" component="span">
                          {activity.description}
                        </Typography>
                        <Chip 
                          label={activity.activityType} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {formatDate(activity.createdAt)}
                        </Typography>
                        {activity.ipAddress && ` — IP: ${activity.ipAddress}`}
                        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                          <Box component="div" sx={{ mt: 1 }}>
                            {Object.entries(activity.metadata).map(([key, value]) => (
                              <Chip
                                key={key}
                                label={`${key}: ${value}`}
                                size="small"
                                sx={{ mr: 1, mb: 1 }}
                              />
                            ))}
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>
                {index < activities.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ActivityPage;