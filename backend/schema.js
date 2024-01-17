import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  description: { type: String, required: true },
  dateCreated: { type: Date, required: true },
  severity: { type: String, enum: ["Low", "Medium", "High"], required: true },
  type: { type: String, required: true },
  assignedTo: { type: String, required: false, default: null },
  status: {
    type: String,
    enum: ["New", "Assigned", "Resolved"],
    required: true,
  },
  resolvedOn: { type: Date },
});

const supportAgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  description: { type: String },
  active: { type: Boolean, default: true },
  dateCreated: { type: Date, default: Date.now },
});

export const SupportTicket = mongoose.model(
  "support-ticket",
  supportTicketSchema
);
export const SupportAgent = mongoose.model("support-agent", supportAgentSchema);
