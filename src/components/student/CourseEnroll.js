import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';
import {confirmAlert} from "react-confirm-alert";
import {SERVER_URL} from '../../Constants';

// students displays a list of open sections for a 
// use the URL /sections/open
// the REST api returns a list of SectionDTO objects

// the student can select a section and enroll
// issue a POST with the URL /enrollments?secNo= &studentId=3  -RH this does not work. Tests in postman says method post not supported
//  is this supposed to be  @PostMapping("/enrollments/sections/{sectionNo}")
// using for now, checking with prof
// studentId=3 will be removed in assignment 7.



const CourseEnroll = (props) => {

    const studentId = 3 //until we implement login
    const [message, setMessage] = useState('');
    const headers = ['Section No', 'Semester', 'Course Id', 'Section Id', 'Room', 'Times', 'Instructor', 'Email', ''];
    const [oCourses, setOCourses] = useState([
        /** dummy data for testing leaving in case we need it again, maybe remove before final submission
         {secNo: 6, year: 2024,semester: "Spring",courseId: "cst338",secId: 1,building: "052",room: "100",times: "M W 10:00-11:50",instructorName: "joshua gross",instructorEmail: "jgross@csumb.edu"},
         {secNo: 7,year: 2024,semester:"Spring",courseId: "cst338",secId: 2,building: "052",room: "100",times: "M W 10:00-11:50",instructorName: "joshua gross",instructorEmail: "jgross@csumb.edu"},
         {secNo: 8, year: 2024,semester: "Spring", courseId: "cst363",secId: 1,building: "052",room: "104",times: "M W 10:00-11:50",instructorName: "david wisneski",instructorEmail: "dwisneski@csumb.edu"}*/
    ]);

    //function fetchOpenCourses sends get request to url to return a list of SectionDTOs of currently open courses. Takes no params or path variables.
    const fetchOpenCourses = async () => {
        try{
            const response = await fetch(`${SERVER_URL}/sections/open`);
            //check for ok response
            if (response.ok) {
                //wait for full return message
                const data = await response.json();
                //store returned data (list of SectionDTO objects) in oCourses array
                setOCourses(data);
            //if response.ok not received, display message that was received.
            } else {
                const json = await response.json();
                setMessage("response error: "+ json.message);
            }
        //otherwise display network error message
        } catch(err) {
            setMessage("network error"+err);
        }
    }

    //call fetchOpenCourses
    useEffect( () => {
        fetchOpenCourses();
    }, [] );

    //function enrollAlert receives event when user clicks on "ENROLL" displayed in row of listed class
    const enrollAlert = event => {
        const row_index = event.target.parentNode.parentNode.rowIndex-1;
        const selectedCourse = oCourses[row_index];
        const selectedCourseSecNo = oCourses[row_index].secNo;
        //display confirmation message until user confirms or cancels
        confirmAlert({
            title: 'Confirm to Enroll',
            message: 'Are you sure you want to enroll in:  Section ' + selectedCourse.secNo +' '+ selectedCourse.courseId.toUpperCase() +' '+ selectedCourse.semester +'?',
            buttons: [
                {
                    //if user clicks Enroll, call doEnroll to complete Enrollment
                    label: 'Enroll',
                    onClick: () => doEnroll(selectedCourseSecNo)
                },
                {
                    label: 'Cancel',
                }
            ]
        })
    }

    //function doEnroll sends post message to SpringBoot server to add enrollment for this student
     const doEnroll = async (selectedCourseSecNo) => {
        try {
            const response = await fetch(`${SERVER_URL}/enrollments/sections/${selectedCourseSecNo}?studentId=${studentId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                //display confirmation message student is now enrolled
                setMessage("You have enrolled in Section: " + selectedCourseSecNo /**+" "+ selectedCourse.courseId +" "+ selectedCourse.semester**/)
                fetchOpenCourses();
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }

        } catch(err) {
            setMessage("network error"+err);
        }
     }


    return (
        <>
            <h3>Open Courses</h3>

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
                            <td><Button onClick = {enrollAlert} >Enroll</Button></td>
                        </tr>

                    )}

                </tbody>
            </table>

            <h4>{message}</h4>

        </>
    );
}

export default CourseEnroll;