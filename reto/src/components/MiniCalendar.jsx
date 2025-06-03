import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/MiniCalendar.css";

const MiniCalendar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="mini-calendar-container">
      <h5 className="calendar-section-header">Your Monthly View</h5>

      <Calendar
        onChange={setDate}
        value={date}
        locale="en-US" // 🌎 Set the locale to English (United States)
        formatMonthYear={
          (locale, date) => date.toLocaleString("en-US", { month: "short" }) // e.g., Jan, Feb, Mar
        }
        formatShortWeekday={
          (locale, date) =>
            date.toLocaleDateString("en-US", { weekday: "short" }) // e.g., Mon, Tue
        }
      />
    </div>
  );
};

export default MiniCalendar;
