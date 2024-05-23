// src/components/SecretarySchedule.js
import React, { useState } from 'react';
import axios from 'axios';

const daysOfWeek = [
  { name: 'Monday', value: 1 },
  { name: 'Tuesday', value: 2 },
  { name: 'Wednesday', value: 3 },
  { name: 'Thursday', value: 4 },
  { name: 'Friday', value: 5 },
  { name: 'Saturday', value: 6 },
  { name: 'Sunday', value: 0 },
];

const SecretarySchedule = () => {
  const [schedule, setSchedule] = useState([]);

  const handleDayChange = (day, time, checked) => {
    const newSchedule = [...schedule];
    const daySchedule = newSchedule.find(item => item.day === day) || { day, times: [] };

    if (checked) {
      daySchedule.times.push(time);
    } else {
      daySchedule.times = daySchedule.times.filter(t => t !== time);
    }

    const updatedSchedule = newSchedule.filter(item => item.day !== day);
    if (daySchedule.times.length > 0) {
      updatedSchedule.push(daySchedule);
    }

    setSchedule(updatedSchedule);
    console.log(schedule)
  };

  const saveSchedule = async () => {
    try {
      await axios.post('/api/recurring-schedules', schedule);
      alert('Schedule saved successfully!');
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const renderTimeCheckboxes = (day) => {
    const times = Array.from({ length: 9 }, (_, i) => `${9 + i}:00`);
    return times.map(time => (
      <div key={time}>
        <input
          type="checkbox"
          id={`${day.name}-${time}`}
          onChange={(e) => handleDayChange(day.value, time, e.target.checked)}
        />
        <label htmlFor={`${day.name}-${time}`}>{time}</label>
      </div>
    ));
  };

  return (
    <div>
      <h1>Set Schedule</h1>
      {daysOfWeek.map(day => (
        <div key={day.value}>
          <h3>{day.name}</h3>
          {renderTimeCheckboxes(day)}
        </div>
      ))}
      <button onClick={saveSchedule}>Save Schedule</button>
    </div>
  );
};

export default SecretarySchedule;
