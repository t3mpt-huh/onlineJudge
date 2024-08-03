import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/HomePage/HomePage";
import { Register } from "./pages/Register/Register";
import { Login } from "./pages/Login/Login";
import { Logout } from "./pages/Logout";
import { About } from "./pages/About";
import { Footer } from "./components/Footer/Footer";

import { Compiler } from "./pages/Compiler/Compiler";

import { ProblemsPage } from './pages/Problems/ProblemsPage';
import { ProblemDetailPage } from './pages/ProblemDetails/ProblemDetailsPage';
import { AddProblemPage } from './pages/AddProblem/AddProblemPage';
import { EditProblemPage } from './pages/EditProblem/EditProblemPage';

import { Navbar } from "./components/Navbar";
import './App.css';

const App = () => {

  return (  
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/about" element={<About />} />

          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/problems/:problemId" element={<ProblemDetailPage />} />
          <Route path="/addproblem" element={<AddProblemPage />} />
          <Route path="/editproblem" element={<EditProblemPage />} />

          <Route path="/compiler" element={<Compiler />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
};

export default App;
