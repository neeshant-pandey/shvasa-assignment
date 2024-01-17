import { useState, useEffect } from "react";
import axios from "axios";

import "./HomePage.css";

const HomePage = () => {
  const [tickets, setTickets] = useState([]);
  const [filterType, setFilterType] = useState("type");
  const [filterValue, setFilterValue] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const params = {
          ...(filterValue && { [filterType]: filterValue }),
          ...(sortBy && { [sortBy]: sortOrder }),
        };

        const response = await axios.get(
          "https://shvasa-assignment.vercel.app/api/support-tickets",
          { params }
        );
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTickets();
  }, [filterType, filterValue, sortBy, sortOrder]);

  return (
    <div className="content-box">
      <h1>Support Tickets</h1>
      <div className="filters">
        <select onChange={(e) => setFilterType(e.target.value)}>
          <option value="type">Type</option>
          <option value="status">Status</option>
          <option value="assignedTo">Assigned To</option>
          <option value="severity">Severity</option>
        </select>
        <input
          type="text"
          placeholder="Enter filter value..."
          value={filterValue}
          onChange={(e) => setFilterValue(e.target.value)}
        />
        <div className="sort-container">
          <div className="sort-select-wrapper">
            <select
              className="sort-select"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort by...</option>
              <option value="resolvedOn">Resolved On</option>
              <option value="dateCreated">Date Created</option>
            </select>
          </div>
          <div className="sort-select-wrapper">
            <select
              className="sort-select"
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="ticket-container ">
        {tickets.map((ticket) => (
          <div key={ticket._id} className="ticket-card">
            <div className="ticket-header">
              <h3 className="ticket-title">{ticket.topic}</h3>
              <span className="ticket-date">
                {new Date(ticket.dateCreated).toLocaleDateString()}
              </span>
            </div>
            <p className="ticket-description">
              <strong>Description:</strong> {ticket.description}
            </p>
            <p className="ticket-type">
              <strong>Type:</strong> {ticket.type}
            </p>
            <p className="ticket-assignedTo">
              <strong>Assigned To:</strong> {ticket.assignedTo || "Unassigned"}
            </p>
            <p className="ticket-status">
              <strong>Status:</strong> {ticket.status}
            </p>
            <div className="ticket-footer">
              <span
                className={`ticket-severity severity-${ticket.severity.toLowerCase()}`}
              >
                {ticket.severity}
              </span>
              <span className="ticket-resolved">
                <strong>Resolved On:</strong>{" "}
                {ticket.resolvedOn
                  ? new Date(ticket.resolvedOn).toLocaleDateString()
                  : "Not resolved yet"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
