import React from 'react';
import axios from 'axios';
import {Root} from './api-root';
import Nav from './page-wrapper';
import NoticeBox from './notice-box';
import {CopyToClipboard} from 'react-copy-to-clipboard';

/**
 * Renders the referral page component that contains the referral notice policy
 * and the user's personal referral code.
 *
 * @extends React
 */
class Referral extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      referralCodeApi: Root("prito", 1) + 'account/api/v1/getReferralCode',
      referralCode: 'asdu12j12i',
      referralCodeNoticeMessage: ''
    }
    this.referralCodeCopied = this.referralCodeCopied.bind(this);
  }

  /**
   * Contains a list of functions that will be called before render() is called.
   *
   */
  componentWillMount() {
    // this.getReferralCode();
  }

  /**
   * Contains the referral policy.
   *
   * @return {string}  Referral Notice
   */
  referralNotice() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <div className="box">
              <h5>
                Refer Torochain Financial and get a 1% commission from every purchase made using your referral link - paid
                in USD. Anyone using your referral link to purchase TORO tokens will also receive 100 free tokens on their
                first purchase exceeding $100USD!
              </h5>
              <small>
                (Torochain reserves the right to change the terms of the referral program at any time, for any reason.)
              </small>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Displays the user's referral code, and gives the user the ability to copy
   * their referral code to their clipboard.
   *
   * @return {string} referral code box
   */
  referralCode() {
    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <div className="box">
              <span className="box-header">Referral Code</span>
              {this.referralCodeNoticeMessage()}
              <div className="form-element">
                <div className="input-group">
                  <input value={this.state.referralCode} type="text" className="form-control" disabled />
                  <CopyToClipboard text={this.state.referralCode} onCopy={this.referralCodeCopied}>
                    <button className="narrow-buttom">Copy to Clipboard</button>
                  </CopyToClipboard>
                </div>
              </div>
              {/* <center>
                <div className="code-share">
                  <h5>Share on Social Media</h5>
                  <a      href={"https://twitter.com/home?status=I%E2%80%99m%20in%20on%20next%20gen%20cryptocurrency%20ETFs%20by%20buying%20TORO%20Tokens.%20And%20you%20can%20to.%20Register%20using%20the%20link%20and%20receive%20FREE%20tokens%20during%20Torochain%20Financial%E2%80%99s%20pre-ITO%0A%0Ahttp%3A//torochainfinancial.io/login?refferalCode=" + this.state.referralCode}
                  target="_blank">
                    <i className="fa fa-twitter"></i>
                  </a>
                  <a
                  href={"https://www.facebook.com/sharer/sharer.php?u=http%3A//torochainfinancial.io/login?refferalCode=XXXX" + this.state.referralCode}
                  target="_blank">
                    <i className="fa fa-facebook"></i>
                  </a>
                  <a href={"https://www.linkedin.com/shareArticle?mini=true&url=http%3A//torochainfinancial.io/login?refferalCode=" + this.state.referralCode + "&title=FREE%20tokens%20from%20Torochain%20Financial&summary=I%E2%80%99m%20in%20on%20next%20gen%20cryptocurrency%20ETFs%20by%20buying%20TORO%20Tokens.%20And%20you%20can%20to.%20Register%20using%20the%20link%20and%20receive%20FREE%20tokens%20during%20Torochain%20Financial%E2%80%99s%20pre-ITO&source="}
                  target="_blank">
                    <i className="fa fa-linkedin"></i>
                  </a>
                </div>
              </center> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Calls a success NoticeBox when the referral code is copied.
   *
   * @return {string} NoticeBox
   */
  referralCodeCopied() {
    this.referralCodeNotice({status: "status", message: "Referral Code Copied!"})
  }

  /**
   * Makes an API call to get the referral code, and insert it into the state.
   * If the call was unsuccessful, an error NoticeBox is prompted.
   *
   */
  getReferralCode() {
    axios.get(this.state.referralCodeApi).then(
      response => {
        this.setState({referralCode: response.data[0].referral_code})
      }
    ).catch(
      error => {
        this.referralCodeNotice({status: "error", message: error.message});
      }
    );
  }

  /**
   * Changes the referralCodeNotice state and calls referralCodeNoticeMessage().
   *
   * @param  {Object} message contains an array with the status of the notice and its message
   */
  referralCodeNotice(message) {
    this.setState({referralCodeNoticeMessage: message});
    this.referralCodeNoticeMessage();
  }

  /**
   * Is called to render the NoticeBox after a successful referralCodeNotice()
   *
   * @return {string} NoticeBox
   */
  referralCodeNoticeMessage() {
    if(this.state.referralCodeNoticeMessage) {
      return <NoticeBox Array={this.state.referralCodeNoticeMessage} />
    }
  }

  /**
   * Renders the elements for the referral page. What is returned in this lifecycle
   * function, will be returned when this class is invoked in other areas of the
   * app.
   *
   * @return {string} referral code component
   */
  render() {
    return (
      <div>
        <Nav pageName="Referral Program" />
        <div className="page-body">
          <div className="container">
            {this.referralNotice()}
            {this.referralCode()}
          </div>
        </div>
      </div>
    );
  }
}
export default Referral;
