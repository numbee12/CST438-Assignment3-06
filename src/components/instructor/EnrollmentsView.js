
import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {SERVER_URL} from '../../Constants';

//// instructor view list of students enrolled in a section
//// use location to get section no passed from InstructorSectionsView
//// fetch the enrollments using URL /sections/{secNo}/enrollments
//// display table with columns
////   'enrollment id', 'student id', 'name', 'email', 'grade'
////  grade column is an input field
////  hint:  <input type="text" name="grade" value={e.grade} onChange={onGradeChange} />

const EnrollmentsView = (props) => {
    const [enrollments, setEnrollments] = useState([]);
    const [message, setMessage] = useState('');
    const headers = ['EnrollmentId', 'StudentId', 'Name', 'Email', 'Grade'];


    const location = useLocation();

    const {secNo, courseId, secId} = location.state;


  //  const {secNo} = location.state;

    useEffect(() => {
        fetchEnrollments(secNo);
    }, [secNo]);


    const fetchEnrollments = async (secNo) => {
        try {
                    const response = await fetch(`${SERVER_URL}/sections/${secNo}/enrollments`);
                    if (response.ok) {
                      const data = await response.json();
                      setEnrollments(data);
                    } else {
                      const rc = await response.json();
                      setMessage(rc.message);
                    }
                  } catch(err) {
                    setMessage("network error: "+err);
                  }
                }
                const onGradeChange = (event, enrollmentId) => {
                    const newGrade = event.target.value;
                    console.log(`New grade enrollment ${enrollmentId}: ${newGrade}`);
                }



                return (
                    <>
                        <div>
                            <h3>Enrollments</h3>
                            <h4>{message}</h4>
                            <table className="Center" >
                                <thead>
                                    <tr>
                                        {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {enrollments.map((enrollment) => (
                                        <tr key={enrollment.enrollmentId}>
                                            <td>{enrollment.enrollmentId}</td>
                                            <td>{enrollment.studentId}</td>
                                            <td>{enrollment.name}</td>
                                            <td>{enrollment.email}</td>
                                            <td>
                                                <input
                                                    type="text"
                                                    name="grade"
                                                    value={enrollment.grade}
                                                    onChange={(event) => onGradeChange(event, enrollment.enrollmentId)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>

                        </div>
                    </>
                );
            }

export default EnrollmentsView;



