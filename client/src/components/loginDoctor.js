import React from "react";
import { Link } from "react-router-dom";
import "../style.css";
import logo from "../../src/Logo.png";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Employee from "./.cph/app";
import Web3 from 'web3';
import { Healthcare } from "./js/Healthcare.js";
import ipfs from './js/ipfs';
import axios from 'axios';
const FileSaver = require('file-saver');

// Class component definition for loginDoctor
class loginDoctor extends React.Component {

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
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const contract = new web3.eth.Contract(Healthcare, "0x59DC1D9E052764b06AF5c6e527A0f9d92e97f1bf");
    this.setState({ contract });

    console.log(accounts)
    var account = this.state.account;
    var fromAcc = account.toString();

    //Calling smart contract
    //Function for Uploaded Records
    var data = [];
    const len = await this.state.contract.methods.recordDocCount().call({ from: fromAcc });
    for (var i = len - 1; i >= 0; i--) {
      const details = await this.state.contract.methods.recordDocDetails(i).call({ from: fromAcc });

      var temp = {};
      const patName = await this.state.contract.methods.returnPatName(details[2]).call({ from: fromAcc });
      temp = { "ipfsLink": details[0], "timestamp": details[1], "patientAddress": details[2], "patientName": patName }
      data.push(temp);
    }

    this.setState({ data: data });
    console.log(data);

    //Function for Permitted Records
    var pdata = [];
    const plen = await this.state.contract.methods.recordPDocCount().call({ from: fromAcc });
    for (var i = plen - 1; i >= 0; i--) {
      const details = await this.state.contract.methods.recordPDocDetails(i).call({ from: fromAcc });
      const isPermit = await this.state.contract.methods.retrieveKey(details[0]).call({ from: fromAcc });
      if (isPermit != "") {
        var temp = {};
        const patName = await this.state.contract.methods.returnPatName(details[1]).call({ from: fromAcc });
        temp = { "ipfsLink": details[0], "patientAddress": details[1], "patientName": patName }
        pdata.push(temp);
      }
    }
    this.setState({ pdata: pdata });
    console.log(pdata);
  }

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pdata: [],
      web3: null,
      contract: null,
      account: null,
      buffer: null,
      file: null
    }
  }

  // Function to capture file uploaded by the user
  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]

    this.setState({ file: file })

    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
    }
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
        const response = await axios.get("https://red-tiny-crab-570.mypinata.cloud/ipfs/" + hash + "?pinataGatewayToken=6JPYIe7ri1O52nkePDAlMKeneyMNvtZ3myh-rar0uLFZ4Li_PA586_OtSbuGbKmm", {
          responseType: 'blob' // Ensure response is treated as a Blob
        });

        // Extract the MIME type from the response headers
        const contentType = response.headers['content-type'];
        const mimeArray = contentType.split('/');
        const fileType = mimeArray[mimeArray.length - 1]; // Extracting the last part which represents the file type

        const blob = new Blob([response.data], { type: contentType });
        FileSaver.saveAs(blob, `report${name}.${fileType}`); // Set desired filename here with the correct extension
      } catch (error) {
        console.error("Error downloading file:", error);
        alert("Error downloading file. Please try again later.");
      }
    }
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
                <a className="nav-link" style={{ color: "white" }}>
                  Home
                </a>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 wrapper">
              <div id="formContent" style={{ padding: "5%" }}>
                <h3>Doctor's Login</h3>
                <hr />
                <div>
                  <label>
                    Upload the Report:
                    <input type="file" onChange={this.captureFile} />
                  </label>

                  <br />
                  <br />
                  <Employee
                    data={this.state.buffer}
                    from={"doc"}
                    file={this.state.file} />
                </div>
              </div>
            </div>

            <div className="col-md-12 ml-auto mr-5 my-5 wrapper">
              <h3>You have uploaded these...</h3>
              <hr />
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th>Patient's Name</th>
                    <th>Patient's Address</th>
                    <th>Timestamp</th>
                    <th>IPFS link </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.map(x =>
                    <tr>
                      <td>{x.patientName}</td>
                      <td>{x.patientAddress}</td>
                      <td>{x.timestamp}</td>
                      <td><a className="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong" onClick={() => this.downloadFile(x.ipfsLink, x.patientName)} target="_blank">{x.ipfsLink}</a></td>
                    </tr>)}
                </tbody>
              </table>
            </div>

            <div className="modal fade" id="exampleModalLong" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="modal-body-report" id="modalReport">
                    <span id="reportContent">...</span>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-success" data-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 ml-auto mr-5 my-5 wrapper">
              <h3>You can view these...</h3>
              <hr />
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th>Patient's Name</th>
                    <th>Patient's Address</th>
                    <th>IPFS link </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.pdata.map(x =>
                    <tr>
                      <td>{x.patientName}</td>
                      <td>{x.patientAddress}</td>
                      <td><a href={"https://red-tiny-crab-570.mypinata.cloud/ipfs/" + x.ipfsLink + "?pinataGatewayToken=6JPYIe7ri1O52nkePDAlMKeneyMNvtZ3myh-rar0uLFZ4Li_PA586_OtSbuGbKmm"} target='_blank'>{x.ipfsLink}</a></td>
                    </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default loginDoctor;
