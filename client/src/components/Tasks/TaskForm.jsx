import React,{useState,useContext,useEffect} from 'react'
import {TextField,Button,MenuItem,Grid,Box,Typography,Snackbar,Alert} from "@mui/material";
import { useLocation } from 'react-router-dom'; 
import { AuthContext } from '../../contexts/AuthContext';
import { TaskContext } from '../../contexts/TaskContext';
import { UserContext  } from '../../contexts/UserContext';

const statuses=['To Do','In Progress','Completed'];
const priorities=['Low','Medium','High'];

const TaskForm = ({ initialTask = null, onClose }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation(); 
  const task = location.state?.task;
  const { createTask, updateTask } = useContext(TaskContext);
  const { users, loading: loadingUsers, error: usersError } = useContext(UserContext);

  const initialFormData = {
      title: task ? task.title : '',
      description: task ? task.description : '',
      dueDate: task ? task.dueDate.split('T')[0] : '',
      status: task ? task.status : 'To Do',
      assignedUser: task ? task.assignedUser?._id : '',
      priority: task ? task.priority : 'Medium',
  };
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (task) {
        setFormData({
            title: task.title,
            description: task.description,
            dueDate: task.dueDate.split('T')[0],
            status: task.status,
            assignedUser: task.assignedUser?._id,
            priority: task.priority,
        });
    }
}, [task]);
  console.log("Updating Task ID:", task?._id);
  console.log("Form Data for Update:", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};
  
    


    const handleSubmit = async (e) => {
      e.preventDefault();
      if (user?.role !== 'admin') {
          setError('Only admin users can create or update tasks.');
          return;
      }
      setLoading(true);
      setError(null);
      setSuccess(false);
      console.log(formData);
      try {
          let response;
          if (task) {
              // Updating existing task
              response = await updateTask(task._id, formData);
              console.log("Update response:", response); // Log the response
              setSuccess('Task updated successfully!');
          } else {
              // Creating new task
              response = await createTask(formData);
              console.log("Create response:", response); // Log the response
              setSuccess('Task created successfully!');
             
            }
            
            // Reset form after successful submission
            setFormData(initialFormData);
            onClose();
            
          } catch (error) {
            setError(error.response?.data?.message || "Failed to create or update Task");
            console.error(error.response?.data?.message);
          } finally {
        setError(null);
          setLoading(false);
      }
  }

    // if (user.role !== 'admin') {
    //   return <Typography color="error">You do not have permission to create tasks.</Typography>;
    // }
  
    return (
      <Box sx={{ mt: 4,p:4 }}>
        <Typography variant="h4" gutterBottom>
        {task ? 'Update Task' : 'Create New Task'}
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
            {success && (
                <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
                    <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                        {success}
                    </Alert>
                </Snackbar>
            )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Title */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Task Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>
  
            {/* Description */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                
                required
              />
            </Grid>
  
            {/* Due Date */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
  
            {/* Status */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
  
            {/* Assigned User */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Assigned User"
                name="assignedUser"
                value={formData.assignedUser}
                onChange={handleChange}
                required
               >



              {loadingUsers ? (
                <MenuItem disabled>Loading Users...</MenuItem>
              ) : usersError ? (
                <MenuItem disabled>{usersError}</MenuItem>
              ) : (
                users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.username}
                  </MenuItem>
                ))
              )}
            </TextField>


            </Grid>
  
            {/* Priority */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                {priorities.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
  
            {/* Submit Button */}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

           {/* Error Snackbar */}
           <Snackbar 
              open={!!error} 
              autoHideDuration={6000} 
              onClose={() => setError(null)}
            >
              <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
          </Snackbar>
      </Box>
    );
  };
  
export default TaskForm
