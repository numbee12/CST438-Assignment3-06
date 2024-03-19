import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const InstructorHome = () => {

    const [term, setTerm] = useState({ year: '', semester: '' });
    const [message, setMessage] = useState('');

    const onChange = (event) => {
        setTerm({ ...term, [event.target.name]: event.target.value });
    }

    const onClick = (e) => {
        let semesters = ['Spring', 'Fall', 'Summer', 'Winter'];
        if (term.year === '' || term.semester === '') {
            setMessage("Please enter a year and semester");
            e.preventDefault();
        }
        else if (!semesters.includes(term.semester)) {
            setMessage("Semester must be Spring, Fall, Summer, or Winter");
            e.preventDefault();
        } else if (/^\d+$/.test(term.year) === false) {
            setMessage("Year must be a number");
            e.preventDefault();
        }
    }

    return (
        <>
            <h4>{message}</h4>
            <table className="Center">
                <tbody>
                    <tr>
                        <td>Year:</td>
                        <td><input type="text" id="year" name="year" value={term.year} onChange={onChange} /></td>
                    </tr>
                    <tr>
                        <td>Semester:</td>
                        <td><input type="text" id="semester" name="semester" value={term.semester} onChange={onChange} /></td>
                    </tr>
                </tbody>
            </table>
            <Link to="/sections" state={{ term }} onClick={onClick}>Show Sections</Link>
        </>
    )
};

export default InstructorHome;
