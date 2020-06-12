import React from 'react';
import {Root} from './api-root';
import axios from 'axios';
import Nav from './page-wrapper';
import countries from './countries.json';
import NoticeBox from './notice-box';

/**
 * This class renders the My Profile page, which includes the Account details
 * view and edit, MFA settings veiw and edit and the change password form.
 *
 * @extends React
 */
class MyProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailsNoticeMessage: '',
      mfaNoticeMessage: '',
      passwordNoticeMessage: '',
      loginHistoryNoticeMessage: '',
      accountDetailsApi: Root("prito", 1) + 'account/api/v1/getFullProfile',
      accountDetailsRequestApi: Root("prito", 1) + 'account/api/v1/updateProfile',
      changeMfaApi: Root("prito", 1) + 'account/api/v1/updateMfa',
      changePasswordApi: Root("prito", 1) + 'account/api/v1/updatePassword',
      loginHistoryApi: '###',
      accountDetailsArray: [
        {
         first_name: 'John',
         last_name: 'Doe',
         country: 'ca',
         state: 'Ontario',
         postal: 'A1A 1A1',
         email: 'john@doe.ca',
         notify_login: true,
        }
      ],
      selectedMfa: 'email',
      loginHistoryArray: [],
    }
    this.accountDetailsRequest = this.accountDetailsRequest.bind(this);
    this.getAccountDetails = this.getAccountDetails.bind(this);
    this.changeMfaValue = this.changeMfaValue.bind(this);
    this.changeMfaRequest = this.changeMfaRequest.bind(this);
    this.changePasswordRequest = this.changePasswordRequest.bind(this);
  }

  /**
   * Contains a list of functions that will be called after render() is called.
   *
   */
  componentDidMount() {
    // this.getAccountDetails();
    this.firstName.value = this.state.accountDetailsArray[0].first_name;
    this.lastName.value = this.state.accountDetailsArray[0].last_name;
    this.country.value = this.state.accountDetailsArray[0].country;
    this.provinceState.value = this.state.accountDetailsArray[0].state;
    this.postal.value = this.state.accountDetailsArray[0].postal;
    this.email.value = this.state.accountDetailsArray[0].email;
    this.notifyLogin.checked = this.state.accountDetailsArray[0].notify_login;
    this.newsletterSignup.checked = this.state.accountDetailsArray[0].newsletter;
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
   * Makes a GET API call to retreive the account details. If successful,
   * teh account details will be inserted into the accountDetailsArray state,
   * and into the input fields that correspond to them. If the call was not
   * successful, a NoticeBox will be prompted.
   *
   * @return {string} NoticeBox
   */
  getAccountDetails() {
    axios.get(this.state.accountDetailsApi).then(
      response => {
        this.setState({accountDetailsArray: response.data});
        this.setState({selectedMfa: this.state.accountDetailsArray[0].mfa});
        this.firstName.value = this.state.accountDetailsArray[0].first_name;
        this.lastName.value = this.state.accountDetailsArray[0].last_name;
        this.country.value = this.state.accountDetailsArray[0].country;
        this.provinceState.value = this.state.accountDetailsArray[0].state;
        this.postal.value = this.state.accountDetailsArray[0].postal;
        this.email.value = this.state.accountDetailsArray[0].email;
        this.notifyLogin.checked = this.state.accountDetailsArray[0].notify_login;
        this.newsletterSignup.checked = this.state.accountDetailsArray[0].newsletter;
      }
    ).catch(
      error => {
        this.detailsNotice(error.message);
      }
    );
  }

  /**
   * Validates the values of the input fields of all inputs from the Account
   * Details form. If conditions are not met, the NoticeBox will be prompted.
   * Otherwise, and API call is made, sending the values in the headers. If an
   * API error occurs or a server side error was returned, the NoticeBox will be
   * prompted. If the call was successful, a success NoticeBox is prompted.
   *
   * @param  {event} e onSubmit event handler
   * @return {string}   NoticeBox
   */
  accountDetailsRequest(e) {
    e.preventDefault();
    if(this.firstName.value.length === 0){
      return this.detailsNotice(
        {status: "error", message: "First Name cannot be empty"}
      );
    }
    if(this.lastName.value.length === 0){
      return this.detailsNotice(
        {status: "error", message: "Last Name cannot be empty"}
      );
    }
    if(this.country.value === "country"){
      return this.detailsNotice(
        {status: "error", message: "You need to pick you country"}
      );
    }
    if(this.provinceState.value.length === 0){
      return this.detailsNotice(
        {status: "error", message: "You must provide your state"}
    );
    }
    if(this.email.value.length === 0){
      return this.detailsNotice(
        {status: "error", message: "First Name cannot be empty"}
      );
    }
    if(this.postal.value.length === 0){
      return this.detailsNotice(
        {status: "error", message: "You must provide a postal code"}
      );
    }
    axios.post(this.state.accountDetailsRequestApi,
      {
        first_name: this.firstName.value,
        last_name: this.lastName.value,
        country: this.country.value,
        state: this.provinceState.value,
        postal_code: this.postal.value,
        email: this.email.value,
        notify_login: this.notifyLogin.checked,
        newsletter: this.newsletterSignup.checked,
      }
    ).then(response => {
      if(response.data[0].update_successful) {
        this.detailsNotice(
          {status: "success", message: "Account successfully updated"}
        );
        this.getAccountDetails();
      } else {
        this.detailsNotice(
          {status: "error", message: response.data[0].message}
        );
      }
    }).catch(error => {
      this.detailsNotice(
        {status: "error", message: error.message}
      );
    })
  }

  /**
   * Contains the structure of the first bootstrap row of the page.
   *
   * @return {string} first row div of the page
   */
  firstRow() {
    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            {this.accountDetails()}
          </div>
          <div className="col-md-4">
            {this.mfa()}
          </div>
          <div className="col-md-4">
            {this.passwordChange()}
          </div>
        </div>
      </div>
    );
  }

  /**
   * Displays the current account details information in the input fields,
   * and gives the ability to edit the account details.
   *
   * @return {string}  Account Details form
   */
  accountDetails() {
    return (
      <div className="box">
        <span className="box-header">Account Details</span>
        {this.detailsNoticeMessage()}
        <form id="accountDetails" onSubmit={this.accountDetailsRequest}>
          <div className="form-element">
            <label>First Name</label>
            <div className="input-group">
              <input ref={(input) => this.firstName = input}  type="text" className="form-control" />
            </div>
          </div>
          <div className="form-element">
            <label>Last Name</label>
            <div className="input-group">
              <input ref={(input) => this.lastName = input}  type="text" className="form-control" />
            </div>
          </div>
          <div className="form-element">
            <label>Country</label>
            <div className="input-group rectangle-select">
              <select ref={(input) => this.country = input}  className="full-width">
                <option>Country</option>
                {this.countriesOptions()}
              </select>
            </div>
          </div>
          <div className="form-element">
            <label>State / Province</label>
            <div className="input-group">
              <input ref={(input) => this.provinceState = input}  type="text" className="form-control" />
            </div>
          </div>
          <div className="form-element">
            <label>Postal / ZIP Code</label>
            <div className="input-group">
              <input ref={(input) => this.postal = input} type="text" className="form-control uppercase" />
            </div>
          </div>
          <div className="form-element">
            <label>E-Mail</label>
            <div className="input-group">
              <input ref={(input) => this.email = input}  type="email" className="form-control no-capitalize" />
            </div>
          </div>
          <div className="account-checkboxes">
            <label className="checkbox-field">
              <p>I would like to recieve an e-mail after every login.</p>
              <input ref={(input) => this.notifyLogin = input} type="checkbox" />
              <span className="checkmark"></span>
            </label>
            <label className="checkbox-field">
              <p>I would like to recieve news and updates via e-mail.</p>
              <input ref={(input) => this.newsletterSignup = input} type="checkbox" />
              <span className="checkmark"></span>
            </label>
          </div>
          <input value="Submit" type="submit" className="full-width" />
        </form>
      </div>
    );
  }

  /**
   * Changes the detailsNotice state and calls detailsNoticeMessage().
   *
   * @param  {Object} message contains an array with the status of the notice and its message
   */
  detailsNotice(message) {
    this.setState({detailsNoticeMessage: message});
    this.detailsNoticeMessage();
  }

  /**
   * Checks if the detailsNoticeMessage state is defined, if it is, the notice array
   * is passed through NoticeBox and the element is returned.
   *
   * @return {string} NoticeBox element and its contents
   */
  detailsNoticeMessage() {
    if(this.state.detailsNoticeMessage) {
      return <NoticeBox Array={this.state.detailsNoticeMessage} />;
    }
  }

  /**
   * Displays the current MFA option, and gives the user the ability to change
   * their option.
   *
   * @return {string} mfa form
   */
  mfa() {
    return(
      <div className="box">
        <span className="box-header">Two Factor Authorization</span>
        {this.mfaNoticeMessage()}
        <form id="mfaChange" onSubmit={this.changeMfaRequest}>
          <div className="account-checkboxes">
            <label className="checkbox-field">
              <p>Email</p>
              <input value="email" onChange={this.changeMfaValue} checked={this.state.selectedMfa === "email"} type="radio" />
              <span className="radio"></span>
            </label>
            <label className="checkbox-field">
              <p>Disabled</p>
              <input value="disabled" onChange={this.changeMfaValue} checked={this.state.selectedMfa === "disabled"} type="radio" />
              <span className="radio"></span>
            </label>
          </div>
          <input value="Change 2FA" type="submit" className="full-width" />
        </form>
      </div>
    );
  }

  /**
   * Changes the selectedMfa state when a radio option is selected on the mfa
   * form.
   *
   * @param  {event} e onClick event handler
   */
  changeMfaValue(e) {
    this.setState({selectedMfa: e.target.value});
  }

  /**
   * Makes an API call with the newly selected MFA option. If successful,
   * a success NoticeBox wll be prompted, if not an error NoticeBox will be
   * prompted.
   *
   * @param  {event} e [description]
   * @return {string}   NoticeBox
   */
  changeMfaRequest(e) {
    e.preventDefault();
    axios.post(this.state.changeMfaApi, {
      mfa: this.state.selectedMfa
    }).then(
      response => {
        if(response.data[0].status === "success") {
          this.mfaNotice({status: "success", message: "2FA settings updated"});
          this.getAccountDetails();
        } else {
          this.mfaNotice({status: "error", message: response.data[0].message});
        }
      }
    ).catch(
      error => {
        this.mfaNotice({status: "error", message: error.message});
      }
    );
  }

  /**
   * Changes the mfaNotice state and calls mfaNoticeMessage().
   *
   * @param  {Object} message contains an array with the status of the notice and its message
   */
  mfaNotice(message) {
    this.setState({mfaNoticeMessage: message});
    this.mfaNoticeMessage();
  }

  /**
   * Checks if the detailsNoticeMessage state is defined, if it is, the notice array
   * is passed through NoticeBox and the element is returned.
   *
   * @return {string} NoticeBox element and its contents
   */
  mfaNoticeMessage() {
    if(this.state.mfaNoticeMessage) {
      return <NoticeBox Array={this.state.mfaNoticeMessage} />;
    }
  }

  /**
   * Gives the user the ability to change their password by inserting their
   * existing password, their new desired password and a confirmation of
   * their new desired password.
   *
   * @return {string} password change form
   */
  passwordChange() {
    return (
      <div className="box">
        <span className="box-header">Change Password</span>
        {this.passwordNoticeMessage()}
        <form id="passwordChange" onSubmit={this.changePasswordRequest}>
          <div className="form-element">
            <label>Old Password</label>
            <div className="input-group">
              <input ref={(input) => this.oldPassword = input}  type="password" className="form-control" />
            </div>
          </div>
          <div className="form-element">
            <label>New Password</label>
            <div className="input-group">
              <input ref={(input) => this.newPassword = input}  type="password" className="form-control" />
            </div>
          </div>
          <div className="form-element">
            <label>Confirm New Password</label>
            <div className="input-group">
              <input ref={(input) => this.confirmNewPassword = input}  type="password" className="form-control" />
            </div>
          </div>
          <input value="Update Password" type="submit" className="full-width" />
        </form>
      </div>
    );
  }

  /**
   * Changes the passwordNotice state and calls passwordNoticeMessage().
   *
   * @param  {Object} message contains an array with the status of the notice and its message
   */
  passwordNotice(message) {
    this.setState({passwordNoticeMessage: message});
    this.passwordNoticeMessage();
  }

  /**
   * Checks if the passwordNoticeMessage state is defined, if it is, the notice array
   * is passed through NoticeBox and the element is returned.
   *
   * @return {string} NoticeBox element and its contents
   */
  passwordNoticeMessage() {
    if(this.state.passwordNoticeMessage) {
      return <NoticeBox Array={this.state.passwordNoticeMessage} />;
    }
  }

  /**
   * Validates if the old password field has a value, that the new password
   * matches the regex pattern and that the confirmed password is equaly to the
   * new password. Makes an API call with the new password and the old password.
   * If successful, a success NoticeBox wll be prompted, if not an error
   * NoticeBox will be prompted.
   *
   * @param  {event} e [description]
   * @return {string}   NoticeBox
   */
  changePasswordRequest(e) {
    e.preventDefault();
    if(this.oldPassword.value.length === 0) {
      return this.passwordNotice({status: "error", message: "Please provide your old password"});
    }
    if(!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,}$/.test(this.newPassword.value)) {
      return this.passwordNotice({status: "error", message: "Password must contain an uppercase, a lowercase, a number, one of '@ # $ % ^ & + =' and must be between 8 and 16 characters"});
    }
    if(this.newPassword.value !== this.confirmNewPassword.value) {
      return this.passwordNotice({status: "error", message: "New password and confirmed password must match"});
    }
    axios.post(this.state.changePasswordApi, {
      old_password: this.oldPassword.value,
      new_password: this.newPassword.value
    }).then(
      response => {
        if(response.data[0].status === "success") {
          this.passwordNotice({status: "success", message: "Password Changed"});
        } else {
          this.passwordNotice({status: "error", message: response.data[0].message});
        }
      }
    ).catch(
      error => {
        this.passwordNotice({status: "error", message: error.message});
      }
    );
  }

  secondRow() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <div className="box">
              <span className="box-header">Login History</span>
              {this.loginHistoryNoticeMessage()}
              <div className="table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Device</th>
                      <th>IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.loginHistory()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  loginHistory() {
    // axios.get(this.state.loginHistoryApi).then(
    //   response => {
    //     this.setState({loginHistoryArray: response.data});
    //   }
    // ).catch(
    //   error => {
    //     this.loginHistoryNotice({status: "error", message: error.message})
    //   }
    // );
    return this.state.loginHistoryArray.map(
      login => <tr key={login.record_id}>
                <td>{login.date}</td>
                <td>{login.device}</td>
                <td>{login.ip_address}</td>
              </tr>
    );
  }

  loginHistoryNotice(message) {
    this.setState({loginHistoryNoticeMessage: message});
    this.passwordNoticeMessage();
  }

  loginHistoryNoticeMessage() {
    if(this.state.loginHistoryNoticeMessage) {
      return <NoticeBox Array={this.state.loginHistoryNoticeMessage} />;
    }
  }

  /**
   * Renders the elements for the my profile page. What is returned in this lifecycle
   * function, will be returned when this class is invoked in other areas of the
   * app.
   *
   * @return {string} my profile page element
   */
  render() {
    return (
      <div>
        <Nav pageName="My Profile" />
        <div className="page-body">
          <div className="container">
            {this.firstRow()}
          </div>
        </div>
      </div>
    );
  }
}
export default MyProfile;
