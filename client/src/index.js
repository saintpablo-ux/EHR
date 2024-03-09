import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, Link, BrowserRouter } from "react-router-dom";
import { Switch } from "react-router";
import "./style.css";
import logo from "./Logo.png";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import loginDoctor from "./components/loginDoctor.js";
import addPatient from "./components/addPatient.js";
import addReception from "./components/addReception.js";
import addLab from "./components/addLab.js";
import addDoctor from "./components/addDoctor.js";
import Admin from "./components/Admin.js";
import superAdmin from "./components/superAdmin.js";
import stateAdmin from "./components/addStateAdmin.js";
import loginTechnician from "./components/loginTechnician.js";
import revoke from "./components/revoke.js";
import permit from "./components/permit.js";
import loginPatient from "./components/loginPatient.js";
import Web3 from 'web3';
import { Healthcare } from "./components/js/Healthcare.js";

class Application extends React.Component {
  async componentWillMount() {
    console.log("in component will mount");
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    console.log("inweb3");
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const contract = new web3.eth.Contract(Healthcare, "0x59DC1D9E052764b06AF5c6e527A0f9d92e97f1bf");
    this.setState({ contract });

    var account = await web3.eth.getAccounts();
    var fromAcc = account.toString();
  }

  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      contract: null,
      account: null,
      buffer: null,
    };
  }

  async loginDoc() {
    console.log("hi");
    console.log(await this.state.contract.methods.verifyDoctor(this.state.account));
    const flag = await this.state.contract.methods.verifyDoctor(this.state.account).call();
    if (flag == true)
      return this.props.history.push('/doctor');
    else
      alert('You are not a registered doctor on this platform');
  }

  async loginPat() {
    const flag = await this.state.contract.methods.verifyPatient(this.state.account).call();
    if (flag == true)
      return this.props.history.push('/patient');
    else
      alert('You are not a registered patient on this platform');
  }

  async loginLab() {
    const flag = await this.state.contract.methods.verifyTechnician(this.state.account).call();
    if (flag == true)
      return this.props.history.push('/technician');
    else
      alert('You are not a registered lab technician on this platform');
  }

  async loginSuper() {
    console.log("hiii");
    const flag = await this.state.contract.methods.verifySuper(this.state.account).call();
    if (flag == true)
      return this.props.history.push('/superadmin');
    else
      alert('You are not the super admin on this platform');
  }

  async loginState() {
    const flag = await this.state.contract.methods.verifyStateAdmin(this.state.account).call();
    if (flag == true)
      return this.props.history.push('/stateadmin');
    else
      alert('You are not a registered state admin on this platform');
  }

  async loginAdmin() {
    const flag = await this.state.contract.methods.verifyAdmin(this.state.account).call();
    if (flag == true)
      return this.props.history.push('/admin');
    else
      alert('You are not a registered hospital admin on this platform');
  }

  async loginRecep() {
    const flag = await this.state.contract.methods.verifyReceptionist(this.state.account).call();
    if (flag == true)
      return this.props.history.push('/reception/addpatient');
    else
      alert('You are not a registered receptionist in this platform');
  }

  redirect = () => {
    window.location.href = 'http://localhost:5000/hss';
    // maybe can add spinner while loading
    return null;
  }

  render() {
    return (
      <div id='patient' className="App">
        <div className="bg-light text-dark">
          <nav className="navbar navbar-expand-sm bg-dark navbar-light">
            <div className="nav-item active" style={{ color: "black", fontWeight: "bolder" }}>
              <img src={logo} width="50px" height="50px" />
            </div>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to="/">
                  <a className="nav-link" style={{ color: "white" }}>Home</a>
                </Link>
                <Link to="/">
                  <a className="nav-link" style={{ color: "white" }}>About</a>
                </Link>
                <Link to="/">
                  <a className="nav-link" style={{ color: "white" }}></a>
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" style={{ color: "white" }} href='http://localhost:5000/hss'></a>
              </li>
            </ul>
          </nav>
          <div className='Header'>
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <header className="text-center">
              <h1>Electronic Health Record using Blockchain</h1>
            </header>
            <br /><br /><br /><br /><br />
          </div>
          <div className="row text-center my-5" style={{ paddingBottom: "1%" }}>
            <div className="col-md-4">
              <button type="button" className="btn btn-success hover-effect" onClick={() => this.loginDoc()}>
                Doctor
              </button>
            </div>
            <div className="col-md-4">
              <button type="button" className="btn btn-success hover-effect" onClick={() => this.loginPat()}>
                Patient
              </button>
            </div>
            <div className="col-md-4">
              <button type="button" className="btn btn-success hover-effect" onClick={() => this.loginLab()}>
                Lab Technician
              </button>
            </div>
          </div>
          <div className="row text-center my-5" style={{ paddingBottom: "1%" }}>
            <div className="col-md-12 my-5 text-center" style={{ marginLeft: '300px !important' }}>
              <button type="button" className="btn btn-success hover-effect" onClick={() => this.loginRecep()}>
                Receptionist
              </button>
            </div>
          </div>
          <div className="row text-center my-5" style={{ paddingBottom: "10%" }}>
            <div className="col-md-4">
              <button type="button" className="btn btn-success hover-effect" onClick={() => this.loginSuper()}>
                Super Admin
              </button>
            </div>
            <div className="col-md-4">
              <button type="button" className="btn btn-success hover-effect" onClick={() => this.loginState()}>
                State Admin
              </button>
            </div>
            <div className="col-md-4">
              <button type="button" className="btn btn-success hover-effect" onClick={() => this.loginAdmin()}>
                Hospital Admin
              </button>
            </div>
          </div>
        </div>
        <div className="footer-clean" style={{ color: "white", backgroundColor: "#2e5666", fontWeight: "500", padding: "5%" }}></div>
      </div>
    );
  }
}

export default Application;

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Application} />
      <Route exact path="/doctor" component={loginDoctor} />
      <Route exact path="/patient" component={loginPatient} />
      <Route exact path="/revoke" component={revoke} />
      <Route exact path="/permit" component={permit} />
      <Route exact path="/technician" component={loginTechnician} />
      <Route exact path="/superadmin" component={superAdmin} />
      <Route exact path="/stateadmin" component={stateAdmin} />
      <Route exact path="/admin" component={Admin} />
      <Route exact path="/admin/adddoctor" component={addDoctor} />
      <Route exact path="/admin/addlab" component={addLab} />
      <Route exact path="/admin/addreception" component={addReception} />
      <Route exact path="/reception/addpatient" component={addPatient} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
