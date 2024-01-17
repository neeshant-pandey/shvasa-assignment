import { useState } from "react";
import "./supportAgent.css";
import axios from "axios";
const Index = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let isValid = true;
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    const phoneRegex =
      /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
    if (!formData.phone) {
      newErrors.phone = "Phone is required";
      isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Invalid phone format";
      isValid = false;
    }

    if (
      formData.description.trim().length > 0 &&
      formData.description.trim().length < 10
    ) {
      newErrors.description = "Description must be at least 10 characters long";
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
          "http://localhost:3000/api/support-agents",
          formData
        );
        console.log("Agent created successfully:", response.data);
        setFormData({ name: "", email: "", phone: "", description: "" });
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="content-box">
      <h2>Create Support Agent</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
        />
        {errors.name && <p>{errors.name}</p>}

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <p>{errors.email}</p>}

        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
        />
        {errors.phone && <p>{errors.phone}</p>}

        <textarea
          type="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
        ></textarea>
        {errors.description && <p>{errors.description}</p>}

        <button className="submit-agent" type="submit">
          Create Agent
        </button>
      </form>
    </div>
  );
};

export default Index;
