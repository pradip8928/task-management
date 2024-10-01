import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import React ,{useState,useContext} from 'react'
import NoPage from './components/Layout/NoPage';
import Register from "./components/Auth/Register";
import Nav from "./components/Layout/Nav";
import Login from "./components/Auth/Login";
import TaskForm from './components/Tasks/TaskForm';
import TaskList from './components/Tasks/TaskList';
import Dashboard from './components/Layout/Dashboard';
 import ProtectedRoute from "./components/Layout/ProtectedRoute";
import { TaskProvider } from './contexts/TaskContext';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from "./contexts/UserContext";

function App() {
   

  return (

    <AuthProvider>
            <UserProvider>
                <TaskProvider>
                        <Router>
                            <Nav /> {/* Render the navigation component here */}
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                              <Route path="/" element={<TaskList />} />
                                <Route path="/tasks/create-task" element={<TaskForm />} />
                                <Route path="/tasks/update-task" element={<TaskForm />} />
                                <Route path="*" element={<NoPage />} />  
                            </Routes>
                        </Router>
                </TaskProvider>
      </UserProvider>
          </AuthProvider>
  )
}

export default App
