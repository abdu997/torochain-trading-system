import React from 'react';
import {Root} from './api-root';
import axios from 'axios';
import NoticeBox from './notice-box';

/**
 * Renders password reset page.
 *
 * @extends React
 */
class PasswordReset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordResetApi: Root("prito", 1) + 'account/api/v1/resetPassword',
      passwordRegEx: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/,
      passwordNotice: '',
      passwordToken: ''
    }
    this.passwordResetRequest = this.passwordResetRequest.bind(this);
  }

  /**
   * Contains a list of functions that will be called before render() is called.
   *
   */
  componentWillMount() {
    this.getToken();
  }

  /**
   * Parses the url and retrieves the password reset token param.
   *
   * @return {string} null
   */
  getToken() {
    const urlParams = new URLSearchParams(this.props.location.search);
    if(urlParams.get('token') === null) {
      this.passwordNotice({status: "error", message: "Token is invalid"});
      return null;
    }
    this.setState({passwordToken: urlParams.get('token')});
  }

  /**
   * Checks if a token exists, if it does not, an error NoticeBox is returned.
   * Validates if the new password matches the regex pattern, if not, an error
   * NoticeBox is returned. Validates if the new password matches the confirmed
   * new password, if not, an error NoticeBox is returned. If all conditions
   * are met, and API call is made with the old password and the new password.
   * If the call was successful, user is redirected to the login component.
   * Otherwise, an error NoticeBox is prompted.
   *
   * @param {event} e onClick event handler
   */
  passwordResetRequest(e) {
    e.preventDefault();
    if(this.getToken()) {
      return this.passwordNotice({status: "error", message: "Token is invalid"});
    }
    if(!this.state.passwordRegEx.test(this.newPassword.value)) {
      return this.passwordNotice(
        {
          status: "error",
          message: "Password must contain an uppercase, a lowercase, a number, one of '@ # $ % ^ & + =' and must be between 8 and 16 characters"
        }
      );
    }
    if(this.newPassword.value !== this.confirmNewPassword.value) {
      return this.passwordNotice({status: "error", message: "Passwords must match"});
    }
    axios.post(this.state.passwordResetApi, {
      new_password: this.confirmNewPassword.value,
      token: this.getToken(),
    }).then(
      response => {
        if(response.data[0].status === "success"){
          window.location.href = "/login";
        } else {
          this.passwordNotice({status: "error", message: response.data[0].message});
        }
      }
    ).catch(
      error => {
        this.passwordNotice({status: "error", message: error.message});
      }
    )
  }

  /**
   * Changes the passwordNotice state and calls passwordNoticeMessage().
   *
   * @param  {Object} message contains an array with the status of the notice and its message
   */
  passwordNotice(message) {
    this.setState({passwordNotice: message});
    this.passwordNoticeMessage();
  }

  /**
   * Checks if the passwordNoticeMessage state is defined, if it is, the notice array
   * is passed through NoticeBox and the element is returned.
   *
   * @return {string} NoticeBox element and its contents
   */
  passwordNoticeMessage() {
    if(this.state.passwordNotice) {
      return <NoticeBox Array={this.state.passwordNotice} />;
    }
  }

  /**
   * Renders the password reset form.
   *
   * @return {string} password form component
   */
  passwordForm() {
    return (
      <form id="passwordreset" onSubmit={this.passwordResetRequest}>
        <h5>Password Reset</h5>
        {this.passwordNoticeMessage()}
        <input ref={(input) => this.newPassword = input} type="password" placeholder="New Password" className="full-width no-capitalize" />
        <input ref={(input) => this.confirmNewPassword = input} type="password" placeholder="Confirm New Password" className="full-width no-capitalize" />
        <input type="submit" value="Reset" className="full-width" />
      </form>
    );
  }

  /**
   *
   *
   * @return {string} Password reset component
   */
  render() {
    if(this.state.passwordToken) {
      var innerComponent = this.passwordForm();
    } else {
      // eslint-disable-next-line
      var innerComponent = (
        <div id="passwordreset">
          {this.passwordNoticeMessage()}
        </div>
      );
    }
    return (
      <div className="container">
        <center>
          <img className="logo login-logo" alt="TORO logo" src="img/dark-hlogo.svg" />
        </center>
        {innerComponent}
      </div>
    );
  }
}
export default PasswordReset;
