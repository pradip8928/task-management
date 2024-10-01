import React ,{useState,useEffect,useContext}from 'react'
import {TextField,Button,MenuItem,Grid,Box,Typography,List, ListItem,ListItemText,CircularProgress,ListItemButton,IconButton,Snackbar,Alert,Select,Pagination} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { TaskContext } from '../../contexts/TaskContext';
 

const TaskList = () => {
    const { user } = useContext(AuthContext);
    const { tasks, loading, error,fetchTasks,deleteTask, downloadTasks}=useContext(TaskContext);
  
    const navigate = useNavigate(); 
    const [page, setPage] = useState(1); // Page state
    const [totalPages, setTotalPages] = useState(1); // Total pages state
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        search: '',
    });
    const handlePageChange = (event, value) => {
        console.log(`Fetching tasks for page: ${page}`);
        setPage(value);
    };
    useEffect(() => {
        fetchTasks({ ...filters, page }).then(response => {
             
            setTotalPages(response.totalPages); // Update total pages from response
        });    }, [page, filters]);


 

    
    const statusOptions = ['To Do', 'In Progress', 'Completed'];
    const priorityOptions = ['Low', 'Medium', 'High'];


    const [deleteSuccess, setDeleteSuccess] = useState(null);
    
    console.log('tasks from tasklist',tasks.tasks);
    console.log('loading',loading);
    console.log('error',error);

 

   
 

    if (loading) {
        return <CircularProgress sx={{display:'flex',justifyContent: 'center'}}/>;
    }

    if (error) {
        return (
            <Typography color="error" sx={{mt:5}} textAlign="center" variant="h6">
                {error}
            </Typography>
        );
    }

    
 // Check if tasks is an object and has a "tasks" array inside it
 const taskList = Array.isArray(tasks.tasks) ? tasks.tasks : [];



    // Function to handle edit button click
    const handleEdit = (task) => {
        console.log(task);
        
        navigate(`/tasks/update-task`, { state: { task } });
    };

    const handleDelete = (id) => {
        console.log(id);
        
        if (window.confirm("Are you sure you want to delete this task?")) {
            deleteTask(id).then(() => {
                setDeleteSuccess("Task deleted successfully!");
            });
        }
    };


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
        setPage(1); 
    };

    const handleDownloadCSV = () => {
        downloadTasks(filters, 'csv');
    };

    const handleDownloadJSON = () => {
        downloadTasks(filters, 'json');
    };


    return (
        <Box sx={{ mt: 2,px:2 }}>
            <Typography variant="h4" gutterBottom>
                Task List  
            </Typography>
            {deleteSuccess && (
                <Snackbar open={!!deleteSuccess} autoHideDuration={6000} onClose={() => setDeleteSuccess(null)}>
                    <Alert onClose={() => setDeleteSuccess(null)} severity="success">
                        {deleteSuccess}
                    </Alert>
                </Snackbar>
            )}


              
                {/* Filters */}
    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
            {/* Status Filter */}
            <Grid item xs={12} sm={4} md={3}>
                <Select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    displayEmpty
                    fullWidth
                    variant="outlined"
                    sx={{
                        bgcolor: 'background.paper',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.dark',
                        },
                    }}
                >
                    <MenuItem value="">
                        <em>All Statuses</em>
                    </MenuItem>
                    {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                            {status}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>

            {/* Priority Filter */}
            <Grid item xs={12} sm={4} md={3}>
                <Select
                    name="priority"
                    value={filters.priority}
                    onChange={handleFilterChange}
                    displayEmpty
                    fullWidth
                    variant="outlined"
                    sx={{
                        bgcolor: 'background.paper',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.dark',
                        },
                    }}
                >
                    <MenuItem value="">
                        <em>All Priorities</em>
                    </MenuItem>
                    {priorityOptions.map((priority) => (
                        <MenuItem key={priority} value={priority}>
                            {priority}
                        </MenuItem>
                    ))}
                </Select>
            </Grid>

            {/* Search Filter */}
            <Grid item xs={12} sm={4} md={3}>
                <TextField
                    name="search"
                    label="Search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    variant="outlined"
                    fullWidth
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: 'background.paper',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.main',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'primary.dark',
                        },
                    }}
                />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12} sm={12} md={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="contained"
                    onClick={() => fetchTasks(filters)}
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                            bgcolor: 'primary.dark',
                        },
                    }}
                >
                    Filter
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleDownloadCSV}
                    sx={{
                        color: 'primary.main',
                        borderColor: 'primary.main',
                        '&:hover': {
                            bgcolor: 'primary.light',
                            borderColor: 'primary.dark',
                        },
                    }}
                >
                    Download CSV
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleDownloadJSON}
                    sx={{
                        color: 'primary.main',
                        borderColor: 'primary.main',
                        '&:hover': {
                            bgcolor: 'primary.light',
                            borderColor: 'primary.dark',
                        },
                    }}
                >
                    Download JSON
                </Button>
            </Grid>
        </Grid>
    </Box>

    {taskList.length === 0 ? (
        <Typography color="textSecondary" sx={{ textAlign: 'center', mt: 4 }} variant="h6">
            No such data
        </Typography>
    ) : (
            <List>
    {taskList.map((task) => (   
        <ListItem key={task._id}>
            <ListItemText
                primary={
                    <Typography    sx={{color: '#054358'}} fontWeight="bold">
                        {task.title}
                    </Typography>
                }
                 
                secondary={
    <Typography component="span" variant="body2" color="text.secondary">
    <span style={{ color: '#1976d2', fontWeight: 'bold' }}>Description:</span> {task.description} &nbsp;|&nbsp;
    <span style={{ color: '#1976d2', fontWeight: 'bold' }}>Due:</span> {task.dueDate} &nbsp;|&nbsp;
    <span style={{ color: '#1976d2', fontWeight: 'bold' }}>Status:</span> {task.status} &nbsp;|&nbsp;
    <span style={{ color: '#1976d2', fontWeight: 'bold' }}>Assigned to:</span> {task.assignedUser?.username || "Unassigned"} &nbsp;|&nbsp;
    <span style={{ color: '#1976d2', fontWeight: 'bold' }}>Priority:</span> {task.priority}
</Typography>
                }
            />
            {/* Only admins can see Edit and Delete buttons */}
            {user?.role === 'admin' && (
                <div>
                   
                    <IconButton color="primary" onClick={() => handleEdit(task)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDelete(task._id)}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            )}
        </ListItem>
    ))}
</List>)}


 {/* Pagination */}
 <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                   count={totalPages}
                   page={page}
                   onChange={handlePageChange}
                   color="primary"
                />
            </Box>
        </Box>
    );
};

export default TaskList
