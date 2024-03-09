import React from "react";
import { Link } from "react-router-dom";
import "../style.css";
import logo from "../../src/Logo.png";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Web3 from 'web3';
import { Healthcare } from "./js/Healthcare";
import axios from 'axios';
const FileSaver = require('file-saver');

// Class component definition for loginPatient
class loginPatient extends React.Component {

  // Lifecycle method to load Web3 and blockchain data
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  // Function to load Web3
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  // Function to load blockchain data
  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const contract = new web3.eth.Contract(Healthcare, "0x59DC1D9E052764b06AF5c6e527A0f9d92e97f1bf");
    this.setState({ contract });

    const len = await this.state.contract.methods.recordPatCount().call({ from: this.state.account });
    console.log(len);
    var i;
    var name;
    var data = [];

    for (i = len - 1; i >= 0; i--) {
      var temp = {};
      const details = await this.state.contract.methods.recordPatDetails(i).call({ from: this.state.account });
      console.log(details);
      if (details[2] === "doctor") {
        name = await this.state.contract.methods.returnDocName(details[3]).call({ from: this.state.account });
        console.log(name);
      } else {
        name = await this.state.contract.methods.returnLabName(details[3]).call({ from: this.state.account });
        console.log(name);
      }
      temp = {
        "record": details[0],
        "address": details[3],
        "name": name,
        "role": details[2],
        "timestamp": details[1],
      };
      data.push(temp);
    }
    this.setState({ data: data });
    console.log(data);
  }

  // Constructor to initialize state
  constructor(props) {
    super(props);

    this.state = {
      patientHash: '',
      contract: null,
      web3: null,
      account: null,
      data: [],
    };
  }

  // Function to download file from IPFS
  async downloadFile(hash, name) {
    console.log("download");
    const encryptedKey = await this.state.contract.methods.retrieveKey(hash).call({ from: this.state.account });
    console.log(encryptedKey);

    if (encryptedKey === "") {
      alert('Sorry, you are not permitted for this record');
    } else {
      try {
        const response = await axios.get("https://red-tiny-crab-570.mypinata.cloud/ipfs/" + hash + "?pinataGatewayToken=6JPYIe7ri1O52nkePDAlMKeneyMNvtZ3myh-rar0uLFZ4Li_PA586_OtSbuGbKmm");

        const blob = new Blob([response.data], { type: "application/octet-stream" });
        FileSaver.saveAs(blob, `report${name}.txt`); // Set desired filename here
      } catch (error) {
        console.error("Error downloading file:", error);
        alert("Error downloading file. Please try again later.");
      }
    }
  }

  render() {
    // Mapping data to table rows
    const detail = this.state.data.map(x =>
      <tr>
        <td><a href={"https:red-tiny-crab-570.mypinata.cloud/ipfs/" + x.record + "?pinataGatewayToken=6JPYIe7ri1O52nkePDAlMKeneyMNvtZ3myh-rar0uLFZ4Li_PA586_OtSbuGbKmm"} target='_blank'>{x.record}</a></td>
        <td>{x.address}</td>
        <td>{x.name}</td>
        <td>{x.role}</td>
        <td>{x.timestamp}</td>
        <td>
          <Link to={{ pathname: '/revoke', state: { recRevoke: x.record } }}>
            <button type="button" className="btn btn-danger btn-sm" onClick={null}>
              Revoke
            </button>
          </Link>
        </td>
        <td>
          <Link to={{ pathname: '/permit', state: { recRevoke: x.record } }}>
            <button id='permit' type="button" className="btn btn-success btn-sm" data-toggle="modal" data-target="#permitModal" onClick={null}>
              Permit
            </button>
          </Link>
        </td>
      </tr>
    );

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
        {/* Table to display patient records */}
        <div className="container-fluid" style={{ padding: '25px !important' }}>
          <br />
          <br />
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th>Records</th>
                <th>Address</th>
                <th>Name</th>
                <th>Role</th>
                <th>Timestamp</th>
                <th>Revoke</th>
                <th>Permit</th>
              </tr>
            </thead>
            <tbody>
              {detail}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default loginPatient;
