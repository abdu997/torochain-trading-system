import React from 'react';
import {Root} from './api-root';
import axios from 'axios';
import countries from './countries.json';
import NoticeBox from './notice-box';

/**
 * This class renders the login page, that inlcudes the registration and login forms,
 * includes the forgot password and MFA authentication form.
 *
 * @extends React
 */
class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginApi: Root("prito", 1) + 'account/api/v1/login',
      registerApi: Root("prito", 1) + 'account/api/v1/registration',
      mfaApi: Root("prito", 1) + 'account/api/v1/loginConfirm',
      forgotPasswordApi: Root("prito", 1) + 'account/api/v1/forgotPassword',
      registerView: 'RegisterForm',
      loginView: 'LoginForm',
      country: 'country',
      registerNotice: '',
      loginNotice: '',
      passwordRegEx: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/,
    }
    this.registerRequest = this.registerRequest.bind(this);
    this.loginRequest = this.loginRequest.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.forgotPasswordRequest = this.forgotPasswordRequest.bind(this);
    this.mfaRequest = this.mfaRequest.bind(this);
    this.countryChange = this.countryChange.bind(this);
  }

  /**
   * Contains a list of functions that will be called before render() is called.
   *
   */
  componentWillMount() {
    this.registerView();
    this.loginView();
  }

  /**
   * Contains a list of functions that will be called after render() is called.
   *
   */
  componentDidMount() {
    this.referralCodeValue();
  }

  /**
   * Decodes the URL and extracts the referralCode parameter and it's value,
   * disables the referral code input field and place the value of the referralCode
   * param into the referral code input.
   *
   */
  referralCodeValue() {
    const urlParams = new URLSearchParams(this.props.location.search);
    if(urlParams.get('referralCode') !== null) {
      this.referralCodeRegister.disabled = true;
      this.referralCodeRegister.value = urlParams.get('referralCode');
    }
  }

  /**
   * Change the state value of 'country' when the country dropdown changes it's value.
   *
   * @param  {event} e onChange event handler on the Country field toggle
   */
  countryChange(e) {
    this.setState({country: e.target.value});
   }

  /**
   * Validates register form inputs, and returns the a NoticeBox that contains
   * an error message if a condition is not met. If all conditions are met,
   * and an API call is made. If the API call was successful the registration form
   * is replaced with a NoticeBox that contains a success message. However, if
   * the call was not a success, a NoticeBox conataing the serverside error or
   * call error will be prompted over the registratin form.
   *
   * @param  {event} e onSubmit event handler triggered on the registration form
   * @return {string} registerNotice NoticeBox element
   */
  registerRequest(e) {
    e.preventDefault();
    if(this.firstNameRegister.value.length === 0){
      return this.registerNotice({status: "error", message: "First Name cannot be empty"});
    }
    if(this.lastNameRegister.value.length === 0){
      return this.registerNotice({status: "error", message: "Last Name cannot be empty"});
    }
    if(this.usernameRegister.value.length === 0){
      return this.registerNotice({status: "error", message: "Username cannot be empty"});
    }
    if(/[@]/.test(this.usernameRegister.value)){
      return this.registerNotice({status: "error", message: "Username cannot contain '@'"});
    }
    if(this.state.country === "country"){
      return this.registerNotice({status: "error", message: "You need to pick your country"});
    }
    if(this.stateRegister.value.length === 0){
      return this.registerNotice({status: "error", message: "You need to provide your state"});
    }
    if(this.emailRegister.value.length === 0){
      return this.registerNotice({status: "error", message: "Email must be valid"});
    }
    if(!this.state.passwordRegEx.test(this.passwordRegister.value)){
      return this.registerNotice(
        {
          status: "error",
          message: "Password must contain an uppercase, a lowercase, a number, one of '@ # $ % ^ & + =' and must be between 8 and 16 characters"
        }
      );
    }
    if(this.confirmPasswordRegister.value !== this.passwordRegister.value){
      return this.registerNotice({status: "error", message: "Passwords must match"});
    }
    if(!this.usResidentRegister.checked){
      return this.registerNotice({status: "error", message: "You cannot be a citizen or tax resident of the U.S."});
    }
    axios.post(this.state.registerApi,
      {
        first_name: this.firstNameRegister.value,
        last_name: this.lastNameRegister.value,
        username: this.usernameRegister.value,
        country: this.state.country,
        state: this.stateRegister.value,
        email: this.emailRegister.value,
        password: this.confirmPasswordRegister.value,
        usCitizen: !this.usResidentRegister.checked,
        newsletter: this.mailingListRegister.checked,
        referral_code: this.referralCodeRegister.value,
      }
    ).then(response => {
      if(response.data[0].status === "success") {
        this.setState({registerView: 'RegisterSuccess'});
        this.setState({registerNotice: ''});
      }
      if(response.data[0].status === "error") {
        this.registerNotice({status: "error", message: response.data[0].message});
      }
    }).catch(error => {
      this.registerNotice({status: "error", message: error.message});
    })
  }

  /**
   * Changes the registerNotice state and calls registerNoticeMessage().
   *
   * @param  {Object} message contains an array with the status of the notice and its message
   */
  registerNotice(message) {
    this.setState({registerNotice: message});
    this.registerNoticeMessage();
  }

  /**
   * Checks if the registerNotice state is defined, if it is, the notice array
   * is passed through NoticeBox and the element is returned.
   *
   * @return {string} NoticeBox element and its contents
   */
  registerNoticeMessage() {
    if(this.state.registerNotice) {
      return <NoticeBox Array={this.state.registerNotice} />;
    }
  }

  /**
   * Loops through the arrays in countries.json and prints an option element.
   *
   * @return {string} the option elements for the country select input field
   */
  countriesOptions() {
    return countries.map(
      country => <option key={country.code} value={country.code}>{country.name}</option>
    );
  }

  /**
   * Returns the registration form
   *
   * @return {string} Registraion form element
   */
  registerForm() {
    return (
      <form id="registrationForm" onSubmit={this.registerRequest}>
        <p>Registration Form</p>
        {this.registerNoticeMessage()}
        <input ref={(input) => this.firstNameRegister = input} type="text" placeholder="First Name" className="half-width" />
        <input ref={(input) => this.lastNameRegister = input} type="text" placeholder="Last Name" className="half-width" />
        <input ref={(input) => this.usernameRegister = input} type="text" placeholder="Username" className="full-width no-capitalize" />
        <div className="location-dropdown">
          <select value={this.state.country} onChange={this.countryChange}  className="half-width login-select">
            <option>country</option>
            {this.countriesOptions()}
          </select>
          <input type="text" placeholder="State/Province" ref={(input) => this.stateRegister = input} className="half-width" />
        </div>
        <input ref={(input) => this.emailRegister = input} type="email" placeholder="Email" className="full-width no-capitalize" />
        <input ref={(input) => this.passwordRegister = input} type="password" placeholder="Password" className="half-width no-capitalize" />
        <input ref={(input) => this.confirmPasswordRegister = input} type="password" placeholder="Confirm Password" className="half-width no-capitalize" />
        <label className="checkbox-field">
          <p>I am not a citizen or tax resident of the United States</p>
          <input ref={(input) => this.usResidentRegister = input} type="checkbox" />
          <span className="checkmark"></span>
        </label>
        <label className="checkbox-field">
          <p>I agree to get announcements and updates via e-mail</p>
          <input ref={(input) => this.mailingListRegister = input} type="checkbox" />
          <span className="checkmark"></span>
        </label>
        {/* <input ref={(input) => this.referralCodeRegister = input}  type="text" placeholder="Referral Code" className="full-width no-capitalize" /> */}
        <center>
          <div data-theme="dark" className="g-recaptcha" data-sitekey="6Le5lVoUAAAAAPKpyGnyvDQegy46tBFgQb1TIArd"></div>
        </center>
        <input type="submit" value="Register" className="full-width" />
      </form>
    )
  }

  /**
   * Checks the value of the registerView state and renders the appropriate element.
   *
   * @return {string} the element that we would like to appear in the registerView()
   */
  registerView() {
    if(this.state.registerView === "RegisterForm") {
      return this.registerForm();
    }
    if(this.state.registerView === "RegisterSuccess") {
      return this.registerSuccess();
    }
  }

  /**
   * Returns the success message to registerView() in a NoticeBox
   *
   * @return {string} NoticeBox element
   */
  registerSuccess() {
    return (
      <NoticeBox
        Array={
          {
            status: "success",
            message: "Thank you for registering! Please check your email for your confirmation link."}
          }
      />
    )
  }

  /**
   * Validate login form input fields, if conditions are not met or if the api
   * call returns an error, an error NoticeBox
   * is rendered. However, if the api call was a success and the mfa value is
   * "email", the loginView state is changed to the login2fa element. If the mfa
   * value was null, the client is redirected to the buytokens page.
   *
   * @param  {event} e login form onSubmit
   * @return {string}   NoticeBoxes
   */
  loginRequest(e) {
    e.preventDefault();
    if(this.emailLogin.value.length === 0){
      return this.loginNotice({status: "error", message: "Please provide your email / username"});
    }
    if(this.passwordLogin.value.length === 0) {
      return this.loginNotice({status: "error", message: "Please provide your password"});
    }
    axios.post(this.state.loginApi,
      {
        username: this.emailLogin.value,
        password: this.passwordLogin.value,
      }
    ).then(response => {
      if(response.data[0].status === "success") {
        this.emailLogin.value = "";
        if(response.data[0].mfa === "email") {
          this.setState({loginView: 'login2FA'});
          this.setState({loginNotice: ''});
        } else {
          window.location.href = '/buytoken';
        }
      }
      if(response.data[0].status === "error") {
        this.loginNotice({status: "error", message: response.data[0].message});
      }
    }).catch(error => {
      this.loginNotice({status: "error", message: error.message});
    });
  }

  /**
   * Clears loginNotice to remove existing NoticeBoxes and replaces the loginView
   * state to swap the login form with the forgot password form.
   *
   * @param  {event} e onClick on the forgot password link
   */
  forgotPassword(e) {
    e.preventDefault();
    this.setState({loginNotice: ""});
    return this.setState({loginView: 'loginForgotPasswordForm'});
  }

  /**
   * Checks the value of the loginView from the state, and renders the appropriate
   * object in the place of the loginView
   *
   * @return {string} the element to be placed in loginView
   */
  loginView() {
    if(this.state.loginView === "LoginForm") {
      return this.loginForm();
    }
    if(this.state.loginView === "login2FA") {
      return this.login2FA();
    }
    if(this.state.loginView === "loginForgotPasswordForm") {
      return this.loginForgotPasswordForm();
    }
    if(this.state.loginView === "forgotPasswordSuccess") {
      return this.forgotPasswordSuccess();
    }
  }

  /**
   * Returns the login form object
   *
   * @return {string} login form
   */
  loginForm() {
    return (
      <div>
        <form id="loginForm" onSubmit={this.loginRequest}>
          <p>Login Form</p>
          {this.loginNoticeMessage()}
          <input ref={(input) => this.emailLogin = input} placeholder="Email / Username" className="full-width no-capitalize" />
          <input ref={(input) => this.passwordLogin = input} type="password" placeholder="Password" className="full-width" />
          <center>
            <div data-theme="dark" className="g-recaptcha" data-sitekey="6Le5lVoUAAAAAPKpyGnyvDQegy46tBFgQb1TIArd"></div>
          </center>
          <input type="submit" value="Login" className="full-width" />
        </form>
        <a href="" onClick={this.forgotPassword}>Forgot Password?</a>
      </div>
    )
  }

  /**
   * Changes the loginNotice state and calls loginNoticeMessage().
   *
   * @param  {Object} message contains an array with the status of the notice and its message
   */
  loginNotice(message) {;
    this.setState({loginNotice: message});
    this.loginNoticeMessage();
  }

  /**
   * Checks if the loginNotice state is defined, if it is, the notice array
   * is passed through NoticeBox and the element is returned.
   *
   * @return {string} NoticeBox element
   */
  loginNoticeMessage() {
    if(this.state.loginNotice) {
      return <NoticeBox Array={this.state.loginNotice} />;
    }
  }

  /**
   * Validate mfa form input fields, if conditions are not met or if the api
   * call returns an error, an error NoticeBox
   * is rendered. However, if the api call was a success the user will get
   * redirected to the dashboard
   *
   * @param  {event} e onSubmit fromt the mfa form
   * @return {string}  NoticeBox element
   */
  mfaRequest(e) {
    e.preventDefault();
    if(this.mfaCode.value.length === 0) {
      return this.loginNotice("Please provide your 2FA code");
    }
    axios.post(this.state.mfaApi,
      {
        mfa_code: this.mfaCode.value,
      }
    ).then(response => {
      if(response.data[0].status === "success") {
        window.location.href = '/dashboard';
      }
      if(response.data[0].status === "error") {
        this.loginNotice(response.data[0].message);
      }
    }).catch(error => {
      this.loginNotice(error.message);
    });
  }

  /**
   * Returns the MFA form
   *
   * @return {string} mfa form
   */
  login2FA() {
    return(
      <form id="mfaForm" onSubmit={this.mfaRequest}>
        <p>Login 2FA</p>
        {this.loginNoticeMessage()}
        <input ref={(code) => this.mfaCode = code} type="text" placeholder="2FA Code" className="full-width mfa-input" />
        <input type="submit" value="Submit Code" className="full-width" />
      </form>
    )
  }

  /**
   * Returns the forgot password form
   *
   * @return {string} forgot password form
   */
  loginForgotPasswordForm() {
    return(
      <form id="loginForgotPasswordForm" onSubmit={this.forgotPasswordRequest}>
        <p>Password Reset</p>
        {this.loginNoticeMessage()}
        <input ref={(input) => this.accountForgotPassword = input} type="text" placeholder="Email / Username" className="full-width no-capitalize" />
        <input type="submit" value="Submit" className="full-width" />
      </form>
    )
  }

  /**
   * Makes the forgot password api call after validating the inputs, if the calls
   * returned an error or was unsuccessful, a NoticeBox would be prompted over
   * the form.
   *
   * @param  {event} e onSubmit from the forgot password form
   * @return {string}   NoticeBox
   */
  forgotPasswordRequest(e) {
    e.preventDefault();
    if(this.accountForgotPassword.value.length === 0) {
      return this.loginNotice({status: "error", message: "Please provide your username / password"});
    }
    axios.post(this.state.forgotPasswordApi, {
      username: this.accountForgotPassword.value
    }).then(
      response => {
        if(response.data[0].status === "success") {
          this.setState({loginView: "forgotPasswordSuccess"});
        } else {
          this.loginNotice({status: "error", message: response.data[0].message});
        }
      }
    ).catch(
      error => {
        this.loginNotice({status: "error", message: error.message});
      }
    );
  }

  /**
   * Is called to render the NoticeBox after a successful forgotPasswordRequest()
   *
   * @return {string} NoticeBox
   */
  forgotPasswordSuccess() {
    return (
      <NoticeBox Array={
        {status: "success", message: "If there is an account tied to this username/email, an email will be sent with a reset link"}} />
    )
  }

  /**
   * Renders the elements for the login page. What is returned in this lifecycle
   * function, will be returned when this class is invoked in other areas of the
   * app.
   *
   * @return {string} login page element
   */
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <center>
              <img className="logo login-logo" alt="TORO logo" src="img/dark-hlogo.svg" />
            </center>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 loginForm">
            <div className="form">
              <h3 className="form-header">Login</h3>
              {this.loginView()}
            </div>
          </div>
          <div className="col-md-6">
            <div className="form">
              <h3 className="form-header">Registration</h3>
              {this.registerView()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default LoginPage;
