import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/HomePage";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { About } from "./pages/About";
import { AddProblems } from "./pages/AddProblems";
import { Compiler } from "./pages/Compiler";

import { Navbar } from "./components/Navbar";

const App = () => {

  return (  
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/addProblems" element={<Contact />} />
          <Route path="/compiler" element={<Compiler />} />
        </Routes>
      </Router>
    </>
  );
};

export default App
