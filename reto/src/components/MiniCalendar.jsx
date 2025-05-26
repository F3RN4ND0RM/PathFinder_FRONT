import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/MiniCalendar.css";

const MiniCalendar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="mini-calendar-container">
      <h5 className="calendar-title">📅Save the date</h5>
      <Calendar
        onChange={setDate}
        value={date}
        formatMonthYear={(locale, date) =>
          date.toLocaleString("es-ES", { month: "long" })
        }
      />
    </div>
  );
};

export default MiniCalendar;
