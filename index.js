const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// File to store statistics
const statsFilePath = path.join(__dirname, 'stats.json');

// Load or initialize stats
let stats = {
  visits: 0,
  details: [] // Stores details of each visit
};

if (fs.existsSync(statsFilePath)) {
  stats = JSON.parse(fs.readFileSync(statsFilePath, 'utf8'));
}

// Middleware to log visits
app.use((req, res, next) => {
  const visitDetails = {
    time: new Date().toISOString(), // Record visit time
    ip: req.ip,                     // Record visitor's IP
    url: req.url                    // Record accessed URL
  };

  stats.visits += 1;
  stats.details.push(visitDetails); // Save visit details
  
  // Save stats to file
  fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2));
  
  next();
});

// Home route
app.get('/', (req, res) => {
  res.send(`<h1>Welcome!</h1><p>Total Visits: ${stats.visits}</p>`);
});

// Statistics route
app.get('/stats', (req, res) => {
  res.json(stats);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});