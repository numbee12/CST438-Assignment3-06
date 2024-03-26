import React, {useState, useEffect} from 'react';
import {SERVER_URL} from '../../Constants';
// students gets a list of all courses taken and grades
// use the URL /transcript?studentId=
// the REST api returns a list of EnrollmentDTO objects
// the table should have columns for
//  Year, Semester, CourseId, SectionId, Title, Credits, Grade

const Transcript = () => {
    const [transcriptData, setTranscriptData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const studentId = "3"


        const fetchTranscriptData = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/transcripts?studentId=3`);
            if (!response.ok) {
                throw new Error('Failed to fetch transcript data');
            }
            const data = await response.json();
            setTranscriptData(data);
            console.log(data.length);
            setLoading(false);
        } catch (error) {
                setError(error.message);
                setLoading(false);
           }
        };
        useEffect(() => {
        fetchTranscriptData();
    }, []);



    return(
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div>

                <h3>Student Transcript</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Semester</th>
                            <th>CourseId</th>
                            <th>SectionId</th>
                            <th>Title</th>
                            <th>Credits</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transcriptData.map((enrollment, index) => (
                            <tr key={index}>
                                <td>{enrollment.year}</td>
                                <td>{enrollment.semester}</td>
                                <td>{enrollment.courseId}</td>
                                <td>{enrollment.sectionId}</td>
                                <td>{enrollment.title}</td>
                                <td>{enrollment.credits}</td>
                                <td>{enrollment.grade}</td>
                            </tr>

                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default Transcript;