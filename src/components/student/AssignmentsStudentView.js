import React, {useState} from 'react';


// student views a list of assignments and assignment grades 
// use the URL  /assignments?studentId= &year= &semester=
// The REST api returns a list of SectionDTO objects
// Use a value of studentId=3 for now. Until login is implemented in assignment 7.

// display a table with columns  Course Id, Assignment Title, Assignment DueDate, Score

const AssignmentsStudentView = (props) => {

    //dummy assignments and grades to test with
    //Course Id, Assignment Title, Assignment DueDate, Score
    const [assignments, setAssignment] = useState([
        { courseId: 'cst363' , title: 'Introduction to Database', dueDate: '2024-02-01', score: 90},
        { courseId: 'cst239' , title: 'Data Structures', dueDate: '2024-02-15', score: 95},
        { courseId: 'cst311' , title: 'Networking', dueDate: '2022-01-30', score: 70},
    ]);

    const headers = ['Course ID', 'Assignment Title', 'Assigment Due Date', 'Score'];

     
    return(
        <> 
            <h3>Assignments</h3>

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