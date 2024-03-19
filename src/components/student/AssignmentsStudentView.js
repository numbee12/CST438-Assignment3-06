import React, {useState, useEffect} from 'react';
import {SERVER_URL} from '../../Constants';

// student views a list of assignments and assignment grades
// use the URL  /assignments?studentId= &year= &semester=
// The REST api returns a list of SectionDTO objects
// Use a value of studentId=3 for now. Until login is implemented in assignment 7.

// display a table with columns  Course Id, Assignment Title, Assignment DueDate, Score

const AssignmentsStudentView = (props) => {

    const studentId = 3     //until we implement login
    const headers = ['Course', 'Assignment', 'Due Date', 'Score'];
    const [assignments, setAssignment] = useState([
        //dummy data for testing
        // { courseId: 'cst363' , title: 'Introduction to Database', dueDate: '2024-02-01', score: 90},
        // { courseId: 'cst239' , title: 'Data Structures', dueDate: '2024-02-15', score: 95},
        // { courseId: 'cst311' , title: 'Networking', dueDate: '2022-01-30', score: 70},
    ]);
    const [message, setMessage] = useState('');
    const [search, setSearch] = useState({studentId: studentId , year: '' , semester: ''});

    //function fetchAssignments sends get request to url to return a list of AssignmentDTOs of student's current assignments. Request Params studentId, year, semester.
    const fetchAssignments = async () => {
        let semesters = ['Spring', 'Fall', 'Summer', 'Winter'];
        setMessage('');
        //check parameter values are present
        if (search.studentId === '' || search.year === '' || search.semester === '') {
            setMessage("Enter search parameters");
        } else if (!semesters.includes(search.semester)) {
            setMessage("Semester must be Spring, Fall, Summer, or Winter");
        } else if (/\d+/.test(search.year) === false) {
            setMessage("Year must be a number");
        } else {
            try {
                //if all params are present, send fetch request to URL
                const response = await fetch(`${SERVER_URL}/assignments?studentId=${search.studentId}&year=${search.year}&semester=${search.semester}`);
                if (response.ok) {
                    //receive returned DTOs and set them as the Assignments
                    const data = await response.json();
                    setAssignment(data);
                } else {
                    const rc = await response.json();
                    setMessage(rc.message);
                }
            } catch(err){
                setMessage("network error: " +err);
            }
        }
    }

    const editChange = (event) => {
        setSearch({...search,  [event.target.name]:event.target.value});
    }

    return(
        <> 
            <h3>Assignments</h3>

            <h4>{message}</h4>
            <h4>Enter year and semester for Assignments you wish to retrieve:</h4>

            <table className="Center">
                <tbody>
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
            <button type="submit" id="search" onClick={fetchAssignments} >Search for Assignments</button>
            <br/>
            <br/>
            <table className="Center">
                <thead>
                    <tr>
                        {headers.map((h,idx) => <th key={idx}>{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {assignments.map((assignment) =>
                        <tr key={assignment.courseId}>
                            <td>{assignment.courseId}</td>
                            <td>{assignment.title}</td>
                            <td>{assignment.dueDate}</td>
                            <td>{assignment.score}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </>
    );
}

export default AssignmentsStudentView;