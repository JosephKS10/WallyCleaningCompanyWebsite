import React, { useState } from 'react';

const ScheduleTab = ({ cleaner }) => {
  const [viewMode, setViewMode] = useState('weekly'); // 'weekly' or 'monthly'
  
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
      if (site.everydayValuation) {
        Object.entries(site.everydayValuation).forEach(([day, data]) => {
          if (data.selected && schedule[day]) {
            schedule[day].push({
              siteName: site.site_name,
              location: site.location,
              time: site.cleaning_times,
              price: data.price,
              siteId: site._id
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
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
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

          <div className="week-grid">
            
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