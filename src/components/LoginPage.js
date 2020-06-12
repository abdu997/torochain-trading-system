import React from 'react';
import axios from 'axios';

import { Api } from './../utilities/api';
import NoticeBox from './../utilities/NoticeBox';

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
      loginRequestLoaded: true,
      loginView: 'LoginForm',
      loginNotice: '',
    }
    this.loginRequest = this.loginRequest.bind(this);
  }

  /**
   * Contains a list of functions that will be called before render() is called.
   *
   */
  componentWillMount() {
    this.loginView();
  }

  /**
   * Validate login form input fields, if conditions are not met or if the api
   * call returns an error, an error NoticeBox is rendered. However, if the api
   * call was a success and the mfa value is "email", the loginView state is
   * changed to the login2fa element. If the mfa value was null, the client is
   * redirected to the buytokens page.
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
    this.loginNotice(null);
    this.setState({loginRequestLoaded: false});
    axios.post(Api("tts", 1, "login"),
      {
        username: this.emailLogin.value,
        password: this.passwordLogin.value,
      }
    ).then(response => {
      this.setState({loginRequestLoaded: true});
      if(response.data.status === "success") {
        this.emailLogin.value = "";
        window.location.href = '/portfolio';
      } else if(response.data.status === "error") {
        this.loginNotice({status: "error", message: response.data.message});
      }
    }).catch(error => {
      this.setState({loginRequestLoaded: true});
      this.loginNotice({status: "error", message: error.message});
    });
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
  }

  /**
   * Returns the login form object
   *
   * @return {string} login form
   */
  loginForm() {
    return (
      <form id="loginForm" onSubmit={this.loginRequest}>
        <NoticeBox Message={this.state.loginNoticeMessage} />
        <input ref={(input) => this.emailLogin = input} placeholder="Email / Username" className="full-width no-capitalize" />
        <input ref={(input) => this.passwordLogin = input} type="password" placeholder="Password" className="full-width" />
        <button type="submit" className="full-width">
          {!this.state.loginRequestLoaded ? <i className='fa fa-spinner fa-spin submit-loader'></i> : ""}
          Login
        </button>
      </form>
    )
  }

  /**
   * Message array becomes the new value of the NoticeMessage state.
   *
   * @param  {object} message Notice message array.
   */
  loginNotice(message) {
    this.setState({loginNoticeMessage: message});
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
              <img className="logo login-logo" alt="TORO logo" src={window.location.origin + "/img/dark-hlogo.svg"} />
            </center>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
              <div className="form login-form">
                {this.loginView()}
              </div>
          </div>
        </div>
      </div>
    );
  }
}
export default LoginPage;
