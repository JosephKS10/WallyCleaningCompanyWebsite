import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import { startOfMonth, endOfMonth } from 'date-fns';
import { FaFileAlt, FaClock, FaCheckCircle } from 'react-icons/fa';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { shiftAPI, siteAPI } from '../../utils/api';

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const PUBLIC_HOLIDAYS_2026 = [
  '2026-01-01', '2026-01-26', '2026-03-09', '2026-04-03', 
  '2026-04-04', '2026-04-05', '2026-04-06', '2026-04-25', 
  '2026-06-08', '2026-11-03', '2026-12-25', '2026-12-28'
];

// Helper for Shift Prefix Icons
const getShiftPrefix = (type) => {
  if (type === 'task') return '🛠️ ';
  if (type === 'event') return '📅 ';
  return '';
};

const ScheduleTab = ({ cleaner }) => {
  const [shifts, setShifts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Controls the calendar's current viewed month
  const [calendarDate, setCalendarDate] = useState(new Date());
  
  // Controls the task list below the calendar
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Modal States
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskSiteDetails, setTaskSiteDetails] = useState(null);
  const [isClocking, setIsClocking] = useState(false);

  // 1. Fetch Shifts for the viewed month
  useEffect(() => {
    const fetchShifts = async () => {
      if (!cleaner?._id) return;
      try {
        setIsLoading(true);
        // Fetch slightly wider range to cover the whole calendar view
        const year = calendarDate.getFullYear();
        const month = calendarDate.getMonth();
        const startDate = format(new Date(year, month, 1), 'yyyy-MM-dd');
        const endDate = format(new Date(year, month + 1, 0), 'yyyy-MM-dd');

        const response = await shiftAPI.getMyShifts({ 
          cleanerId: cleaner._id,
          startDate,
          endDate
        });

        if (response.success) {
          const formattedShifts = response.data.map(shift => {
            const shiftDate = new Date(shift.date);
            return {
              ...shift,
              title: `${getShiftPrefix(shift.shiftType)}${shift.shiftName}`,
              start: shiftDate,      
              end: shiftDate,         
              allDay: true            
            };
          });
          setShifts(formattedShifts);
        }
      } catch (error) {
        console.error("Failed to load schedule shifts", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShifts();
  }, [cleaner?._id, calendarDate.getMonth(), calendarDate.getFullYear()]);

  // 2. Fetch full site details when a task is clicked (For Scope of Work)
  useEffect(() => {
    const fetchSiteDetailsForTask = async () => {
      if (selectedTask && selectedTask.siteId) {
        try {
          const siteId = selectedTask.siteId._id || selectedTask.siteId;
          const siteData = await siteAPI.getSite(siteId);
          if (siteData && siteData.success !== false) {
             setTaskSiteDetails(siteData.data || siteData);
          }
        } catch (error) {
          console.error("Failed to fetch site details for modal", error);
        }
      }
    };
    if (selectedTask) fetchSiteDetailsForTask();
    else setTaskSiteDetails(null);
  }, [selectedTask]);

  // 3. Filter the fetched shifts to show in the list below the calendar
  const tasksForSelectedDate = shifts.filter(shift => {
    return new Date(shift.date).toDateString() === selectedDate.toDateString();
  });

  // Calendar Event Handlers
  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start); // Update the list below
  };

  const handleSelectEvent = (event) => {
    setSelectedDate(event.start); // Update the list below
    setSelectedTask(event); // Open the modal
  };

  // Clock In/Out Handler
  const handleClockAction = async (action) => {
    if (!selectedTask) return;
    try {
      setIsClocking(true);
      const response = await shiftAPI.clockInOut(selectedTask._id, action);
      if (response.success) {
        // Update local shifts array
        const updatedShift = {
          ...response.data,
          title: `${getShiftPrefix(response.data.shiftType)}${response.data.shiftName}`,
          start: new Date(response.data.date),
          end: new Date(response.data.date),
          allDay: true
        };
        setShifts(prev => prev.map(s => s._id === selectedTask._id ? updatedShift : s));
        setSelectedTask(updatedShift);
      }
    } catch (error) {
      alert(error.response?.data?.message || `Failed to clock ${action === 'clockIn' ? 'in' : 'out'}.`);
    } finally {
      setIsClocking(false);
    }
  };

  // Styling for the Calendar (Using your FBI Green theme!)
  const eventStyleGetter = (event) => {
    const baseColor = '#22A82A'; // FBI Green

    let style = {
      backgroundColor: baseColor,
      borderRadius: '5px',
      opacity: 0.9,
      color: 'white',
      border: `1px solid ${baseColor}`,
      display: 'block',
      fontSize: '0.8rem',
      padding: '2px 5px'
    };

    if (event.shiftType === 'task') {
      style.backgroundImage = 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)';
    } else if (event.shiftType === 'event') {
      style.backgroundColor = '#ffffff';
      style.color = baseColor;
      style.border = `2px dashed ${baseColor}`;
      style.fontWeight = '600';
    }

    return { style };
  };

  const customDayPropGetter = (date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    // Highlight selected day in light green
    if (date.toDateString() === selectedDate.toDateString()) {
      return { style: { backgroundColor: '#f0fdf4' } }; // Very light green
    }
    // Highlight holidays in yellow
    if (PUBLIC_HOLIDAYS_2026.includes(dateString)) {
      return { className: 'public-holiday-cell' };
    }
    return {};
  };

  return (
    <div className="schedule-tab">
      <div className="schedule-header">
        <h2 className="section-title">My Schedule</h2>
      </div>

      {/* --- THE CALENDAR --- */}
      <div className="calendar-responsive-wrapper">
      <div style={{ height: '500px', minWidth: '700px', backgroundColor: 'white', padding: '15px', borderRadius: '12px', marginBottom: '2rem',  }}>
        <Calendar
          localizer={localizer}
          events={shifts}
          startAccessor="start"
          endAccessor="end"
          selectable={true}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          dayPropGetter={customDayPropGetter}
          views={['month', 'week', 'day']}
          defaultView="month"
          onNavigate={(newDate) => setCalendarDate(newDate)} // Track month changes to fetch new data
        />
      </div>
      </div>

      {/* --- SELECTED DAY'S TASKS LIST --- */}
      <div className="tasks-section" style={{ width: '100%' }}>
        <h3 className="section-subtitle">
          Tasks for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
        </h3>
        
        <div className="tasks-list">
          {isLoading ? (
            <div className="empty-tasks"><p>Loading tasks...</p></div>
          ) : tasksForSelectedDate.length > 0 ? (
            tasksForSelectedDate.map(task => (
              <div key={task._id} className="task-card">
                <div className="task-header">
                  <h4>{task.shiftName}</h4>
                  <span className={`task-status status-${task.status}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="task-details">
                  <span className="task-time">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {task.siteId?.site_name || 'Site'}
                  </span>
                  <span className="task-type" style={{ textTransform: 'capitalize' }}>
                    {task.shiftType}
                  </span>
                </div>
                <button 
                  className="task-action-btn"
                  onClick={() => setSelectedTask(task)}
                >
                  View Details & Clock In
                </button>
              </div>
            ))
          ) : (
            <div className="empty-tasks">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No tasks scheduled for this day</p>
            </div>
          )}
        </div>
      </div>

      {/* --- TASK DETAILS & CLOCK-IN MODAL (Reused from Overview) --- */}
      {selectedTask && (
        <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>Task Details</h3>
              <button onClick={() => setSelectedTask(null)} className="close-modal">&times;</button>
            </div>
            <div className="modal-body task-details-modal">
              <div className="task-modal-header">
                <h2>{selectedTask.shiftName}</h2>
                <span className={`status-badge status-${selectedTask.status}`}>
                  {selectedTask.status.replace('_', ' ')}
                </span>
              </div>

              <div className="task-info-grid">
                <div className="info-block">
                  <span className="info-label">Site Name</span>
                  <p>{selectedTask.siteId?.site_name || 'N/A'}</p>
                </div>
                <div className="info-block">
                  <span className="info-label">Date</span>
                  <p>{new Date(selectedTask.date).toLocaleDateString()}</p>
                </div>
                <div className="info-block">
                  <span className="info-label">Task Type</span>
                  <p style={{ textTransform: 'capitalize' }}>{selectedTask.shiftType}</p>
                </div>
              </div>

              {selectedTask.internalNotes && (
                <div className="task-notes">
                  <span className="info-label">Notes / Instructions</span>
                  <p>{selectedTask.internalNotes}</p>
                </div>
              )}

              {taskSiteDetails?.scope_of_work ? (
                <a href={taskSiteDetails.scope_of_work} target="_blank" rel="noopener noreferrer" className="scope-of-work-link">
                  <FaFileAlt /> View Scope of Work Document
                </a>
              ) : (
                <div className="scope-of-work-link disabled">
                  <FaFileAlt /> Loading Site Details...
                </div>
              )}

              <div className="clock-section">
                {selectedTask.status === 'pending' && (
                  new Date(selectedTask.date).toDateString() === new Date().toDateString() ? (
                    <button 
                      className="clock-btn clock-in" 
                      onClick={() => handleClockAction('clockIn')}
                      disabled={isClocking}
                    >
                      <FaClock /> {isClocking ? 'Processing...' : 'Clock In Now'}
                    </button>
                  ) : (
                    <div className="clock-completed-state" style={{ background: '#f9fafb', borderColor: '#e5e7eb', justifyContent: 'center' }}>
                      <p style={{ color: '#6b7280', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaClock />
                        {new Date(selectedTask.date).setHours(0,0,0,0) > new Date().setHours(0,0,0,0) 
                          ? "Clock-in will be available on the day of the shift." 
                          : "This shift's scheduled date has passed."}
                      </p>
                    </div>
                  )
                )}

                {selectedTask.status === 'in_progress' && (
                  <div className="clock-active-state">
                    <p className="clock-time-text">
                      Clocked in at: {new Date(selectedTask.clockInTime).toLocaleTimeString()}
                    </p>
                    <button 
                      className="clock-btn clock-out" 
                      onClick={() => handleClockAction('clockOut')}
                      disabled={isClocking}
                    >
                      <FaClock /> {isClocking ? 'Processing...' : 'Clock Out & Complete'}
                    </button>
                  </div>
                )}

                {selectedTask.status === 'completed' && (
                  <div className="clock-completed-state">
                    <FaCheckCircle className="completed-icon" />
                    <div>
                      <p><strong>Shift Completed</strong></p>
                      <p>In: {new Date(selectedTask.clockInTime).toLocaleTimeString()}</p>
                      <p>Out: {new Date(selectedTask.clockOutTime).toLocaleTimeString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleTab;