const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Path to JSON file for storing visit data
const dataFilePath = path.join(__dirname, 'visits.json');

// Initialize visits data if the file doesn't exist
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify({ visits: [], total: 0 }, null, 2));
}

// Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(cors({ origin: 'https://xk-lin.github.io' })); // Allow requests from GitHub Pages

// Load visits data
function loadVisits() {
  return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
}

// Save visits data
function saveVisits(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// Route to log a visit
app.post('/visit', (req, res) => {
  const { page, time } = req.body;

  if (!page || !time) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  const ip = req.ip; // Get the IP address of the visitor
  const visit = { ip, page, time };

  // Load, update, and save visits data
  const data = loadVisits();
  data.visits.push(visit);
  data.total += 1;
  saveVisits(data);

  res.json({ message: 'Visit logged successfully', visit });
});

// Route to get total visits
app.get('/total-visits', (req, res) => {
  const data = loadVisits();
  res.json({ totalVisits: data.total });
});

// Route to get all visits
app.get('/stats', (req, res) => {
  const data = loadVisits();
  res.json(data.visits);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
