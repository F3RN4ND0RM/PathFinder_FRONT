import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CareerPath.css";
import { useEffect } from "react";

export default function CareerPath() {
  const [form, setForm] = useState({
    objective: "",
    skills: "",
    values: "",
  });

  const [loading, setLoading] = useState(false); // ✅ loading state
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("authToken");

    try {
      // Paso 1: Guardar objetivos del usuario
      const saveResponse = await fetch(
        "https://pathfinder-back-hnoj.onrender.com/employees/goals",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({
            technologies: form.skills,
            goals: form.objective,
            project: form.values,
          }),
        }
      );

      const saveResult = await saveResponse.json();
      if (saveResult.error) {
        throw new Error("Failed to save goals: " + saveResult.error);
      }

      // Paso 2: Obtener recomendaciones
      const aiResponse = await fetch(
        "https://pathfinder-back-hnoj.onrender.com/ai/courses",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );

      const aiData = await aiResponse.json();

      if (!aiData.error) {
        localStorage.setItem("recommendedCourses", JSON.stringify(aiData));
        navigate("/recommendations");
      } else {
        alert("⚠ AI recommendation failed: " + aiData.error);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchGoals = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch(
          "https://pathfinder-back-hnoj.onrender.com/employees/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              token: token,
            },
          }
        );
        const data = await response.json();
        if (!data.error && data.Goal) {
          setForm({
            objective: data.Goal.goals || "",
            skills: data.Goal.technologies || "",
            values: data.Goal.project || "",
          });
        }
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, []);

  return (
    <div className="career-path-container fade-in">
      <div className="goal-sidecard">
        <h3>💡 Tips to Write Better Goals</h3>
        <ul>
          <li>Be specific and realistic about your objectives.</li>
          <li>Think about your long-term growth.</li>
          <li>Let your values guide your choices.</li>
        </ul>
      </div>
      <div className="goal-main">
        <h1>What is your next goal?</h1>
        <p>
          Let us help you build a career you love. By considering your profile
          and aspirations, we will recommend personalized courses that set you
          on the path to achieving your dreams.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              What is your most important professional objective right now?
            </label>
            <textarea
              name="objective"
              value={form.objective}
              onChange={handleChange}
              placeholder="This helps clarify the exact direction you want to pursue."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>
              What skills or knowledge do you feel you most need to develop to
              achieve your goal?
            </label>
            <textarea
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="This helps identify the priority areas for training and ensures you focus on courses or programs that truly add value."
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>
              How do your personal values and lifestyle influence the career you
              want to build?
            </label>
            <textarea
              name="values"
              value={form.values}
              onChange={handleChange}
              placeholder="This question digs deeper into the alignment between your professional aspirations and personal motivations..."
              rows="4"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Find Courses"}
          </button>
        </form>
      </div>
    </div>
  );
}
