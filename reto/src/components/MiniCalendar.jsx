import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/MiniCalendar.css";

const MiniCalendar = ({ onDateSelect, reminders }) => {
  const [date, setDate] = useState(new Date());

  const handleChange = (selectedDate) => {
    setDate(selectedDate);
    if (onDateSelect) onDateSelect(selectedDate);
  };

  return (
    <div className="mini-calendar-container">
      <h5 className="calendar-section-header">Your Monthly View</h5>

      <Calendar
        onChange={handleChange}
        value={date}
        locale="en-US"
        minDetail="year"
        onClickDay={handleChange}
        tileContent={({ date, view }) => {
          const key = date.toDateString();
          if (reminders[key]?.length > 0 && view === "month") {
            return (
              <div style={{ marginTop: 2 }}>
                <span
                  style={{
                    display: "block",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#6c3df3",
                    margin: "0 auto",
                  }}
                ></span>
              </div>
            );
          }
          return null;
        }}
      />
    </div>
  );
};

export default MiniCalendar;

