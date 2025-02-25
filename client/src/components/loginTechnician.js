import React from "react";
import { Link } from "react-router-dom";
import "../style.css";
import logo from "../../src/Logo.png";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Employee from "./.cph/app";
import Web3 from 'web3';
import { Healthcare } from "./js/Healthcare";
import axios from 'axios';
const FileSaver = require('file-saver');

class loginTechnician extends React.Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

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

  async loadBlockchainData() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const contract = new web3.eth.Contract(Healthcare, "0x59DC1D9E052764b06AF5c6e527A0f9d92e97f1bf");
    this.setState({ contract });

    var account = this.state.account;
    var fromAcc = account.toString();

    // Fetching lab records
    var data = [];
    const len = await this.state.contract.methods.recordLabCount().call({ from: fromAcc });
    for (var i = len - 1; i >= 0; i--) {
      const details = await this.state.contract.methods.recordLabDetails(i).call({ from: fromAcc });
      var temp = {};
      const patName = await this.state.contract.methods.returnPatName(details[2]).call({ from: fromAcc });
      temp = { "ipfsLink": details[0], "timestamp": details[1], "patientAddress": details[2], "patientName": patName };
      data.push(temp);
    }
    this.setState({ data: data });

    // Fetching permitted lab records
    var pdata = [];
    const plen = await this.state.contract.methods.recordPLabCount().call({ from: fromAcc });
    for (var i = plen - 1; i >= 0; i--) {
      const details = await this.state.contract.methods.recordPLabDetails(i).call({ from: fromAcc });
      const isPermit = await this.state.contract.methods.retrieveKey(details[0]).call({ from: fromAcc });
      if (isPermit !== "") {
        var temp = {};
        const patName = await this.state.contract.methods.returnPatName(details[1]).call({ from: fromAcc });
        temp = { "ipfsLink": details[0], "patientAddress": details[1], "patientName": patName };
        pdata.push(temp);
      }
    }
    this.setState({ pdata: pdata });
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
    };
  }

  // Function to capture uploaded file
  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    this.setState({ file: file });
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
    };
  };

  // Function to download files
  async downloadFile(hash, name) {
    console.log("download");
    const encryptedKey = await this.state.contract.methods.retrieveKey(hash).call({ from: this.state.account });
    if (encryptedKey === "") {
      alert('Sorry, you are not permitted for this record');
    } else {
      try {
        const response = await axios.get("https://red-tiny-crab-570.mypinata.cloud/ipfs/" + hash + "?pinataGatewayToken=6JPYIe7ri1O52nkePDAlMKeneyMNvtZ3myh-rar0uLFZ4Li_PA586_OtSbuGbKmm", {
          responseType: 'blob'
        });
        const contentType = response.headers['content-type'];
        const mimeArray = contentType.split('/');
        const fileType = mimeArray[mimeArray.length - 1];
        const blob = new Blob([response.data], { type: contentType });
        FileSaver.saveAs(blob, `report${name}.${fileType}`);
      } catch (error) {
        console.error("Error downloading file:", error);
        alert("Error downloading file. Please try again later.");
      }
    }
  }

  render() {
    return (
      <div>
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
        <div className="container">
          <div className="row">
            <div className="col-md-12 wrapper">
              <div id="formContent" style={{ padding: "5%" }}>
                <h3>Lab Technician</h3>
                <hr />
                <div>
                  <label>
                    Upload the Report:
                    <input type="file" onChange={this.captureFile} />
                  </label>
                  <br /><br />
                  <Employee
                    data={this.state.buffer}
                    from={"doc"}
                    file={this.state.file}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-12 my-5 ml-auto mr-5 wrapper">
              <h3>You have uploaded these...</h3>
              <hr />
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th>Patient's Name</th>
                    <th>Patient's Address</th>
                    <th>Timestamp</th>
                    <th>IPFS link</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.data.map(x =>
                    <tr key={x.ipfsLink}>
                      <td>{x.patientName}</td>
                      <td>{x.patientAddress}</td>
                      <td>{x.timestamp}</td>
                      <td><a onClick={() => this.downloadFile(x.ipfsLink, x.patientName)} target='_blank'>{x.ipfsLink}</a></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <br />
            <div className="col-md-12 ml-auto mr-5 my-5 wrapper">
              <h3>You can view these...</h3>
              <hr />
              <table className="table">
                <thead className="thead-dark">
                  <tr>
                    <th>Patient's Name</th>
                    <th>Patient's Address</th>
                    <th>IPFS link</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.pdata.map(x =>
                    <tr key={x.ipfsLink}>
                      <td>{x.patientName}</td>
                      <td>{x.patientAddress}</td>
                      <td><a href={"https://red-tiny-crab-570.mypinata.cloud/ipfs/" + x.ipfsLink + "?pinataGatewayToken=6JPYIe7ri1O52nkePDAlMKeneyMNvtZ3myh-rar0uLFZ4Li_PA586_OtSbuGbKmm"} target='_blank'>{x.ipfsLink}</a></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default loginTechnician;
