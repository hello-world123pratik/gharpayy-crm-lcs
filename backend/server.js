const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const Agent = require('./models/Agent');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("Gharpayy CRM Database Connected");
  
  // Bootstrap: Initialize Agents if none exist [cite: 111]
  const count = await Agent.countDocuments();
  if (count === 0) {
    await Agent.create([
      { name: "Rahul (Bangalore Central)", email: "rahul@gharpayy.com" },
      { name: "Sonia (HSR Layout)", email: "sonia@gharpayy.com" }
    ]);
    console.log("System Initialized: Default agents created.");
  }
});

app.use('/api/leads', require('./routes/leadRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));