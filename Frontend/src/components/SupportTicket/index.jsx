import { useState } from "react";
import "./supportTicket.css";
import axios from "axios";
const SupportTicketEntryScreen = () => {
  const [ticketData, setTicketData] = useState({
    topic: "",
    description: "",
    dateCreated: new Date().toISOString().slice(0, 10),
    severity: "",
    type: "",
    status: "New",
    resolvedOn: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!ticketData.topic.trim()) {
      newErrors.topic = "Topic is required.";
      isValid = false;
    }

    if (!ticketData.description.trim()) {
      newErrors.description = "Description is required.";
      isValid = false;
    } else if (ticketData.description.trim().length < 10) {
      newErrors.description =
        "Description must be at least 10 characters long.";
      isValid = false;
    }

    if (!["Low", "Medium", "High"].includes(ticketData.severity)) {
      newErrors.severity = "Please select a valid severity level.";
      isValid = false;
    }

    if (!ticketData.type.trim()) {
      newErrors.type = "Type is required.";
      isValid = false;
    }

    if (!["New", "Assigned", "Resolved"].includes(ticketData.status)) {
      newErrors.status = "Invalid status selected.";
      isValid = false;
    }

    const currentDate = new Date().toISOString().slice(0, 10);
    if (ticketData.dateCreated > currentDate) {
      newErrors.dateCreated = "Date created cannot be in the future.";
      isValid = false;
    }

    if (ticketData.status === "Resolved" && !ticketData.resolvedOn) {
      newErrors.resolvedOn = "Resolved date is required for resolved tickets.";
      isValid = false;
    } else if (
      ticketData.resolvedOn &&
      ticketData.dateCreated > ticketData.resolvedOn
    ) {
      newErrors.resolvedOn = "Resolved date cannot be before the date created.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/support-tickets",
          ticketData
        );
        console.log("Ticket created successfully:", response.data);

        setTicketData({
          topic: "",
          description: "",
          dateCreated: new Date().toISOString().slice(0, 10),
          severity: "",
          type: "",
          status: "New",
          resolvedOn: "",
        });
        setErrors({});
      } catch (error) {
        console.error(
          "Submission error:",
          error.response ? error.response.data : error.message
        );
        if (error.response && error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
      }
    }
  };

  const handleChange = (e) => {
    setTicketData({ ...ticketData, [e.target.name]: e.target.value });
  };

  return (
    <div className="content-box">
      <h2>Create Support Ticket</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="topic"
          value={ticketData.topic}
          onChange={handleChange}
          placeholder="Topic"
          className={errors.topic ? "input-error" : ""}
        />
        {errors.topic && <p className="error-message">{errors.topic}</p>}

        <textarea
          name="description"
          value={ticketData.description}
          onChange={handleChange}
          placeholder="Description"
          className={errors.description ? "input-error" : ""}
        />
        {errors.description && (
          <p className="error-message">{errors.description}</p>
        )}

        <input
          type="date"
          name="dateCreated"
          value={ticketData.dateCreated}
          onChange={handleChange}
          className={errors.dateCreated ? "input-error" : ""}
        />
        {errors.dateCreated && (
          <p className="error-message">{errors.dateCreated}</p>
        )}

        <select
          name="severity"
          value={ticketData.severity}
          onChange={handleChange}
          className={errors.severity ? "input-error" : ""}
        >
          <option value="">Select Severity</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        {errors.severity && <p className="error-message">{errors.severity}</p>}

        <input
          type="text"
          name="type"
          value={ticketData.type}
          onChange={handleChange}
          placeholder="Type"
          className={errors.type ? "input-error" : ""}
        />
        {errors.type && <p className="error-message">{errors.type}</p>}

        <select
          name="status"
          value={ticketData.status}
          onChange={handleChange}
          className={errors.status ? "input-error" : ""}
        >
          <option value="New">New</option>
          <option value="Assigned">Assigned</option>
          <option value="Resolved">Resolved</option>
        </select>
        {errors.status && <p className="error-message">{errors.status}</p>}

        <input
          type="date"
          name="resolvedOn"
          value={ticketData.resolvedOn}
          onChange={handleChange}
          className={errors.resolvedOn ? "input-error" : ""}
          placeholder="Resolved On"
          disabled={ticketData.status !== "Resolved"}
        />
        {errors.resolvedOn && (
          <p className="error-message">{errors.resolvedOn}</p>
        )}

        <button type="submit" className="submit-agent">
          Create Ticket
        </button>
      </form>
    </div>
  );
};

export default SupportTicketEntryScreen;
