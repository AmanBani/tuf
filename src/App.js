import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AddCard from "./pages/AddCard";

function App() {
  return (
    <>
        <Router>
            <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/AddCard" element={<AddCard />} />


          </Routes>
        </Router>
    </>
  );
}

export default App;
