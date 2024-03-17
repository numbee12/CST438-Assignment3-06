import React, {useState} from 'react';
import { confirmAlert } from 'react-confirm-alert'; // Import
import {useHistory} from 'react-router-dom';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Button from '@mui/material/Button';
import {SERVER_URL} from '../../Constants';

// student can view schedule of sections 
// use the URL /enrollment?studentId=3&year= &semester=
// The REST api returns a list of EnrollmentDTO objects
// studentId=3 will be removed in assignment 7

// to drop a course 
// issue a DELETE with URL /enrollment/{enrollmentId}

const ScheduleView = (props) => {

    const headers = ['SecNo', 'CourseId', 'SecId',  'Year', 'Semester', 'Building', 'Room', 'Times', '', ''];

    const [search, setSearch] = useState({
        scheduleId: '',
        year: '',
        semester: ''
    });
    const [message, setMessage] = useState('');
    const [schedules, setSchedules] = useState([]);

    const fetchSections = async () => {
            if (search.courseId==='' || search.year==='' || search.semester==='' ) {
                setMessage("Enter search parameters");
            } else {
              try {
                const response = await fetch(`${SERVER_URL}/courses/${search.courseId}/sections?year=${search.year}&semester=${search.semester}`);
                if (response.ok) {
                  const data = await response.json();
                  setSchedules(data);
                } else {
                  const rc = await response.json();
                  setMessage(rc.message);
                }
              } catch(err) {
                setMessage("network error: "+err);
              }
            }
        }

        const deleteSchedule = async (secNo) => {
          try {
            const response = await fetch (`${SERVER_URL}/sections/${secNo}`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            if (response.ok) {
              setMessage("Schedule deleted");
              fetchSections();
            } else {
              const rc = await response.json();
              setMessage(rc.message);
            }
          } catch (err) {
            setMessage("network error: "+err);
          }
        }


        const editChange = (event) => {
            setSearch({...search,  [event.target.name]:event.target.value});
        }

        const onDelete = (SecNo) => {
          confirmAlert({
              title: 'Confirm to delete',
              message: 'Do you really want to delete?',
              buttons: [
                {
                  label: 'Yes',
                  onClick: () => deleteSchedule(SecNo)
                },
                {
                  label: 'No',
                }
              ]
            });
        }


      return(
              <div>
                  <h3>Schedules!!!</h3>

                  <h4>{message}</h4>
                  <h4>Enter course prefix, year, semester.  Example  cst 2024 Spring</h4>
                  <table className="Center">
                      <tbody>
                      <tr>
                          <td>Course Prefix:</td>
                          <td><input type="text" id="scourseId" name="courseId" value={search.courseId} onChange={editChange} /></td>
                      </tr>
                      <tr>
                          <td>Year:</td>
                          <td><input type="text" id="syear" name="year" value={search.year} onChange={editChange} /></td>
                      </tr>
                      <tr>
                          <td>Semester:</td>
                          <td><input type="text" id="ssemester" name="semester" value={search.semester} onChange={editChange} /></td>
                      </tr>
                      </tbody>
                  </table>
                  <br/>
                  <button type="submit" id="search" onClick={fetchSections} >Search for Schedules</button>
                  <br/>
                  <br/>
                  <table className="Center" >
                      <thead>
                      <tr>
                          {headers.map((schedule, idx) => (<th key={idx}>{schedule}</th>))}
                      </tr>
                      </thead>
                      <tbody>
                      {schedules.map((schedule) => (
                              <tr key={schedule.secNo}>
                              <td>{schedule.secNo}</td>
                              <td>{schedule.courseId}</td>
                              <td>{schedule.secId}</td>
                              <td>{schedule.year}</td>
                              <td>{schedule.semester}</td>
                              <td>{schedule.building}</td>
                              <td>{schedule.room}</td>
                              <td>{schedule.times}</td>
                              <td><Button onClick={() => onDelete(schedule.secNo)}> Drop </Button></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          );
      }


export default ScheduleView;