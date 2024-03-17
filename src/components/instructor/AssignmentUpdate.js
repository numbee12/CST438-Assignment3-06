import React, { useState } from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import {SERVER_URL} from "../../Constants";

//  instructor updates assignment title, dueDate 
//  use an mui Dialog
//  issue PUT to URL  /assignments with updated assignment

const AssignmentUpdate = (props)  => {
  const [open, setOpen] = useState(false);
  const [editMessage, setEditMessage] = useState('');
  const [assignment, setAssignment] = useState(
      {id: '', title: '', dueDate: '', secId: '', secNo: ''});

  const editOpen = (event) => {
    setOpen(true);
    setEditMessage('');
    setAssignment(props.asgnmts);
  };

  const editClose = () => {
    setOpen(false);
    setAssignment({id: '', title: '', dueDate: '', secId: '', secNo: ''});

  };

  const editChange = (event) => {
    setAssignment({...assignment,  [event.target.name]:event.target.value})
  }

  const onSave = () => {
    saveSection(assignment);
  }

  const saveSection = async (assignment) => {
    try {
      const response = await fetch (`${SERVER_URL}/assignments`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(assignment),
          });
      if (response.ok) {
        setEditMessage("section saved");
        editClose();
      } else {
        const rc = await response.json();
        setEditMessage(rc.message);
      }
    } catch (err) {
      setEditMessage("network error: "+err);
    }
  }
    return (
        <>
          <Button onClick={editOpen}>Edit</Button>
          <Dialog open={open} >
            <DialogTitle>Edit Assignments</DialogTitle>
            <DialogContent  style={{paddingTop: 20}} >
              <h4>{editMessage}</h4>
              <TextField style={{padding:10}} autoFocus fullWidth label="id" name="id" value={assignment.id}  InputProps={{readOnly: true, }}  />
              <TextField style={{padding:10}} fullWidth label="title" name="title" value={assignment.title} onChange={editChange}  />
              <TextField style={{padding:10}} fullWidth label="dueDate" name="dueDate" value={assignment.dueDate} onChange={editChange}  />
            </DialogContent>
            <DialogActions>
              <Button color="secondary" onClick={editClose}>Close</Button>
              <Button color="primary" onClick={onSave}>Save</Button>
            </DialogActions>
          </Dialog>
        </>
    )
}

export default AssignmentUpdate;
