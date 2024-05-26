const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(express.json());

const FHIR_SERVER = "http://localhost:8080/fhir"; // Make sure this is correct

// Fetch lab orders from FHIR server
app.get("/api/orders", async (req, res) => {
  try {
    const response = await axios.get(`${FHIR_SERVER}/ServiceRequest`);
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send(error.response ? error.response.data : error.message);
  }
});

// Serve static files from React app
app.use(express.static(path.join(__dirname, "../build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.listen(3001, () => {
  console.log("Lab server listening on port 3001");
});
