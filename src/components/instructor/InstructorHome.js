import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InstructorHome = () => {
    const [term, setTerm] = useState({ year: '', semester: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const onChange = (event) => {
        setTerm({ ...term, [event.target.name]: event.target.value });
    }

    const handleShowSections = () => {
        if (term.year.trim() === '' || term.semester.trim() === '') {
            setMessage('Please enter both year and semester.');
        } else {
            setMessage('');
            navigate('/sections', { state: { term } });
        }
    }

    return (
        <>
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
            <h4>{message}</h4>
            <button onClick={handleShowSections}>Show Sections</button>
        </>
    )
};

export default InstructorHome;





