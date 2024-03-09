import React from "react";
import { Link } from "react-router-dom";
import "../style.css";
import logo from "../../src/Logo.png"
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Employee from "./.cph/app"


// Class component definition for adding a Patient
class addPatient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ""
    }
  }

  // Render method to render the component
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-sm bg-dark navbar-light">
          <div
            className="nav-item active"
            style={{ color: "black", fontWeight: "bolder" }}
          >
            <img src={logo} width="50px" height="50px" />
          </div>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/">
                <a className="nav-link" style={{ color: "white" }}>
                  Home
                </a>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="container" style={{ padding: "10%" }}>
          <h3 className="text-center">Add a Patient</h3>
          <br />
          <input className="form-control" placeholder="Enter Patient's Name" onChange={(e) => { this.setState({ name: e.target.value }) }} />
          <br />
          <Employee
            data={this.state.name}
            from={"recepPat"} />
        </div>
      </div>
    );
  }
}

export default addPatient;