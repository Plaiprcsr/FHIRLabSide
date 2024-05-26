import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [testDetails, setTestDetails] = useState("");
  const location = useLocation();

  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/patients");
      const entries = response.data.entry || [];
      setPatients(entries.map((entry) => entry.resource));
      console.log("Fetch Patients:", JSON.stringify(entries, null, 2));
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [location]);

  const handleDelete = async (patientId) => {
    try {
      await axios.delete(`http://localhost:3000/api/patient/${patientId}`);
      fetchPatients(); // Refresh the patient list after deletion
      console.log("Delete Patient:", patientId);
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  const handleCreateOrder = (patient) => {
    setSelectedPatient(patient);
    setOpenDialog(true);
  };

  const handleSendOrder = async () => {
    try {
      const orderData = {
        resourceType: "ServiceRequest",
        status: "active",
        intent: "order",
        subject: {
          reference: `Patient/${selectedPatient.id}`,
        },
        code: {
          text: testDetails,
        },
        extension: [
          {
            url: "http://example.org/fhir/StructureDefinition/diagnostic-information",
            valueString: selectedPatient.extension.find(
              (ext) =>
                ext.url ===
                "http://example.org/fhir/StructureDefinition/diagnostic-information"
            ).valueString,
          },
        ],
      };

      const response = await axios.post(
        "http://localhost:3000/api/orders",
        orderData
      ); // Send to FHIR Server
      console.log("Order sent to FHIR Server:", orderData);
      console.log("Response:", response.data);
      setOpenDialog(false);
    } catch (error) {
      console.error("Error sending order:", error);
    }
  };

  return (
    <Box sx={{ marginLeft: "240px", padding: "24px" }}>
      <Typography variant="h4" gutterBottom>
        Patient List
      </Typography>
      <Button
        component={Link}
        to="/add-patient"
        variant="contained"
        color="primary"
        sx={{ marginBottom: "24px" }}
      >
        Add New Patient
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>ID Card Number</TableCell>
            <TableCell>Patient ID</TableCell>
            <TableCell>Birth Date</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Contact Information</TableCell>
            <TableCell>Diagnostic Information</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>
                {patient.name && patient.name.length > 0
                  ? `${
                      patient.name[0].given
                        ? patient.name[0].given.join(" ")
                        : ""
                    } ${patient.name[0].family || ""}`
                  : "N/A"}
              </TableCell>
              <TableCell>
                {patient.identifier && patient.identifier.length > 0
                  ? patient.identifier[0].value
                  : "N/A"}
              </TableCell>
              <TableCell>{patient.id}</TableCell>
              <TableCell>{patient.birthDate || "N/A"}</TableCell>
              <TableCell>{patient.gender || "N/A"}</TableCell>
              <TableCell>
                {patient.telecom && patient.telecom.length > 0
                  ? patient.telecom.map((t) => t.value).join(", ")
                  : "N/A"}
              </TableCell>
              <TableCell>
                {patient.extension && patient.extension.length > 0
                  ? patient.extension
                      .filter(
                        (ext) =>
                          ext.url ===
                          "http://example.org/fhir/StructureDefinition/diagnostic-information"
                      )
                      .map((ext) => ext.valueString)
                      .join(", ")
                  : "N/A"}
              </TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginRight: "8px" }}
                  onClick={() => handleCreateOrder(patient)}
                >
                  Create Test Order
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDelete(patient.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog for test order details */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create Test Order</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide additional test details for the order.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Test Details"
            fullWidth
            value={testDetails}
            onChange={(e) => setTestDetails(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSendOrder} variant="contained" color="primary">
            Send Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientList;
