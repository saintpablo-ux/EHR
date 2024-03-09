import React from "react";
import { Link } from "react-router-dom";
import "../style.css";
import logo from "../../src/Logo.png";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Employee from "./.cph/app";

class superAdmin extends React.Component {
  constructor(props) {
    super(props);
    // Initialize state
    this.state = {
      name: "",
      statename: ""
    };
  }

  render() {
    return (
      <div>
        {/* Navigation bar */}
        <nav className="navbar navbar-expand-sm bg-dark navbar-light">
          <div className="nav-item active" style={{ color: "black", fontWeight: "bolder" }}>
            <img src={logo} width="50px" height="50px" />
          </div>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to="/">
                <a className="nav-link" style={{ color: "white" }}>Home</a>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Main content */}
        <div className="container" style={{ padding: "10%" }}>
          <h3 className="text-center">Add a State Admin</h3>
          <br />
          <br />
          {/* Input for entering name */}
          <input className="form-control" placeholder="Enter Name..." onChange={(e) => { this.setState({ name: e.target.value }) }} />
          <br />
          <br />
          {/* Input for entering state */}
          <input className="form-control" placeholder="Enter State..." onChange={(e) => { this.setState({ statename: e.target.value }) }} />
          <br />
          {/* Component for adding a state admin */}
          <Employee
            data={{
              "name": this.state.name,
              "statename": this.state.statename
            }}
            from={"superAdmin"} />
        </div>
      </div>
    );
  }
}

export default superAdmin;
