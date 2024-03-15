import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import AssignmentAdd from './AssignmentAdd';

// instructor views assignments for their section
// use location to get the section value 
// 
// GET assignments using the URL /sections/{secNo}/assignments
// returns a list of AssignmentDTOs
// display a table with columns 
// assignment id, title, dueDate and buttons to grade, edit, delete each assignment

const AssignmentsView = (props) => {
    const [asgnmts, setAsgnmts] = useState([]);
    const [message, setMessage] = useState('');
    const headers = ['Id', 'Title', 'Due Date', 'Sec Id', 'Sec No', '', ''];


    const location = useLocation();
    const { secNo, courseId, secId } = location.state;

    const fetchAssgnmts = (secNo) => {
        // TODO: get the assignments
    }

    const addAssignment = (asgnmt) => {
        // TODO: post the assignment to the backend

        // Fixme: remove this code.
        // This is just for testing
        // Until backend is hooked up
        // then we will use fetchAssgnmts
        setAsgnmts([...asgnmts, asgnmt]);
        // fetchAssgnmts(secNo);

        console.log("assignments!!!!", asgnmts)
    }

    return (
        <>
            <div>
                <h3>Assignments</h3>
                <h4>{message}</h4>
                <table className="Center" >
                    <thead>
                        <tr>
                            {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                        </tr>
                    </thead>
                    <tbody>
                        {asgnmts.map((a) => (
                            <tr key={a.id}>
                                <td>{a.id}</td>
                                <td>{a.title}</td>
                                <td>{a.dueDate}</td>
                                <td>{a.secId}</td>
                                <td>{a.secNo}</td>
                            </tr>
                        ))
                        }
                    </tbody>
                </table>
                <AssignmentAdd save={addAssignment} />
            </div>
        </>
    );
}

export default AssignmentsView;
