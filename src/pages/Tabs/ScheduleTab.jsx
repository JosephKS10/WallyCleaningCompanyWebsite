import React, { useState } from 'react';

const ScheduleTab = ({ cleaner }) => {
  const [viewMode, setViewMode] = useState('weekly'); // 'weekly' or 'monthly'
  
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Get all days with cleaning assignments
  const getWeeklySchedule = () => {
    const schedule = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: []
    };

    cleaner?.siteInfo?.forEach(site => {
      // Only process sites that haven't been removed and are active/pending
      if (site.everydayValuation && !site.removedDate) {
        Object.entries(site.everydayValuation).forEach(([day, data]) => {
          if (data && data.selected && schedule[day]) {
            schedule[day].push({
              siteName: site.site_name || 'Unnamed Site',
              location: site.location || 'No location',
              time: site.cleaning_times || 'Time not set',
              price: data.price || 0,
              siteId: site._id || site.siteId
            });
          }
        });
      }
    });

    return schedule;
  };

  const weeklySchedule = getWeeklySchedule();

  return (
    <div className="schedule-tab">
      <div className="schedule-header">
        <h2 className="section-title">Cleaning Schedule</h2>
        
        <div className="view-controls">
          <button 
            className={`view-btn ${viewMode === 'weekly' ? 'active' : ''}`}
            onClick={() => setViewMode('weekly')}
          >
            Weekly View
          </button>
          <button 
            className={`view-btn ${viewMode === 'monthly' ? 'active' : ''}`}
            onClick={() => setViewMode('monthly')}
          >
            Monthly View
          </button>
        </div>
      </div>

      {viewMode === 'weekly' ? (
        <div className="weekly-schedule">
          <div className="week-header">
            <div className="week-nav">
              <button className="nav-btn">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              <div className="current-week">
                <h3>Week of {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</h3>
              </div>
              
              <button className="nav-btn">
                Next
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="week-grid-wrapper">
            <div className="week-grid">
              {daysOfWeek.map(day => (
                <div key={day} className="day-column">
                  <div className="day-header">
                    <h4 className="day-name">{day}</h4>
                    <span className="assignment-count">{weeklySchedule[day].length}</span>
                  </div>
                  
                  <div className="assignments-list">
                    {weeklySchedule[day].length > 0 ? (
                      weeklySchedule[day].map((task, index) => (
                        <div key={index} className="assignment-card">
                          <div className="assignment-header">
                            <h5 className="site-name">{task.siteName}</h5>
                          </div>
                          
                          <div className="assignment-details">
                            <div className="detail">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '12px', marginRight: '4px' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {task.time}
                            </div>
                            <div className="detail">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '12px', marginRight: '4px' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="truncate-text">{task.location}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-assignments">
                        No tasks
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="monthly-schedule">
          <div className="coming-soon">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3>Monthly View Coming Soon</h3>
            <p>We're working on implementing the monthly calendar view.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleTab;