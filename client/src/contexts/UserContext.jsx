import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:4000/user/users', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
            
                
                setUsers(response.data);
            } catch (err) {
                // More detailed error logging
                console.error("Error fetching users: ", err);
                setError(err.response?.data?.message || "Failed to fetch users");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);
    return (
        <UserContext.Provider value={{ users, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};