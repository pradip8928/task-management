import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
// import jwt from 'jsonwebtoken';
// Create AuthContext
 


// Create AuthContext
export const AuthContext = createContext();

// AuthProvider component to wrap around your app
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing logged-in user on mount
    // useEffect(() => {
    //     const storedUser = JSON.parse(localStorage.getItem('user'));
    //     const token = localStorage.getItem('token');

    //     if (storedUser && token) {
    //         try {
    //             const decodedUser = decode(token);
    //             setUser(decodedUser);
    //         } catch (error) {
    //             console.error("Token decoding error:", error);
    //         }
    //     }
    //     setLoading(false);
    // }, []);


    const decodeJWT = (token) => {
        if (!token) return null;
        const payload = token.split('.')[1]; // Get the payload part of the JWT
        const decoded = JSON.parse(atob(payload)); // Decode it from base64url
        return decoded; // Return the decoded payload
    };
    // const isTokenValid = (token) => {
    //     if (!token) return false; // Check if token is defined
    //     const decoded = jwt.decode(token);
    //     if (decoded && decoded.exp && Date.now() >= decoded.exp * 1000) {
    //         return false; // Token has expired
    //     }
    //     return true; // Token is valid
    // };
    const isTokenValid = (token) => {
        const decoded = decodeJWT(token);
        if (decoded && decoded.exp && Date.now() >= decoded.exp * 1000) {
            return false; // Token has expired
        }
        return true; // Token is valid
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = JSON.parse(localStorage.getItem('user'));

        // Check if token and user data exist and if the token is valid
        if (token && storedUser && isTokenValid(token)) {
            try {
                setUser(storedUser); // Set the user from local storage
            } catch (error) {
                console.error("Error setting user from token:", error);
                logout(); // Log out if there's an error with the token
            }
        } else {
            logout(); // Log out if token is invalid or user data doesn't exist
        }
        setLoading(false);
    }, []);



  // Login function
  const login = async (formData) => {
    try {
        const response = await axios.post('http://localhost:4000/user/login', formData);
        const token = response.data.token;
        const userData = response.data.user;

        localStorage.setItem('token', token); // Store token
        localStorage.setItem('user', JSON.stringify(userData)); // Store user data
        setUser(userData); // Set user state
    } catch (err) {
        console.error("Login error:", err);
    }
};

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };
  // Register function
  const register = async (formData) => {
    try {
        const response = await axios.post('http://localhost:4000/user/register', formData);
        const token = response.data.token;  
        const userData = response.data.user; 

        // Set token and user data
        localStorage.setItem('token', token); // Store token
        localStorage.setItem('user', JSON.stringify(userData)); // Store user data
        setUser(userData); // Set user state
        return true;  
    } catch (err) {
        console.error("Registration error:", err);
        return false; // Indicate failure
    }
};


 // Function to create an instance of axios with the Authorization header
 const axiosInstance = axios.create({
    baseURL: 'http://localhost:4000',
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
          {loading ? <div>Loading...</div> : children} 
        </AuthContext.Provider>
    );
};