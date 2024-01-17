import express from "express";
import { SupportTicket, SupportAgent } from "./schema.js";
import mongoose from "mongoose";
import cors from "cors";

mongoose.connect(
  "mongodb+srv://admin:Jnb%40yYHJH6.7UJ2@cluster0.egszi5a.mongodb.net/shvasa-assigment"
);

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

async function distributeTicketsInRoundRobin() {
  const availableAgents = await SupportAgent.find({ active: true });
  const ticketsPendingAssignment = await SupportTicket.find({
    assignedTo: null,
    status: "New",
  });
  const alreadyAssignedAgent = await SupportTicket.find({
    assignedTo: { $ne: null },
  });
  const assignedAgentlist = alreadyAssignedAgent.map((current) => {
    if (current.assignedTo !== null) {
      return current.assignedTo;
    }
  });
  const nonDuplicateAgentlist = [...new Set(assignedAgentlist)];
  const requiredAvailableAgents = availableAgents.filter(
    (item) => !nonDuplicateAgentlist.includes(item)
  );
  if (
    requiredAvailableAgents.length === 0 ||
    ticketsPendingAssignment.length === 0
  ) {
    console.log(
      "Either no active agents available or no tickets awaiting assignment."
    );
    return;
  }
  let indexForCurrentAgent = 0;
  for (const ticket of ticketsPendingAssignment) {
    ticket.assignedTo = requiredAvailableAgents[indexForCurrentAgent]._id;
    ticket.status = "Assigned";
    await ticket.save();
    indexForCurrentAgent =
      (indexForCurrentAgent + 1) % requiredAvailableAgents.length;
  }
}

app.post("/api/support-agents", async (req, res) => {
  try {
    const agent = new SupportAgent({ ...req.body });
    const agentData = await agent.save();
    res.status(201).json(agentData);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating  support agent", error: err.message });
  }
});

app.post("/api/support-tickets", async (req, res) => {
  try {
    const ticket = new SupportTicket({ ...req.body });
    const ticketData = await ticket.save();
    await distributeTicketsInRoundRobin();
    res.status(201).json(ticketData);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating  support Ticket", error: err.message });
  }
});

app.get("/api/support-tickets", async (req, res) => {
  try {
    const filters = {};
    const filterFields = ["type", "status", "assignedTo", "severity"];
    const sortOptions = {};
    const sorterFields = ["resolvedOn", "dateCreated"];

    filterFields.forEach((field) => {
      if (req.query[field]) {
        filters[field] = req.query[field];
      }
    });
    sorterFields.forEach((field) => {
      if (req.query[field]) {
        sortOptions[field] = req.query[field] === "asc" ? 1 : -1;
      }
    });
    if (Object.keys(sortOptions).length === 0) {
      sortOptions["dateCreated"] = -1;
    }
    const tickets = await SupportTicket.find(filters).sort(sortOptions);

    for (let ticket of tickets) {
      if (ticket.assignedTo) {
        const agent = await SupportAgent.findById(ticket.assignedTo).select(
          "name"
        );
        ticket.assignedTo = agent ? agent.name : null;
      }
    }
    res.status(200).json(tickets);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error getting tickets", error: err.message });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
