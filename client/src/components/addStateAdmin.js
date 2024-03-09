import React from "react";
import { Link } from "react-router-dom";
import "../style.css";
import logo from "../../src/Logo.png"
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Employee from "./.cph/app";
import Web3 from 'web3';
import { Healthcare } from "./js/Healthcare.js";

// Class component definition for stateAdmin
class stateAdmin extends React.Component {
  constructor(props) {
    super(props);
    // Initializing state
    this.state = {
      details: [],
      name: "",
      hospital: "",
      web3: null,
      contract: null,
      account: null,
    }
  }

  // Lifecycle method to load Web3 and blockchain data
  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  // Function to load Web3
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  // Function to load blockchain data
  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    // Initialize contract
    const contract = new web3.eth.Contract(Healthcare, "0x59DC1D9E052764b06AF5c6e527A0f9d92e97f1bf");
    this.setState({ contract })

    // Get current account
    var account = await web3.eth.getAccounts()
    console.log(account)
    var fromAcc = account[0].toString();

    // Call smart contract method
    const details = await this.state.contract.methods.hosAdminForState().call({ from: fromAcc });
    this.setState({ details: details });
  }

  // Render method to render the component
  render() {
    return (
      <div>
        <div>
          {/* Navigation bar */}
          <nav className="navbar navbar-expand-sm bg-dark navbar-light">
            <div
              className="nav-item active"
              style={{ color: "black", fontWeight: "bolder" }}
            >
              {/* Display logo */}
              <img src={logo} width="50px" height="50px" />
            </div>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                {/* Navigation link to home */}
                <Link to="/">
                  <a className="nav-link" style={{ color: "white" }}>
                    Home
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
          {/* Main container */}
          <div className="container" style={{ padding: "10%" }}>
            {/* Title */}
            <h3 className="text-center">Add a Hospital Admin</h3>
            <br />
            {/* Input field for entering name */}
            <input className="form-control" placeholder="Enter Name..." onChange={(e) => { this.setState({ name: e.target.value }) }} />
            <br />
            {/* Input field for entering hospital */}
            <input className="form-control" placeholder="Enter Hospital..." onChange={(e) => { this.setState({ hospital: e.target.value }) }} />
            <br />
            {/* Render Employee component */}
            <Employee
              data={{
                "name": this.state.name,
                "hospital": this.state.hospital
              }}
              from={"stateAdmin"} />
          </div>
        </div>
        {/* Table to display admin details */}
        <div className="col-md-12 ml-auto mr-5 my-5 wrapper">
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th>Admin's Address</th>
                <th>Admin's Name</th>
                <th>Hospital's Name</th>
              </tr>
            </thead>
            <tbody>
              {/* Map through details and display */}
              {this.state.details.map(x =>
                <tr>
                  <td>{x.hosAdmin}</td>
                  <td>{x.name}</td>
                  <td>{x.hospital}</td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

// Export the stateAdmin component
export default stateAdmin;
