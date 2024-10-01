import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [totalpages,setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);


    

    useEffect(() => {
        fetchTasks(); // Fetch tasks when the provider mounts
    }, []);




    // Fetch tasks from the backend
    // const fetchTasks = async () => {
    //     setLoading(true);
    //     setError(null)
    //     try {
    //         const response = await axios.get('http://localhost:4000/task', {
    //             headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Include token for auth
    //         });
    //         // console.log(response.data);

    //               // Filter tasks based on user role
    //     // const allTasks = response.data;
    //     // const filteredTasks = user.role === 'admin' 
    //     // ? allTasks 
    //     // : allTasks.filter(task => task.assignedUser === user._id);


    //     console.log("from Context");
    //     console.log(response.data);
        
        
    //     //     console.log(filteredTasks);
            
    //         // setTasks({ tasks: filteredTasks }); 
    //         setTasks( response.data); 
    //     } catch (err) {
    //         setError(err.response?.data?.message || "Failed to fetch tasks");
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const fetchTasks = async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get('http://localhost:4000/task', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                params: {
                    ...filters,
                },
            });
            setTasks(data);
            setTotalPages(data.totalPages); 
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch tasks");
        } finally {
            setLoading(false);
        }
    };
    const createTask = async (taskData) => {
        setError(null);
        try {
            const response = await axios.post('http://localhost:4000/task', taskData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Include token for auth
            });
    
            console.log("Task Created:", response.data);
            // Ensure prevTasks is an array
            setTasks((prevTasks) => Array.isArray(prevTasks) ? [...prevTasks, response.data] : [response.data]);
        } catch (err) {
            console.error("Error:", err); 
            setError(err.response?.data?.message || "Failed to create task");
        }
    };

    // Update an existing task
    const updateTask = async (id, taskData) => {
        setError(null); 
        try {
            const response = await axios.put(`http://localhost:4000/task/${id}`, taskData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Include token for auth
            });
            setTasks((prevTasks) => Array.isArray(prevTasks) 
            ? prevTasks.map((task) => (task._id === id ? response.data : task))
            : []
        );
        console.log(response.data);
        
        return response.data; 
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update task");
            throw(err);
        }
    };

    // Delete a task
    const deleteTask = async (id) => {
        setError(null);
        try {
            const response = await axios.delete(`http://localhost:4000/task/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // Include token for auth
            });

            console.log("Delete Response:", response.data);
            // setTasks((prevTasks) => {
            //     console.log("Previous Tasks Before Delete:", prevTasks); // Debugging line
            //     return Array.isArray(prevTasks) ? prevTasks.filter((task) => task._id !== id) : prevTasks;
            // });
            if (response.data.message === "Task Deleted Successfully") {
                setTasks((prevTasks) => {
                    const currentTasks = prevTasks.tasks || [];
                    return { ...prevTasks, tasks: currentTasks.filter((task) => task._id !== id) };
                });
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete task");
        }
    };


    const downloadTasks = async (filters, format) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:4000/task/summary', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                params: {
                    ...filters,
                    format, // Include format for download
                },
                responseType: format === 'csv' ? 'blob' : 'json' // Handle response type based on format
            });

            // Create a blob URL for CSV or handle JSON
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `tasks.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to download tasks");
        } finally {
            setLoading(false);
        }
    };
   
    return (
        <TaskContext.Provider value={{ tasks, loading, error, createTask, fetchTasks ,updateTask, deleteTask ,downloadTasks}}>
            {children}
        </TaskContext.Provider>
    );
};

// Custom hook to use the TaskContext
export const useTaskContext = () => {
    return useContext(TaskContext);
};
