## Technical Documentation: Gharpayy Lead Management System (LCS)

This repository contains the Minimum Viable Product (MVP) for the Gharpayy CRM, designed to centralize lead capture, automate agent assignment, and provide clear visibility into the sales pipeline.

## System Architecture

The system is built on a MERN Stack (MongoDB, Express, React, Node.js) to ensure a high-performance, responsive internal tool.

Frontend (React): A responsive Single Page Application (SPA) designed for agents to manage leads via a horizontal Kanban board .

Backend (Node.js/Express): A RESTful API that handles automated webhooks for lead ingestion, workload-based assignment logic, and analytics aggregation .

Database (MongoDB): A NoSQL database chosen for its flexibility in handling unstructured lead data from diverse sources such as WhatsApp, website forms, and social media .

## Database Design

The database utilizes two primary collections with relational-style references to ensure data integrity.

1. Lead Collection
Stores the complete Lead Profile and tracks activity .
Attributes: name, phone, source, status (8-stage enum), assignedAgent (Reference), visitDetails (Property/Outcome), and timestamps .

2. Agent Collection
Facilitates the Workload Balancing assignment method .
Attributes: name, email, and activeLeads (a counter used to assign new leads to the agent with the least current workload).

## Production Scalability

To move from MVP to a full-scale platform, the following architectural enhancements are planned:

1. Queue Management: Integrate Redis and BullMQ to process incoming lead webhooks asynchronously, ensuring the system remains stable during high-traffic marketing drives.

2. Real-time Synchronization: Implement Socket.io to push new lead alerts and pipeline updates to agent dashboards instantly without manual refreshes.

3. Horizontal Scaling: Containerize with Docker to deploy multiple instances behind a Load Balancer to handle increased concurrent users.

4. Activity Timeline: Add a LeadActivity collection to log every status change and agent interaction for performance auditing .

## Requirements Fulfillment Matrix

Lead Capture: Fully automated webhook endpoint (/api/leads/capture) requiring zero manual entry .

Assignment: Automatic workload-balancing logic ensuring every lead has one clear owner.

8-Stage Pipeline: Strictly implements the required stages from "New Lead" to "Booked/Lost" .

Dashboard: Provides real-time metrics for total leads, visits, and bookings .

Reminders: Visual "FOLLOW-UP" alerts triggered for leads inactive for >24 hours .

## Installation & Run Commands

### 1. Prerequisites

* Node.js installed.
* MongoDB Atlas account (or local MongoDB).

### 2. Backend Setup

cd backend
npm install

Create a .env file in the backend folder and add:

PORT=5000
MONGO_URI=your_mongodb_connection_string

Run Backend:

npm start

### 3.Frontend Setup

cd ../frontend
npm install

Run Frontend:

npm start

The app will be available at http://localhost:3000.

## Testing the Automated Capture

To test the "Zero Manual Entry" lead capture, send a POST request to 

http://localhost:5000/api/leads/capture with the following JSON:

{
  "name": "John Doe",
  "phone": "9876543210",
  "source": "Website Form"
}