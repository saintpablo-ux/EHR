import React from "react";
import { Link } from "react-router-dom";
import "../style.css";
import logo from "../../src/Logo.png";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

// Class component definition for Admin
class Admin extends React.Component {
  render() {
    return (
      <div>
        {/* Navigation bar */}
        <nav className="navbar navbar-expand-sm bg-dark navbar-light">
          <div className="nav-item active" style={{ color: "black", fontWeight: "bolder" }}>
            {/* Display logo */}
            <img src={logo} width="50px" height="50px" />
          </div>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              {/* Navigation link to home */}
              <Link to="/">
                <a className="nav-link" style={{ color: "white" }}>Home</a>
              </Link>
            </li>
          </ul>
        </nav>
        {/* Main container */}
        <div className="container" style={{ padding: "10%" }}>
          {/* Buttons to navigate to different sections */}
          <Link to="/admin/addDoctor">
            <button className="btn btn-success mx-5" onClick={null}>Add a Doctor</button>
          </Link>
          <Link to="/admin/addLab">
            <button className="btn btn-success mx-4" onClick={null}>Add a Lab Technician</button>
          </Link>
          <Link to="/admin/addReception">
            <button className="btn btn-success mx-5" onClick={null}>Add a Receptionist</button>
          </Link>
        </div>
      </div>
    );
  }
}

export default Admin;
