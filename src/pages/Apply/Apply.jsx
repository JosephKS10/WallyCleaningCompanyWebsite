import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Apply.css';

function Apply() {
  const navigate = useNavigate(); 



  const currentDate = new Date().toISOString().split('T')[0]; 
 

  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    date: currentDate,
    suburb: '',
    contactNumber: '',
    email: '',
    nationality: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo({ ...personalInfo, [name]: value });
  };

  const [documentInfo, setDocumentInfo] = useState({
    ownCar: '',
    ownCarReason: '',
    ABN: '',
    ABNReason: '',
    policeCheck: '',
    policeCheckReason: '',
    workingWithChildren: '',
    previousExperience: '',
    previousExperienceDuration: '',
    previousExperienceReason: '',
    currentJob: '',
    hoursSpecified: '',
    coupleOrIndividual: '',
    partnerName: '',
    partnerDocuments: '',
  });

  const handleDocumentChange = (question, value) => {
    // Get the previous value of the checkbox
    const prevValue = documentInfo[question];
    setDocumentInfo({ ...documentInfo, [question]: value });

    if (prevValue === 'No' && value === 'Yes' && documentInfo[`${question}Reason`] !== '') {
        setDocumentInfo({ ...documentInfo, [`${question}Reason`]: '' });
    }
    };

    const handleReasonChange = (e) => {
        const { name, value } = e.target;
        setDocumentInfo({ ...documentInfo, [name]: value });
    };

  // Availability state
  const [time, setTime] = useState({
    all: false,
    startTimeMonday: '',
    endTimeMonday: '',
    startTimeTuesday: '',
    endTimeTuesday: '',
    startTimeWednesday: '',
    endTimeWednesday: '',
    startTimeThursday: '',
    endTimeThursday: '',
    startTimeFriday: '',
    endTimeFriday: '',
    startTimeSaturday: '',
    endTimeSaturday: '',
    startTimeSunday: '',
    endTimeSunday: '',
  });
  
  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    if (name === 'all') {
        let prevValue = time.all;
        let actualValue;
        if (!prevValue) {
            const updatedTime = {};
            if (availabilityDay.Monday && time.startTimeMonday && time.endTimeMonday) {
                Object.keys(availabilityDay).forEach(day => {
                    if (availabilityDay[day]) {
                        updatedTime[`startTime${day}`] = time.startTimeMonday;
                        updatedTime[`endTime${day}`] = time.endTimeMonday;
                    }
                });
                setTime({ ...time, ...updatedTime, all: true });
                actualValue = true;
            }
        } else {
            const updatedTime = {};
            Object.keys(time).forEach(key => {
                if (key.includes('startTime') || key.includes('endTime')) {
                    const day = key.replace('startTime', '').replace('endTime', '');
                    if (day !== 'Monday') {
                        updatedTime[key] = '';
                    }
                }
            });
            setTime({ ...time, ...updatedTime, all: false });
            actualValue = false;
        }
        // Update the start and end times based on the checkbox state
        setTime(prevState => ({
            ...prevState,
            startTimeMonday: prevState.startTimeMonday || '',
            endTimeMonday: prevState.endTimeMonday || '',
            startTimeTuesday: prevState.startTimeTuesday || '',
            endTimeTuesday: prevState.endTimeTuesday || '',
            startTimeWednesday: prevState.startTimeWednesday || '',
            endTimeWednesday: prevState.endTimeWednesday || '',
            startTimeThursday: prevState.startTimeThursday || '',
            endTimeThursday: prevState.endTimeThursday || '',
            startTimeFriday: prevState.startTimeFriday || '',
            endTimeFriday: prevState.endTimeFriday || '',
            startTimeSaturday: prevState.startTimeSaturday || '',
            endTimeSaturday: prevState.endTimeSaturday || '',
            startTimeSunday: prevState.startTimeSunday || '',
            endTimeSunday: prevState.endTimeSunday || '',
            all: actualValue
        }));
    } else {
        setTime({ ...time, [name]: value });
    }
};


  const RenderTimer = ({startTime, endTime}) => {
    return( 
    <div className="time-container">
        <div className="time-label">Time</div>
        <div className="time-inputs-container">
          <input 
            type="time" 
            name={startTime} 
            value={time[startTime]} 
            onChange={handleTimeChange} 
            className='time-input'
          />
          <span className="time-separator">-</span>
          <input 
            type="time" 
            name={endTime}
            value={time[endTime]} 
            onChange={handleTimeChange} 
            className='time-input'
          />
        </div>
        {formErrors.startTime && <div className="error-message time-error">{formErrors.startTime}</div>}
      </div>
    )
  }

  // Availability days state
  const [availabilityDay, setAvailabilityDay] = useState({
    all: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false
  });

  const handleAvailabilityDayChange = (e) => {
    const { name, checked } = e.target;
    if (name === 'all') {
        const updatedAvailabilityDay = Object.keys(availabilityDay).reduce((acc, day) => {
            acc[day] = checked;
            return acc;
        }, {});
        setAvailabilityDay(updatedAvailabilityDay);
    } else {
        setAvailabilityDay({ ...availabilityDay, [name]: checked });
    }
};



  // combining all the states
    let allStates = {
      personalInfo,
      documentInfo,
      availabilityDay,
      time,
    };


  const [formErrors, setFormErrors] = useState({});

  const validateAvailabilityDays = () => {
    const selectedDays = Object.values(availabilityDay);
    const atLeastOneDaySelected = selectedDays.some(day => day === true);
    if (!atLeastOneDaySelected) {
      return false; 
    }
    return true; 
  };

  
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!personalInfo.name.trim()) {
      errors.name = 'Name is required';
    }
  
    if (!personalInfo.suburb.trim()) {
      errors.suburb = 'Suburb is required';
    }

    if (!personalInfo.contactNumber.trim()) {
      errors.contactNumber = 'Contact number is required';
    }
    if (!personalInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(personalInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!personalInfo.nationality.trim()) {
      errors.nationality = 'Nationality is required';
    }

    if(!documentInfo.ownCar){
        errors.ownCar = 'This is required';
    }
    if(documentInfo.ownCar==="No" && !documentInfo.ownCarReason){
        errors.ownCarReason = 'This is required';
    }
    if(!documentInfo.ABN){
        errors.ABN = 'This is required';
    }
    if(documentInfo.ABN==="No" && !documentInfo.ABNReason){
        errors.ABNReason = 'This is required';
    }
    if(!documentInfo.policeCheck){
        errors.policeCheck = 'This is required';
    }
    if(documentInfo.policeCheck==="No" && !documentInfo.policeCheckReason){
        errors.policeCheckReason = 'This is required';
    }
    if(!documentInfo.workingWithChildren){
        errors.workingWithChildren = 'This is required';
    }
    if(!documentInfo.previousExperience){
        errors.previousExperience = 'This is required';
    }
    if(documentInfo.previousExperience==="Yes" && !documentInfo.previousExperienceReason && !documentInfo.previousExperienceDuration){
        errors.previousExperienceReason = 'Both are required';
    }
    if(!documentInfo.currentJob){
        errors.currentJob = 'This is required';
    }
    if(documentInfo.currentJob==="Yes" && !documentInfo.hoursSpecified){
        errors.currentJobReason = 'This is required';
    }
    if(!documentInfo.coupleOrIndividual){
        errors.coupleOrIndividual = 'This is required';
    }
    if(documentInfo.coupleOrIndividual === "Couple" && !documentInfo.partnerName && !documentInfo.partnerDocuments){
        errors.coupleOrIndividualReason = 'Both are required';
    }

  const isAvailabilityDaysValid = validateAvailabilityDays();
  if (!isAvailabilityDaysValid) {
    errors.availabilityDay = "Please select at least one day.";
  }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL_APPLY; 

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccessfully, setsubmittedSuccessfully] = useState(false);
  const [subHeading, setSubHeading] = useState("Please fill in your details below")

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitting")
    if (validateForm()) {
      setIsSubmitting(true); 
      const formData = {
        ...personalInfo,
        ...documentInfo,
        ...availabilityDay,
        ...time
      };
  
      const formDataToSubmit = new FormData();
  
      for (const key in formData) {
        formDataToSubmit.append(key, formData[key]);
      }
  
      fetch(scriptUrl, {
        method: 'POST',
        body: formDataToSubmit
      })
      .then(response => {
        setIsSubmitting(false); 
        if (response.ok) {
            setSubHeading("")
          setsubmittedSuccessfully(true);
          console.log('Form submitted successfully');
          setsubmittedSuccessfully(true);
        } else {
          console.error('Form submission failed');

        }
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle error cases
      });
    } else {
      
      const firstErrorKey = Object.keys(formErrors)[0];
      const firstErrorElement = document.querySelector(`[name="${firstErrorKey}"]`);
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    
  };

  useEffect(() => {
    window.scrollTo(0, 0);
}, []); 

  return (
    <div className="apply-container">
      <div className="apply-header">
        <h1>Wally Cleaning Company Job Application</h1>
        <p>{subHeading}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="apply-form">
        {!submittedSuccessfully ? (
          <div>
            <div className="boxContent">
              
              <div className="lineContainer">
                <div className="QuestionLine">Name</div>
                <div>
                <div className="answerLine">
                  <input
                    type="text"
                    name="name"
                    value={personalInfo.name}
                    onChange={handleInputChange}
                    className='inputLine'
                    placeholder='Enter name...'
                  />
                </div>
                <div>
                {formErrors.name && <div className="error-message">{formErrors.name}</div>}
              </div>
              </div>
              </div>

              <div className="lineContainer">
                <div className="QuestionLine">Date</div>
                <div>
                <div className="answerLine">
                  <input
                    type="date"
                    name="date"
                    value={personalInfo.date}
                    className='dateLine'
                    disabled
                  />
                </div>
                <div>
                {formErrors.dob && <div className="error-message">{formErrors.dob}</div>}
              </div>
              </div>
              </div>

              <div className="lineContainer">
                <div className="QuestionLine">Contact Number</div>
                <div>
                <div className="answerLine">
                  <input
                    type="number"
                    name="contactNumber"
                    value={personalInfo.contactNumber}
                    onChange={handleInputChange}
                    className='inputLine'
                    placeholder='Enter contact number...'

                  />
                </div>
                <div>
                {formErrors.contactNumber && <div className="error-message">{formErrors.contactNumber}</div>}
              </div>
              </div>
              </div>

              <div className="lineContainer">
                <div className="QuestionLine">Email</div>
                <div>
                <div className="answerLine">
                  <input
                    type="email"
                    name="email"
                    value={personalInfo.email}
                    onChange={handleInputChange}
                    className='inputLine'
                    placeholder='Enter email...'

                  />
                </div>
                <div>
                {formErrors.email && <div className="error-message">{formErrors.email}</div>}
              </div>
              </div>
              </div>

              <div className="lineContainer">
                <div className="QuestionLine">Suburb</div>
                <div>
                <div className="answerLine">
                  <input
                    type="text"
                    name="suburb"
                    value={personalInfo.suburb}
                    onChange={handleInputChange}
                    className='inputLine'
                    placeholder='Enter suburb...'
                  />
                </div>
                <div>
                {formErrors.suburb && <div className="error-message">{formErrors.suburb}</div>}
              </div>
              </div>
              </div>
            

            <div className="lineContainer">
                <div className="QuestionLine">Nationality</div>
                <div>
                <div className="answerLine">
                  <input
                    type="text"
                    name="nationality"
                    value={personalInfo.nationality}
                    onChange={handleInputChange}
                    className='inputLine'
                    placeholder='Enter nationality...'
                  />
                </div>
                <div>
                {formErrors.nationality && <div className="error-message">{formErrors.nationality}</div>}
              </div>
              </div>
              </div>

              </div>

          <br />
          <div className="boxContent">

          <div className="lineContainer">
            <div className="QuestionLine">Own Car</div>
            <div>
            <div className="answerLine">
              <label className='answerText'> <input
                type="checkbox"
                name="ownCar"
                value="Yes"
                checked={documentInfo.ownCar === 'Yes'}
                onChange={(e) => handleDocumentChange('ownCar', e.target.value)}
                className='checkbox'
              />Yes</label>
              <label className='answerText'> <input
                type="checkbox"
                name="ownCar"
                value="No"
                checked={documentInfo.ownCar === 'No'}
                onChange={(e) => handleDocumentChange('ownCar', e.target.value)}
                className='checkbox'
              />No</label>
            </div>
            <div>
            {formErrors.ownCar && <div className="error-message">{formErrors.ownCar}</div>}
          </div>
          </div>
          </div>
          <div>
          {documentInfo['ownCar'] === "No" && (
              <div>
              <div className='noExtraField'>
              <p className='noExtraQuestion'>If no, when will you get a car?</p>
              <input
                  type="text"
                  name='ownCarReason'
                  value={documentInfo.ownCarReason}
                  onChange={handleReasonChange}
                  className='inputLine'
                  placeholder="for ex 1 week..."
              />
              </div> 
              <div>
              {formErrors.ownCarReason && <div className="error-message">{formErrors.ownCarReason}</div>}
              </div> 
              <br />
              </div>  )}
              
          </div>
         

          <div className="lineContainer">
            <div className="QuestionLine">ABN</div>
            <div>
            <div className="answerLine">
              <label className='answerText'> <input
                type="checkbox"
                name="ABN"
                value="Yes"
                checked={documentInfo.ABN === 'Yes'}
                onChange={(e) => handleDocumentChange('ABN', e.target.value)}
                className='checkbox'
              />Yes</label>
              <label className='answerText'> <input
                type="checkbox"
                name="ABN"
                value="No"
                checked={documentInfo.ABN === 'No'}
                onChange={(e) => handleDocumentChange('ABN', e.target.value)}
                className='checkbox'
              />No</label>
            </div>
            <div>
            {formErrors.ABN && <div className="error-message">{formErrors.ABN}</div>}
          </div>
          </div>
          </div>
          <div>
           {documentInfo['ABN'] === "No" && (
              <div>
              <div className='noExtraField'>
              <p className='noExtraQuestion'>If no, when will you get ABN?</p>
              <input
                  type="text"
                  name='ABNReason'
                  value={documentInfo.ABNReason}
                  onChange={handleReasonChange}
                  className='inputLine'
                  placeholder="for ex 1 week..."            />
              </div> 
              <div>
              {formErrors.ABNReason && <div className="error-message">{formErrors.ABNReason}</div>}
              </div> 
              <br /> 
              </div>  )}
          </div>

          
          <div className="lineContainer">
            <div className="QuestionLine">Police Check</div>
            <div>
            <div className="answerLine">
              <label className='answerText'>
              <input
                type="checkbox"
                name="policeCheck"
                value="Yes"
                checked={documentInfo.policeCheck === 'Yes'}
                onChange={(e) => handleDocumentChange('policeCheck', e.target.value)}
                className='checkbox'
              />Yes</label>
              <label className='answerText'> 
              <input
                type="checkbox"
                name="policeCheck"
                value="No"
                checked={documentInfo.policeCheck === 'No'}
                onChange={(e) => handleDocumentChange('policeCheck', e.target.value)}
                className='checkbox'
              />No</label>
            </div>
            <div>
            {formErrors.policeCheck && <div className="error-message">{formErrors.policeCheck}</div>}
          </div>
          </div>
          </div>
          <div>
          {documentInfo['policeCheck'] === "No" && (
              <div>
              <div className='noExtraField'>
              <p className='noExtraQuestion'>If no, when will you get Police Check?</p>
              <input
                  type="text"
                  name='policeCheckReason'
                  value={documentInfo.policeCheckReason}
                  onChange={handleReasonChange}
                  className='inputLine'
                  placeholder="for ex 1 week..."            />
              </div> 
              <div>
              {formErrors.policeCheckReason && <div className="error-message">{formErrors.policeCheckReason}</div>}
              </div> 
              <br />
              </div>  )}
          </div>

          <div className="lineContainer">
            <div className="QuestionLine">Working with Children Check</div>
            <div>
            <div className="answerLine">
              <label className='answerText'> 
              <input
                type="checkbox"
                name="workingWithChildren"
                value="Yes"
                checked={documentInfo.workingWithChildren === 'Yes'}
                onChange={(e) => handleDocumentChange('workingWithChildren', e.target.value)}
                className='checkbox'
              />Yes</label>
              <label className='answerText'>
              <input
                type="checkbox"
                name="workingWithChildren"
                value="No"
                checked={documentInfo.workingWithChildren === 'No'}
                onChange={(e) => handleDocumentChange('workingWithChildren', e.target.value)}
                className='checkbox'
              />No</label>
            </div>
            <div>
            {formErrors.workingWithChildren && <div className="error-message">{formErrors.workingWithChildren}</div>}
          </div>
          </div>
          </div>
          <div>
          </div>
          </div>

      <br /><br />

      <div className="boxContent">
          <div className="lineContainer">
            <div className="QuestionLine">Do you have any previous experience in commercial cleaning</div>
            <div>
            <div className="answerLine">
              <label className='answerText'> <input
                type="checkbox"
                name="previousExperience"
                value="Yes"
                checked={documentInfo.previousExperience === 'Yes'}
                onChange={(e) => handleDocumentChange('previousExperience', e.target.value)}
                className='checkbox'
              />Yes</label>
              <label className='answerText'> <input
                type="checkbox"
                name="previousExperience"
                value="No"
                checked={documentInfo.previousExperience === 'No'}
                onChange={(e) => handleDocumentChange('previousExperience', e.target.value)}
                className='checkbox'
              />No</label>
            </div>
            <div>
            {formErrors.previousExperience && <div className="error-message">{formErrors.previousExperience}</div>}
          </div>
          </div>
          </div>
          <div>
          {documentInfo['previousExperience'] === "Yes" && (
              
              <div className='noExtraField'>
              <p className='noExtraQuestion'>specify years/months</p>
              <input
                  type="text"
                  name='previousExperienceDuration'
                  value={documentInfo.previousExperienceDuration}
                  onChange={handleReasonChange}
                  className='inputLine'
                  placeholder="specify..."
              />
              </div> 
              
                )}
          {documentInfo['previousExperience'] === "Yes" && (
              <div>
              <div className='noExtraField'>
              <p className='noExtraQuestion'>Elaborate</p>
              <textarea
                  type="text"
                  name='previousExperienceReason'
                  value={documentInfo.previousExperienceReason}
                  onChange={handleReasonChange}
                  className='inputLine'
                  placeholder="elaborate..."
                  rows={5}
                  style={{height: "10vw"}}
              />
              </div>
              <div>
            {formErrors.previousExperienceReason && <div className="error-message">{formErrors.previousExperienceReason}</div>}
          </div> 
          <br />
              </div>    
              )}

          </div>
          <div className="lineContainer">
            <div className="QuestionLine">Do you have any current jobs</div>
            <div>
            <div className="answerLine">
              <label className='answerText'> <input
                type="checkbox"
                name="currentJob"
                value="Yes"
                checked={documentInfo.currentJob === 'Yes'}
                onChange={(e) => handleDocumentChange('currentJob', e.target.value)}
                className='checkbox'
              />Yes</label>
              <label className='answerText'> <input
                type="checkbox"
                name="currentJob"
                value="No"
                checked={documentInfo.currentJob === 'No'}
                onChange={(e) => handleDocumentChange('currentJob', e.target.value)}
                className='checkbox'
              />No</label>
            </div>
            <div>
            {formErrors.currentJob && <div className="error-message">{formErrors.currentJob}</div>}
          </div>
          </div>
          </div>
          <div>
          {documentInfo['currentJob'] === "Yes" && (
              <div>
                 <div className='noExtraField'>
                 <p className='noExtraQuestion'>Specify hours for the job</p>
                 <input
                     type="text"
                     name='hoursSpecified'
                     value={documentInfo.hoursSpecified}
                     onChange={handleReasonChange}
                     className='inputLine'
                     placeholder="for ex 3PM to 6PM"
                     rows={5}
                 />
                 </div> 
                 <div>
            {formErrors.currentJobReason && <div className="error-message">{formErrors.currentJobReason}</div>}
          </div> 
                 </div>
                  )}
          </div>
          </div>

      <br /><br />

      <div className="boxContent">
          <div className="lineContainer">
            <div className="QuestionLine">Will you work as a couple or individual</div>
            <div>
            <div className="answerLine">
              <label className='answerText'> <input
                type="checkbox"
                name="coupleOrIndividual"
                value="Couple"
                checked={documentInfo.coupleOrIndividual === 'Couple'}
                onChange={(e) => handleDocumentChange('coupleOrIndividual', e.target.value)}
                className='checkbox'
              />Couple</label>
              <label className='answerText'> <input
                type="checkbox"
                name="coupleOrIndividual"
                value="Individual"
                checked={documentInfo.coupleOrIndividual === 'Individual'}
                onChange={(e) => handleDocumentChange('coupleOrIndividual', e.target.value)}
                className='checkbox'
              />Individual</label>
            </div>
            <div>
            {formErrors.coupleOrIndividual && <div className="error-message">{formErrors.coupleOrIndividual}</div>}
          </div>
          </div>
          </div>
          {documentInfo['coupleOrIndividual'] === "Couple" && (
              <div className='noExtraField'>
              <p className='noExtraQuestion'><b>Partner name</b></p>
              <input
                  type="text"
                  name='partnerName'
                  value={documentInfo.partnerName}
                  onChange={handleReasonChange}
                  className='inputLine'
                  placeholder="Enter name..."
              />
              <br />
              </div>    )}
              {documentInfo['coupleOrIndividual'] === "Couple" && (
                  <div className="lineContainer">
                  <div className="QuestionLine">Does the partner have all the above mentioned documents?</div>
                  <div>
                  <div className="answerLine">
                    <label className='answerText'> <input
                      type="checkbox"
                      name="partnerDocuments"
                      value="Yes"
                      checked={documentInfo.partnerDocuments === 'Yes'}
                      onChange={(e) => handleDocumentChange('partnerDocuments', e.target.value)}
                      className='checkbox'
                    />Yes</label>
                    <label className='answerText'> <input
                      type="checkbox"
                      name="partnerDocuments"
                      value="No"
                      checked={documentInfo.partnerDocuments === 'No'}
                      onChange={(e) => handleDocumentChange('partnerDocuments', e.target.value)}
                      className='checkbox'
                    />No</label>
                  </div>
                  <div>
                  {formErrors.coupleOrIndividualReason && <div className="error-message">{formErrors.coupleOrIndividualReason}</div>}
                </div>
                </div>
                </div>)}
          </div>

      <br /><br />
      <div className="boxContent">
          <div className="lineContainer1">
            <div className="Question">Which days are you available to work?</div>
            <div>
            <div className="answerLineVerticalCheckBox">
            <label  className='answerCheckboxVertical'><input 
                type="checkbox" 
                name="all" 
                checked={availabilityDay.all} 
                onChange={handleAvailabilityDayChange}
                className='checkbox' 
              />Through out the week</label>
              <label  className='answerCheckboxVertical'><input 
                type="checkbox" 
                name="Monday" 
                checked={availabilityDay.Monday} 
                onChange={handleAvailabilityDayChange}
                className='checkbox' 
              />Mondays</label>
               {availabilityDay.Monday && <RenderTimer startTime="startTimeMonday" endTime="endTimeMonday"/>} 
               {availabilityDay.Monday && <div><label  className='answerCheckboxVertical' style={{fontSize: "15px"}}><input 
                type="checkbox" 
                name="all" 
                value="Yes"
                checked={time.all} 
                onChange={handleTimeChange}
                className='checkbox' 
              />Same time for all the selected days</label><br /></div>}

              <label  className='answerCheckboxVertical'><input 
                type="checkbox" 
                name="Tuesday" 
                checked={availabilityDay.Tuesday} 
                onChange={handleAvailabilityDayChange} 
                className='checkbox' 
              />Tuesdays</label>
               {availabilityDay.Tuesday &&<RenderTimer startTime="startTimeTuesday" endTime="endTimeTuesday"/>} 
              <label  className='answerCheckboxVertical'><input 
                type="checkbox" 
                name="Wednesday" 
                checked={availabilityDay.Wednesday} 
                onChange={handleAvailabilityDayChange} 
                className='checkbox' 
              />Wednesdays</label>
               {availabilityDay.Wednesday && <RenderTimer startTime="startTimeWednesday" endTime="endTimeWednesday"/>} 
              <label  className='answerCheckboxVertical'><input 
                type="checkbox" 
                name="Thursday" 
                checked={availabilityDay.Thursday} 
                onChange={handleAvailabilityDayChange} 
                className='checkbox' 
              />Thursdays</label>
               {availabilityDay.Thursday && <RenderTimer startTime="startTimeThursday" endTime="endTimeThursday"/>} 
              <label  className='answerCheckboxVertical'><input 
                type="checkbox" 
                name="Friday" 
                checked={availabilityDay.Friday} 
                onChange={handleAvailabilityDayChange} 
                className='checkbox' 
              />Fridays</label>
               {availabilityDay.Friday && <RenderTimer startTime="startTimeFriday" endTime="endTimeFriday"/>} 
              <label  className='answerCheckboxVertical'><input 
                type="checkbox" 
                name="Saturday" 
                checked={availabilityDay.Saturday} 
                onChange={handleAvailabilityDayChange} 
                className='checkbox' 
              />Saturdays</label>
               {availabilityDay.Saturday && <RenderTimer startTime="startTimeSaturday" endTime="endTimeSaturday"/>} 
              <label className='answerCheckboxVertical'><input 
                type="checkbox" 
                name="Sunday" 
                checked={availabilityDay.Sunday} 
                onChange={handleAvailabilityDayChange} 
                className='checkbox' 
              />Sundays</label>
               {availabilityDay.Sunday && <RenderTimer startTime="startTimeSunday" endTime="endTimeSunday"/>} 
            </div>
            <div>
                  {formErrors.availabilityDay && <div className="error-message" style={{textAlign:"center"}}>{formErrors.availabilityDay}</div>}
              </div>
              </div>
          </div>
        </div>
        <br /><br />
        

        <button  type='submit' className="nextButton" disabled={isSubmitting}>Submit</button>
        {isSubmitting && <div className="modal">Loading... Please wait while your form is being submitted</div>}
          </div>
        ) : (
          <div className="thankyou-box">
            <h2>Thank You!</h2>
            <p>Your application has been submitted successfully. We will review your information and get back to you soon.</p>
          </div>
        )}
      </form>
    </div>
  );
}

export default Apply;