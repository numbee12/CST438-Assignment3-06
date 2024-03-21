import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { SERVER_URL } from '../../Constants';

// instructor enters students' grades for an assignment
// fetch the grades using the URL /assignment/{id}/grades
// REST api returns a list of GradeDTO objects
// display the list as a table with columns 'gradeId', 'student name', 'student email', 'score' 
// score column is an input field 
//  <input type="text" name="score" value={g.score} onChange={onChange} />


const AssignmentGrade = (props) => {
    const [message, setMessage] = useState('');
    const headers = ['Grade ID', 'Student Name', 'Student Email', 'Score', ''];
    const [grades, setGrades] = useState([]);
    const [open, setOpen] = useState(false);

    const editOpen = () => {
        setMessage('');
        fetchGrades();
        setOpen(true);
    };

    const editClose = () => {
        setGrades([]);
        setMessage('');
        // props.onClose();
        setOpen(false);
    };

    const onChange = (event) => {
        const row_idx = event.target.parentNode.parentNode.rowIndex - 1;
        grades[row_idx].score = event.target.value;
        setGrades([...grades]);
    }
    const validScores = () => {
        return !grades.find(g => isNaN(g.score) || +g.score < 0);
    }
    const onSave = async () => {
        setMessage('');
        if (!validScores()) {
            console.log(grades);
            setMessage("Scores must be positive numbers");
            return;
        }
        try {
            const response = await fetch(`${SERVER_URL}/grades`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(grades)
            });
            if (response.ok) {
                setMessage("Grades saved");
            } else {
                const rc = await response.json();
                setMessage("response error: " + rc.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    }

    const fetchGrades = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments/${props.asgnmtId}/grades`);
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setGrades(data);

            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: " + err);
        }
    }

    return (
        <>
            <Button onClick={editOpen}>Grades</Button>
            <Dialog open={open} >
                <DialogTitle>Assignment Grades</DialogTitle>
                <DialogContent style={{ paddingTop: 20 }} >
                    <h4>{message}</h4>
                    <table className="Center" >
                        <thead>
                            <tr>
                                {headers.map((g, idx) => (<th key={idx}>{g}</th>))}
                            </tr>
                        </thead>
                        <tbody>
                            {grades.map((g, idx) => (
                                <tr key={g.gradeId}>
                                    <td>{g.gradeId}</td>
                                    <td>{g.studentName}</td>
                                    <td>{g.studentEmail}</td>
                                    <td><input type="text" name="score" value={g.score} onChange={onChange} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={editClose}>Close</Button>
                    <Button color="primary" onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>

        </>
    );
}

export default AssignmentGrade;