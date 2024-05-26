import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const AddPatientForm = ({ onPatientAdded }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [idCardNumber, setIdCardNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [diagnosticInfo, setDiagnosticInfo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPatient = {
      resourceType: "Patient",
      name: [
        {
          use: "official",
          family: name.split(" ").slice(-1)[0],
          given: name.split(" ").slice(0, -1),
        },
      ],
      identifier: [
        {
          system: "http://hospital.smarthealthit.org",
          value: idCardNumber,
        },
      ],
      birthDate,
      gender,
      telecom: [
        {
          system: "phone",
          value: contactInfo,
        },
      ],
      extension: [
        {
          url: "http://example.org/fhir/StructureDefinition/diagnostic-information",
          valueString: diagnosticInfo,
        },
      ],
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/add-patient",
        newPatient
      );
      console.log("Add Patient:", JSON.stringify(response.data, null, 2));
      onPatientAdded(); // Call the callback to update the patient list
      navigate("/patients");
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  return (
    <Box sx={{ marginLeft: "240px", padding: "24px" }}>
      <Typography variant="h4" gutterBottom>
        Add New Patient
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="ID Card Number"
          value={idCardNumber}
          onChange={(e) => setIdCardNumber(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Birth Date"
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Gender</InputLabel>
          <Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            label="Gender"
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Contact Information"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Diagnostic Information"
          value={diagnosticInfo}
          onChange={(e) => setDiagnosticInfo(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Add Patient
        </Button>
      </form>
    </Box>
  );
};

export default AddPatientForm;
