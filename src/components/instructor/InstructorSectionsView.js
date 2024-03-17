import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { SERVER_URL } from '../../Constants';
import { Link } from 'react-router-dom';


// instructor views a list of sections they are teaching 
// use the URL /sections?email=dwisneski@csumb.edu&year= &semester=
// the email= will be removed in assignment 7 login security
// The REST api returns a list of SectionDTO objects
// The table of sections contains columns
//   section no, course id, section id, building, room, times and links to assignments and enrollments
// hint:  
// <Link to="/enrollments" state={section}>View Enrollments</Link>
// <Link to="/assignments" state={section}>View Assignments</Link>

const InstructorSectionsView = (props) => {
    const [sections, setSections] = useState([]);
    const [message, setMessage] = useState('');
    const location = useLocation();
    const { term } = location.state;
    // FIXME:
    // Hard coding INSTRUCTOR EMAIL for now
    const email = "dwisneski@csumb.edu";
    const headers = ['Section No', 'Course Id', 'Section Id', 'Building', 'Room', 'Times', 'Enrollments', 'Assignments'];

    const fetchSections = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/sections?email=${email}&year=${term.year}&semester=${term.semester}`);
            if (response.ok) {
                const data = await response.json();
                setSections(data);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    }
    useEffect(() => {
        console.log(term)
        fetchSections();
    }, []);

    return (
        <div>
            <h3>Sections</h3>
            <h4>{message}</h4>
            <table className="Center" >
                <thead>
                    <tr>
                        {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                    </tr>
                </thead>
                <tbody>
                    {sections.map((s) => (
                        <tr key={s.secNo}>
                            <td>{s.secNo}</td>
                            <td>{s.courseId}</td>
                            <td>{s.secId}</td>
                            <td>{s.building}</td>
                            <td>{s.room}</td>
                            <td>{s.times}</td>
                            <td><Link to="/Enrollments" state={ s }>Enrollments</Link></td>
                            <td><Link to="/Assignments" state={ s }>Assignments</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* FIXME: <SectionAdd  onClose={fetchSections} /> */}
        </div>

    );
}

export default InstructorSectionsView;

