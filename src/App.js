import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import PatientList from "./components/PatientList";
import AddPatientForm from "./components/AddPatientForm";

function App() {
  return (
    <Router>
      <div className="App">
        <Topbar />
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<PatientList />} />
            <Route path="/send-orders" element={<AddPatientForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
