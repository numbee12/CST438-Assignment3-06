import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { SERVER_URL } from '../../Constants';

// complete the code.  
// instructor adds an assignment to a section
// use mui Dialog with assignment fields Title and DueDate
// issue a POST using URL /assignments to add the assignment

const AssignmentAdd = (props) => {

    const [open, setOpen] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const [asgnmt, setAsgnmt] = useState({
        title: '', dueDate: ''
    });

    const editOpen = () => {
        setEditMessage('');
        setAsgnmt({ title: '', dueDate: '' });
        setOpen(true);
    };

    const editClose = () => {
        setAsgnmt({ title: '', dueDate: '' });
        setEditMessage('');
        props.onClose();
        setOpen(false);
    };

    const editChange = (event) => {
        setAsgnmt({ ...asgnmt, [event.target.name]: event.target.value })
    }

    const onSave = () => {
        if (asgnmt.title === '') {
            setEditMessage("Title can not be blank");
            return;
        }
        const dueDate = Date.parse(asgnmt.dueDate);
        if (isNaN(dueDate)) {
            setEditMessage("Due Date must be a valid date");
            return;
        }
        const now = Date.now();
        if (dueDate < now) {
            setEditMessage("Date must be in the future");
            return;
        }
        addAsgnmt();
    }

    const addAsgnmt = async () => {
        const newAsgnmt = {
            title: asgnmt.title,
            dueDate: asgnmt.dueDate,
            courseId: props.courseId, // is course Id needed?
            secId: props.secId,
            secNo: props.secNo
        }
        try {
            const response = await fetch(`${SERVER_URL}/assignments`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newAsgnmt),
                });
            if (response.ok) {
                const res = await response.json();
                setEditMessage("Assignment successfully added id=" + res.id);
            } else {
                const res = await response.json();
                setEditMessage(res.message);
            }
        } catch (err) {
            setEditMessage("network error: " + err);
        }
    }

    return (
        <>
            <Button onClick={editOpen}>Add Assignment</Button>
            <Dialog open={open} >
                <DialogTitle>Add Assignment</DialogTitle>
                <DialogContent style={{ paddingTop: 20 }} >
                    <h4>{editMessage}</h4>
                    <TextField style={{ padding: 10 }}
                        fullWidth
                        label="Title"
                        name="title"
                        value={asgnmt.title}
                        onChange={editChange} />
                    <TextField style={{ padding: 10 }}
                        fullWidth
                        label="Due Date"
                        name="dueDate"
                        placeholder='YYYY-MM-DD'
                        value={asgnmt.dueDate}
                        onChange={editChange} />
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={editClose}>Close</Button>
                    <Button color="primary" onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default AssignmentAdd;
