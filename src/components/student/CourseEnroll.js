import React, {useState, useEffect} from 'react';

// students displays a list of open sections for a 
// use the URL /sections/open
// the REST api returns a list of SectionDTO objects

// the student can select a section and enroll
// issue a POST with the URL /enrollments?secNo= &studentId=3
// studentId=3 will be removed in assignment 7.

const CourseEnroll = (props) => {
const [message, setMessage] = useState('*layout displaying dummy info, no functionality yet*');
const headers = ['Section No', 'Semester', 'Course Id', 'Section Id', 'Room', 'Times', 'Instructor', 'Email', ''];


    const [oCourses, setOCourses] = useState([

        {
            secNo: 6,
            year: 2024,
            semester: "Spring",
            courseId: "cst338",
            secId: 1,
            building: "052",
            room: "100",
            times: "M W 10:00-11:50",
            instructorName: "joshua gross",
            instructorEmail: "jgross@csumb.edu"
        },
        {
            secNo: 7,
            year: 2024,
            semester:"Spring",
            courseId: "cst338",
            secId: 2,
            building: "052",
            room: "100",
            times: "M W 10:00-11:50",
            instructorName: "joshua gross",
            instructorEmail: "jgross@csumb.edu"
        },
        {
            secNo: 8,
            year: 2024,
            semester: "Spring",
            courseId: "cst363",
            secId: 1,
            building: "052",
            room: "104",
            times: "M W 10:00-11:50",
            instructorName: "david wisneski",
            instructorEmail: "dwisneski@csumb.edu"
        }
    ]);


    return (
        <>
            <h3>Open Courses</h3>
            <h4>{message}</h4>
            <table className="Center">
                <thead>
                    <tr>
                        {headers.map((h,idx) => <th key={idx}>{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {oCourses.map((oCourse) =>
                        <tr key = {oCourse.secNo}>
                            <td>{oCourse.secNo}</td>
                            <td>{oCourse.semester}</td>
                            <td>{oCourse.courseId}</td>
                            <td>{oCourse.secId}</td>
                            <td>{oCourse.room}</td>
                            <td>{oCourse.times}</td>
                            <td>{oCourse.instructorName}</td>
                            <td>{oCourse.instructorEmail}</td>
                            <td>Enroll</td>
                        </tr>
                    )}

                </tbody>

            </table>
        </>
    );
}

export default CourseEnroll;