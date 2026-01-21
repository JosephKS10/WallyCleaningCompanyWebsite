import React, { useState, useEffect } from 'react';
import { useCleanerAuth } from '../../contexts/CleanerAuthContext';
import {FaEdit} from 'react-icons/fa';

const OverviewTab = ({ cleaner }) => {
  const { getProfile } = useCleanerAuth();
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  // Mock tasks data - In production, you'll fetch this from API
  const mockTasks = [
    { id: 1, date: '2026-01-15', site: 'Office Building A', time: '9:00 AM', status: 'pending', type: 'cleaning' },
    { id: 2, date: '2026-01-15', site: 'Shopping Mall', time: '2:00 PM', status: 'pending', type: 'inspection' },
    { id: 3, date: '2026-01-16', site: 'Hospital Wing', time: '10:00 AM', status: 'completed', type: 'cleaning' },
    { id: 4, date: '2026-01-17', site: 'School Campus', time: '11:00 AM', status: 'pending', type: 'deep_clean' },
    { id: 5, date: '2026-01-17', site: 'Office Building B', time: '3:00 PM', status: 'pending', type: 'cleaning' },
    { id: 6, date: '2026-01-20', site: 'Apartment Complex', time: '5:00 PM', status: 'pending', type: 'cleaning' },
    { id: 7, date: '2026-01-20', site: 'Apartment Complex', time: '5:00 PM', status: 'pending', type: 'cleaning' },
    { id: 8, date: '2026-01-20', site: 'Apartment Complex', time: '5:00 PM', status: 'pending', type: 'cleaning' },
  ];
  
  // Mock notifications - In production, you'll fetch this from API
  const mockNotifications = [
    { id: 1, title: 'New Site Assigned', message: 'Office Building C has been added to your sites', time: '2 hours ago', read: false },
    { id: 2, title: 'Schedule Change', message: 'Shopping Mall cleaning rescheduled to 3:00 PM', time: '1 day ago', read: true },
    { id: 3, title: 'Invoice Generated', message: 'Invoice for January 2024 has been generated', time: '2 days ago', read: false },
    { id: 4, title: 'Leave Approved', message: 'Your leave request for Jan 20-22 has been approved', time: '3 days ago', read: true },
  ];

  // Calculate stats from cleaner data
  const totalSites = cleaner?.siteInfo?.length || 0;
  const activeSites = cleaner?.siteInfo?.filter(site => site.siteStatus === 'active').length || 0;
  const pendingSites = cleaner?.siteInfo?.filter(site => site.siteStatus === 'pending').length || 0;

  // Function to handle profile image upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        // Here you would call API to upload the image
        // uploadProfilePhoto(file);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to get tasks count for a specific date
  const getTaskCountForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const tasks = mockTasks.filter(task => task.date === dateStr);
    return tasks.length;
  };

  // Function to get dot color based on task count
  const getDotColor = (taskCount) => {
    if (taskCount === 0) return 'transparent';
    if (taskCount <= 2) return '#10B981'; // Green
    if (taskCount <= 6) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startingDay; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const isToday = new Date().toDateString() === currentDate.toDateString();
      const taskCount = getTaskCountForDate(currentDate);
      
      days.push({
        day,
        date: currentDate,
        isCurrentMonth: true,
        isToday,
        taskCount,
        dotColor: getDotColor(taskCount)
      });
    }
    
    return days;
  };

  // Get day name for header
  const getDayName = (dayIndex) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex];
  };

  // Get month name
  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Navigate to previous/next month
  const navigateMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  // Handle day click
  const handleDayClick = (dayData) => {
    if (dayData.isCurrentMonth && dayData.date) {
      setSelectedDate(dayData.date);
      // Filter tasks for selected date
      const dateStr = dayData.date.toISOString().split('T')[0];
      const tasks = mockTasks.filter(task => task.date === dateStr);
      setTasksForSelectedDate(tasks);
    }
  };

  // Mark notification as read
  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  // Get suburbs from cleaner data
  const getSuburbs = () => {
    if (!cleaner?.siteInfo) return 'Not specified';
    const suburbs = [...new Set(cleaner.siteInfo
      .filter(site => site.location)
      .map(site => {
        // Extract suburb from location (assuming format: "123 Street, Suburb, City")
        const parts = site.location.split(',');
        return parts.length >= 2 ? parts[1].trim() : site.location;
      })
    )];
    return suburbs.join(', ') || 'Not specified';
  };

  // Initialize tasks for today on component mount
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayTasks = mockTasks.filter(task => task.date === todayStr);
    setTasksForSelectedDate(todayTasks);
    setNotifications(mockNotifications);
  }, []);

  const calendarDays = generateCalendarDays();

  return (
    <div className="dashboard-overview">
      <h2 className="section-title">Dashboard Overview</h2>
       <h2 className='section-subtitle'>
           Hi {cleaner?.name || 'Cleaner'}!
          </h2>
      {/* Profile and Calendar Section */}
      <div className="profile-display-card">
        {/* HEADER ROW */}
        <div className="profile-header">
          <div className="profile-image-container">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="profile-picture-large"
              />
            ) : (
              <div className="profile-picture-placeholder">
                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}

            <button
              onClick={() => setShowPhotoModal(true)}
              className="edit-photo-btn"
            >
              <FaEdit />
            </button>
          </div>

         
        </div>

        {/* DETAILS */}
        <div className="profile-details-grid">
          <div className="detail-item">
            <span className="detail-value">{cleaner?.name || 'N/A'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value">{cleaner?.email || 'N/A'}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Phone</span>
            <span className="detail-value">{cleaner?.contactNumber || 'Not provided'}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Suburbs</span>
            <span className="detail-value">{getSuburbs()}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">ID</span>
            <span className="detail-value">{cleaner?.referenceId || 'N/A'}</span>
          </div>
        </div>

        
        {/* Right Side - Calendar */}
        <div className="calendar-section">
          <div className="calendar-header">
            <button onClick={() => navigateMonth(-1)} className="month-nav-btn">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="calendar-month">{getMonthName(selectedDate)}</h3>
            <button onClick={() => navigateMonth(1)} className="month-nav-btn">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="calendar-grid">
            {/* Day headers */}
            {[...Array(7)].map((_, index) => (
              <div key={index} className="calendar-day-header">
                {getDayName(index)}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarDays.map((dayData, index) => (
              <div 
                key={index}
                className={`calendar-day ${!dayData.isCurrentMonth ? 'other-month' : ''} ${dayData.isToday ? 'today' : ''}`}
                onClick={() => handleDayClick(dayData)}
              >
                {dayData.day && (
                  <>
                    <span className="day-number">{dayData.day}</span>
                    {dayData.dotColor !== 'transparent' && (
                      <div 
                        className="task-dot"
                        style={{ backgroundColor: dayData.dotColor }}
                        title={`${dayData.taskCount} task${dayData.taskCount !== 1 ? 's' : ''}`}
                      ></div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          
          {/* Task Count Legend */}
          <div className="task-legend">
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: '#10B981' }}></div>
              <span>1-2 tasks</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: '#F59E0B' }}></div>
              <span>3-6 tasks</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: '#EF4444' }}></div>
              <span>7+ tasks</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tasks and Notifications Section */}
      <div className="tasks-notifications-section">
        {/* Today's Tasks */}
        <div className="tasks-section">
          <h3 className="section-subtitle">Today's Tasks</h3>
          <div className="tasks-list">
            {tasksForSelectedDate.length > 0 ? (
              tasksForSelectedDate.map(task => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <h4>{task.site}</h4>
                    <span className={`task-status status-${task.status}`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="task-details">
                    <span className="task-time">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {task.time}
                    </span>
                    <span className="task-type">
                      {task.type.replace('_', ' ')}
                    </span>
                  </div>
                  <button className="task-action-btn">
                    View Details
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-tasks">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>No tasks for today</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Notifications */}
        <div className="notifications-section">
          <h3 className="section-subtitle">Notifications</h3>
          <div className="notifications-list">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <div className="notification-icon">
                  {!notification.read && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
                <div className="notification-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span className="notification-time">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Assignments (Keep existing) */}
      <div className="recent-activity">
        <h3 className="section-subtitle">Recent Site Assignments</h3>
        {cleaner?.siteInfo && cleaner.siteInfo.length > 0 ? (
          <div className="activity-list">
            {cleaner.siteInfo.slice(0, 5).map((site, index) => (
              <div key={site._id || index} className="activity-item">
                <div className="activity-info">
                  <h4>{site.site_name || 'Unnamed Site'}</h4>
                  <p className="activity-meta">
                    {site.location || 'Location not specified'} • {site.cleaning_frequency || 'Frequency not set'}
                  </p>
                  <p className="activity-time">
                    Assigned: {new Date(site.assignedDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`status-badge status-${site.siteStatus}`}>
                  {site.siteStatus?.charAt(0).toUpperCase() + site.siteStatus?.slice(1)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p>No sites assigned yet.</p>
          </div>
        )}
      </div>

      {/* Quick Stats (Keep existing) */}
      <div className="quick-stats">
        <div className="stat-box">
          <div className="stat-icon">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <h4>Induction Status</h4>
            <p>{cleaner?.inductionStatusCheck ? 'Completed' : 'In Progress'}</p>
          </div>
        </div>
        
        <div className="stat-box">
          <div className="stat-icon">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <h4>Quiz Score</h4>
            <p>{cleaner?.quizResults?.score || 0}/{cleaner?.quizResults?.totalQuestions || 0}</p>
          </div>
        </div>
        
        <div className="stat-box">
          <div className="stat-icon">
            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="stat-content">
            <h4>Contractor ID</h4>
            <p>{cleaner?.referenceId || 'Not assigned'}</p>
          </div>
        </div>
        

      </div>

      {/* Profile Photo Upload Modal */}
      {showPhotoModal && (
        <div className="modal-overlay" onClick={() => setShowPhotoModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Profile Photo</h3>
              <button onClick={() => setShowPhotoModal(false)} className="close-modal">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="photo-preview">
                {profileImage ? (
                  <img src={profileImage} alt="Preview" className="preview-image" />
                ) : (
                  <div className="preview-placeholder">
                    <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="profile-photo"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="file-input"
              />
              <div className="upload-btn-container">
                  <label htmlFor="profile-photo" className="upload-btn">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Choose Photo
              </label>
              </div>
            
              <div className="modal-actions">
                <button onClick={() => setShowPhotoModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    // Save photo to backend here
                    setShowPhotoModal(false);
                  }} 
                  className="save-btn"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;