import React, {useState, useEffect} from 'react';
import {SERVER_URL} from '../../Constants';


// student views a list of assignments and assignment grades 
// use the URL  /assignments?studentId= &year= &semester=
// The REST api returns a list of SectionDTO objects
// Use a value of studentId=3 for now. Until login is implemented in assignment 7.

// display a table with columns  Course Id, Assignment Title, Assignment DueDate, Score

const AssignmentsStudentView = (props) => {

    //dummy assignments and grades to test with
    //Course Id, Assignment Title, Assignment DueDate, Score
    const [assignments, setAssignment] = useState([
        //dummy data for testing
        // { courseId: 'cst363' , title: 'Introduction to Database', dueDate: '2024-02-01', score: 90},
        // { courseId: 'cst239' , title: 'Data Structures', dueDate: '2024-02-15', score: 95},
        // { courseId: 'cst311' , title: 'Networking', dueDate: '2022-01-30', score: 70},
    ]);
    const [message, setMessage] = useState('');
    const headers = ['Course ID', 'Assignment Title', 'Assigment Due Date', 'Score'];
    //const [search, setSearch] = useState({studentId: 3 , year: 2024 , semester:'Spring'});  //uncomment this for testing then switch back
    const [search, setSearch] = useState({studentId:'', year:''}); //comment this for testing then switch back

    const fetchAssignments = async () => {
        if (search.studentId === '' || search.year === '') {
            setMessage("Enter search parameters");
        } else {
            try {
                const response = await fetch(`${SERVER_URL}/assignments?studentId=${search.studentId}&year=${search.year}&semester=${search.semester}`);
                if (response.ok) {
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

    useEffect(() => {
        fetchAssignments();
    }, [] );


    return(
        <> 
            <h3>Assignments</h3>
            <h4>{message}</h4>
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