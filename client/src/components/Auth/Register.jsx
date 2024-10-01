import React ,{useState,useContext} from 'react'
import {Container,TextField,Button,Typography,Box,MenuItem} from "@mui/material";
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
      });
    

      const {register,loading,user}=useContext(AuthContext);
      const [error,setError] = useState(null);
      const [success,setSuccess] = useState(false);
      const navigate = useNavigate();

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async(e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        // Add form validation and submission logic here
        console.log(formData);
        if(formData.password !== formData.confirmPassword){
          setError("Password Do Not Match");
          return;
        }

        const {confirmPassword,...dataToSend}=formData;


        try {
          
          await register(dataToSend);
          setSuccess(true);
          navigate('/login'); // Redirect to login page on successful registration
            // if (success) {
            // } else {
            //     setError("Registration failed. Please try again.");
            // }

        } catch (error) {
          setError("Failed to Register due to :"+error);
        }
      };
  return (
     <>
     <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register
        </Typography>
        {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {success && ( 
            <Typography color="success" sx={{mb:2}}>
              {success}
            </Typography>
          )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            margin="normal"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <TextField
            label="Role"
            name="role"
            select
            fullWidth
            margin="normal"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, mr: 5 }} disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </Button>
           
        </form>
      </Box>
    </Container>
     </>
  )
}

export default Register
