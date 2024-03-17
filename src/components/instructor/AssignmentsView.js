import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import AssignmentAdd from './AssignmentAdd';
import {SERVER_URL} from '../../Constants';
import {confirmAlert} from "react-confirm-alert";
import SectionUpdate from "../admin/SectionUpdate";
import Button from "@mui/material/Button";
import AssignmentUpdate from "./AssignmentUpdate";

// instructor views assignments for their section
// use location to get the section value 
// 
// GET assignments using the URL /sections/{secNo}/assignments
// returns a list of AssignmentDTOs
// display a table with columns 
// assignment id, title, dueDate and buttons to grade, edit, delete each assignment

const AssignmentsView = (props) => {
    const headers = ['Id', 'Title', 'Due Date', 'Course Id', 'Sec Id', 'Sec No', '', ''];
    const [asgnmts, setAsgnmts] = useState([
        //dummy data for testing
        // { id: 1, title: "db homework 1", dueDate: "2024-02-01", courseId: "cst363", secId: 1, secNo: 8},
        // { id: 2, title: "db homework 2", dueDate: "2024-02-15", courseId: "cst363", secId: 1, secNo: 8}
    ]);
    const [message, setMessage] = useState('');
    const [search, setSearch] = useState({id: '', title: '', dueDate: '', secId: '', secNo: ''});

    const location = useLocation();
    const { secNo } = location.state;

    const fetchAsgnmts = async () => {
        // TODO: get the assignments
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

    const gradeAsgnmt = async (asgnmt) => {
        try {
            const response = await fetch(`${SERVER_URL}/grades`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(asgnmt),
                });
            if (response.ok) {
                setMessage("Grade Saved")
                fetchAsgnmts();
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }

    const editChange = (event) => {
        setSearch({...search,  [event.target.name]:event.target.value});
    }
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
                                <td><AssignmentUpdate asgnmts={a} onClose={gradeAsgnmt()} /></td>
                                <td><Button onClick={onDelete}>Delete</Button></td>
                            </tr>
                        ))
                        }
                    </tbody>
                </table>
                {/*<AssignmentAdd save={addAssignment} />*/}
            </div>
        </>
    );
 }

export default AssignmentsView;
