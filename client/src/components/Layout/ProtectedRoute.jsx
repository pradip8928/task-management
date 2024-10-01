import React from 'react'
import { Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext'
const ProtectedRoute = ({ element, ...rest }) => {
  const { user } = useContext(AuthContext);
  return (
      <Route
          {...rest}
          element={user ? element : <Navigate to="/login" replace />}
      />
  );
}

export default ProtectedRoute
