
import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {SERVER_URL} from '../../Constants';
import Button from '@mui/material/Button';

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
    }, []);

    const onGradeChange = (event) => {
        const row_idx = event.target.parentNode.parentNode.rowIndex - 1;
        enrollments[row_idx].grade = event.target.value;
        setEnrollments([...enrollments]);
    }

    const validateGrade = () => {
        setMessage('');
        const gradeTable = [
            '+A', '+B', '+C', '+D', '+F', 
            '-A', '-B', '-C', '-D', '-F',
            'A', 'B', 'C', 'D', 'F'
        ];
        for (const e of enrollments) {
            if (!gradeTable.includes(e.grade)) {
                setMessage("Invalid grade: "+e.grade);
                return false;
            }
        }
        return true;
    }

    const putGrades = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollments`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enrollments),
            });
            if (response.ok) {
                setMessage("Enrollments saved");
                fetchEnrollments(secNo);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    const onSave = () => {
        if (validateGrade()) {
            putGrades();
        }
    }

    const fetchEnrollments = async (secNo) => {
        try {
                    const response = await fetch(`${SERVER_URL}/sections/${secNo}/enrollments`);
                    if (response.ok) {
                      const data = await response.json();
                      console.log(data)
                      setEnrollments(data);
                    } else {
                      const rc = await response.json();
                      setMessage(rc.message);
                    }
                  } catch(err) {
                    setMessage("network error: "+err);
                  }
                }

                return (
                    <>
                        <div>
                            <h3>Enrollments</h3>
                            <h4 id="enrollmentsMessage">{message}</h4>
                            <table id="enrollmentsTable" className="Center" >
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
                                                    onChange={onGradeChange}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>
                            <Button id="saveGrades" onClick={onSave}>Save Grades</Button>
                        </div>
                    </>
                );
            }

export default EnrollmentsView;



