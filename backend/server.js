const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// UPDATED: Standard CORS to allow your future Vercel URL
app.use(cors()); 
app.use(express.json());

const Agent = require('./models/Agent');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Gharpayy CRM Database Connected");
  
  const count = await Agent.countDocuments();
  if (count === 0) {
    await Agent.create([
      { name: "Rahul (Bangalore Central)", email: "rahul@gharpayy.com" },
      { name: "Sonia (HSR Layout)", email: "sonia@gharpayy.com" }
    ]);
    console.log("System Initialized: Default agents created.");
  }
}).catch(err => console.error("DB Connection Error:", err));

// NEW: Health Check Route to fix "Cannot GET /" on Render
app.get("/", (req, res) => {
  res.send("Gharpayy CRM API is live and running...");
});

app.use('/api/leads', require('./routes/leadRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
