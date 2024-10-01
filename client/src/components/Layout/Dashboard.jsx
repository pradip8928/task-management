import React, { useContext } from 'react'
import TaskList from '../Tasks/TaskList'
import Nav from "./Nav"
import {Link} from "react-router-dom"
import AddIcon from '@mui/icons-material/Add';


import { Typography,Button, Box } from '@mui/material'
import { AuthContext } from '../../contexts/AuthContext'
const Dashboard = () => {


    const {user,logout}=useContext(AuthContext);
    console.log("Current User:", user);
  return (
    <>
    
    
    {user? (
        <>  
        
        
        
{user.role==="admin" && (
  <Box sx={{display: 'flex',justifyContent:'flex-end',mt:2,mr:4}}>
    <Button component={Link} to="/tasks/create-task" sx={{ my: 2, color: 'white' }} variant='contained' color='primary'>
    <AddIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
        Create Task
      
    </Button>

  </Box>
)}
 <TaskList/>
         
         </>
    ):(
        <Typography variant="h4" textAlign="center" sx={{mt:5}} color="error">Welcome To Task-Management ,Please Login</Typography>
    )}
   
    </>
  )
}

export default Dashboard
