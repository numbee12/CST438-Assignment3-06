import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import AssignmentAdd from './AssignmentAdd';
import {SERVER_URL} from '../../Constants';
import {confirmAlert} from "react-confirm-alert";
import SectionUpdate from "../admin/SectionUpdate";
import Button from "@mui/material/Button";
import AssignmentUpdate from "./AssignmentUpdate";
import AssignmentGrade from './AssignmentGrade';

// instructor views assignments for their section
// use location to get the section value 
// 
// GET assignments using the URL /sections/{secNo}/assignments
// returns a list of AssignmentDTOs
// display a table with columns 
// assignment id, title, dueDate and buttons to grade, edit, delete each assignment

const AssignmentsView = (props) => {
    const headers = ['Id', 'Title', 'Due Date', 'Course Id', 'Sec Id', 'Sec No', '', ''];
    const [asgnmts, setAsgnmts] = useState([]);
    const [message, setMessage] = useState('');

    const location = useLocation();
    const { secNo, courseId, secId } = location.state;

    const fetchAsgnmts = async () => {
        try{
            const response = await fetch(`${SERVER_URL}/sections/${secNo}/assignments`);
            if (response.ok){
                const asgnmts = await response.json();
                setAsgnmts(asgnmts);
            } else {
                const json = await response.json();
                setMessage("response error: "+ json.message);
            }
        } catch (err) {
            setMessage("network error: "+ err);
        }
    }

    useEffect( () => {
        fetchAsgnmts();
    }, []);

    const deleteAsgnmt = async (id) => {
        try {
            const response = await fetch (`${SERVER_URL}/assignments/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            if (response.ok) {
                setMessage("Assignment deleted");
                fetchAsgnmts();
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    const onDelete = (e) => {
        const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
        const id = asgnmts[row_idx].id;
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Do you really want to delete?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => deleteAsgnmt(id)
                },
                {
                    label: 'No',
                }
            ]
        });
    }

    const handleAddSuccess = () => {
        setMessage("Assignment successfully added");
    };

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
                                <td>{a.courseId}</td>
                                <td>{a.secId}</td>
                                <td>{a.secNo}</td>
                                <td><AssignmentUpdate asgnmts={a} onClose={fetchAsgnmts} /></td>
                                <td><Button onClick={onDelete}>Delete</Button></td>
                                <td><AssignmentGrade asgnmtId={a.id} /></td>
                            </tr>
                        ))
                        }
                    </tbody>
                </table>
                <AssignmentAdd secNo={secNo} courseId={courseId} secId={secId} onAddSuccess={handleAddSuccess} onClose={fetchAsgnmts} />
            </div>
        </>
    );
 }

export default AssignmentsView;
