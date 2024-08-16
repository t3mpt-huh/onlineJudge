import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/HomePage/HomePage';
import { Register } from './pages/Register/Register';
import { Login } from './pages/Login/Login';

import { About } from './pages/AboutPage/About';
import { Footer } from './components/Footer/Footer';

import { NotAdmin } from './pages/Redirect/NotAdmin';
import { NotSignedIn } from './pages/Redirect/NotSignedIn';

import { Compiler } from './pages/Compiler/Compiler';
import { ProblemsPage } from './pages/Problems/ProblemsPage';
import { ProblemDetailPage } from './pages/ProblemDetails/ProblemDetailsPage';
import { AddProblemPage } from './pages/AddProblem/AddProblemPage';
import { EditProblemPage } from './pages/EditProblem/EditProblemPage';
import {AdminPage} from './pages/AdminPage/AdminPage'; // Admin Page
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './components/AuthContext';

import { Navbar } from "./components/Navbar";
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/notadmin" element={<NotAdmin />} />
          <Route path="/notsignedin" element={<NotSignedIn />} />
          
          <Route path="/about" element={<About />} />
          <Route
            path="/compiler"
            element={
              <PrivateRoute>
                <Compiler />
              </PrivateRoute>
            }
          />
          <Route
            path="/problems"
            element={
              <PrivateRoute>
                <ProblemsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/problems/:problemId"
            element={
              <PrivateRoute>
                <ProblemDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/addproblem"
            element={
              <AdminRoute>
                <AddProblemPage />
              </AdminRoute>
            }
          />
          <Route
            path="/editproblem"
            element={
              <AdminRoute>
                <EditProblemPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
        </Routes>
        {/* <Footer /> */}
      </Router>
    </AuthProvider>
  );
};

export default App;
