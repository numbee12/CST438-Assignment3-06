import React from 'react';
import { Outlet, Link } from "react-router-dom";

export const InstructorLayout = () => {

  return (
    <>
      <nav>
        <Link to="/">Home</Link>&nbsp;|&nbsp;
      </nav>
      <h1>Instructor Home</h1>
      Manage assignments and grades.


      <Outlet />
    </>
  )
};

export default InstructorLayout;


