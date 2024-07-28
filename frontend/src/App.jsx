import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/HomePage/HomePage";
import { Register } from "./pages/Register/Register";
import { Login } from "./pages/Login/Login";
import { Logout } from "./pages/Logout";
import { About } from "./pages/About";
import { Problems } from "./pages/Problems";
import { Compiler } from "./pages/Compiler/Compiler";

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
          <Route path="/problems" element={<Problems />} />
          <Route path="/compiler" element={<Compiler />} />
        </Routes>
      </Router>
    </>
  );
};

export default App
