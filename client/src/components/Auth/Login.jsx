import React ,{useState,useContext} from 'react'
import {Container,TextField,Button,Typography,Box,MenuItem} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
const Login = () => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
      });

      const {login ,loading}=useContext(AuthContext);
      const [error,setError] = useState(false);
      const [success,setSuccess] = useState(false);
  const navigate = useNavigate();
    
      const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async(e) => {
        e.preventDefault();
        setError(false);
        setSuccess(false);
        // Add login logic here
        console.log(loginData);

        try {
          await login(loginData);
          setSuccess(true)
          navigate('/'); // Redirect to login page on successful registration
            //   if (success) {
            // } else {
            //     setError("Login  failed. Please try again.");
            // }
        } catch (error) {
          setError("Failed to login. Please check your credentials and try again.")
        }

      
      };
  return (
    <Container maxWidth="sm"  >
    <Box sx={{ mt: 5  }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      {error && (
        <Typography color="error" sx={{mb:2}}>{error}</Typography>
      )}

      {success && (
        <Typography color='success' sx={{mb:2}}>
          {success}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={loginData.email}
          onChange={handleChange}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={loginData.password}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained" color="primary"   sx={{ mt: 2 }}  >
          {loading?'Logging in...':'Login'}
        </Button>
      </form>
    </Box>
  </Container>
  )
}

export default Login
