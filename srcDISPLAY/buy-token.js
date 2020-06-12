import React from 'react';
import {Root} from './api-root';
import axios from 'axios';
import Nav from './page-wrapper';
import NoticeBox from './notice-box';
import ReactTooltip from 'react-tooltip'

/**
 * Builds the Buy Tokens page by rendering it's components that include,
 * info for the Current and Next stafe of ITO, a order tokens widget, order
 * policy modal with required checkboxes and the order history table.
 *
 * @extends React
 */
class BuyToken extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pritoStartDate: '30 May 2018',
      currentItoStage: '',
      nextItoStage: '',
      orderValidatorApi: Root("prito", 1) + 'order/api/v1/ordervalidator',
      yourOrderHistoryApi: Root("prito", 1) + 'order/api/v1/getOrderHistory',
      orderApi: Root("prito", 1) + 'order/api/v1/buytoken',
      tokenPriceApi: Root("prito", 1) + 'order/api/v1/getTokenPrice',
      amount: '5',
      token_price: '8',
      purchase_amount: '45',
      token_early_bird: '56',
      token_bulk: '50',
      total_purchase_amount: '24',
      orderNoticeMessage: '',
      policyNoticeMessage: '',
      yourOrdersNoticeMessage: '',
      yourOrdersArray: [],
      orderHistoryLoaded: true,
    }
    this.amountChange = this.amountChange.bind(this);
    this.placeOrderRequest = this.placeOrderRequest.bind(this);
    this.calculatePritoStages = this.calculatePritoStages.bind(this);
    this.youOrderHistoryRefresh = this.youOrderHistoryRefresh.bind(this);
    this.fetchTokenPrice = this.fetchTokenPrice.bind(this);
  }

  /**
   * Contains a list of functions that is called before render() is called.
   *
   */
  componentWillMount(){
    // this.yourOrdersRequest();
    this.calculatePritoStages();
    // this.fetchTokenPrice();
  }

  /**
   * Makes an API call to define the token_price state. If the call fails, an
   * error NoticeBox is prompted over the token order form.
   *
   */
  fetchTokenPrice(){
    axios.get(this.state.tokenPriceApi).then(
      response => {
        this.setState({token_price: parseFloat(response.data[0].tokenPrice).toFixed(2)});
      }
    ).catch(
      error => {
        this.orderNotice({status: "error", message: error.message});
      }
    )
  }

  /**
   * Determines if the pre-ito start date is in the future, if so the current
   * ITO stage start date is the pre-ito start date and the current ITO
   * bonus is 100. Otherwise, the current stage start date is the
   * current date, and the amount of days between the current date and the
   * pre-ito start date is calculated and the difference is subtracted
   * from 100; the new difference is the value of the early bird bonus. The
   * the current ito stage end date is calculated by adding a day to the
   * current ito stage start date. The current stage information is defined
   * in an array and the array is pushed into the state. As for the next ITO
   * stage, the bonus token is calculated by subtracting 1 from the current ito
   * stage bonus. The next stage start date is the current stage end date and
   * the next stage end date is calculated by adding a day to the current stage
   * end date. The next ito stage information is defined in an array and the
   * array is pushed into the state.
   *
   */
  calculatePritoStages(){
    var pritoStart = new Date(this.state.pritoStartDate);
    var today = new Date();
    if(pritoStart > today){
      var pritoCurrentStartDate = pritoStart;
      var pritoCurrentBonus = "100";
    } else {
      // eslint-disable-next-line
      var pritoCurrentStartDate =  new Date(today.toDateString());
      var timeStartToCurrent = Math.abs(pritoCurrentStartDate.getTime() - pritoStart.getTime());
      var daysIntoPrito = Math.ceil(timeStartToCurrent / (1000 * 3600 * 24));
      // eslint-disable-next-line
      var pritoCurrentBonus = 100 - daysIntoPrito;
    }
    var pritoCurrentEndDate = new Date(pritoCurrentStartDate);
    pritoCurrentEndDate.setDate(pritoCurrentEndDate.getDate() + 1);
    const currentItoStage = {
      price: this.state.token_price,
      bonus_token: 99,
      starting_date: pritoCurrentStartDate.toDateString(),
      end_date: pritoCurrentEndDate.toDateString(),
    };
    var pritoNextEndDate = new Date(pritoCurrentEndDate);
    pritoNextEndDate.setDate(pritoNextEndDate.getDate() + 1);
    const nextItoStage = {
      price: this.state.token_price,
      bonus_token: 98,
      starting_date: pritoCurrentEndDate.toDateString(),
      end_date: pritoNextEndDate.toDateString(),
    };
    this.setState({
      currentItoStage: currentItoStage,
      nextItoStage: nextItoStage
    });
  }

  /**
   * Current ITO stage box with info about the current ITO stage.
   *
   * @return {string} Current ITO stage element
   */
  currentStage() {
    return(
      <div className="box">
        <span className="box-header">Current ITO Stage</span>
        <div className="row">
          <div className="col-sm-6">
            <small>Price:</small>
            <h2>$ {this.state.currentItoStage.price}</h2>
          </div>
          <div className="col-sm-6">
            <small>Bonus Tokens:</small>
            <h2>{this.state.currentItoStage.bonus_token} %</h2>
          </div>
          <div className="col-sm-6">
            <small>Starting Date:</small><br />
            <small><strong>{this.state.currentItoStage.starting_date}</strong></small>
          </div>
          <div className="col-sm-6">
            <small>End Date:</small><br />
            <small><strong>{this.state.currentItoStage.end_date}</strong></small>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Retrieves the currency amount input field value and validates that it is a
   * positive integer. If conditions are not met, an error NoticeBox is
   * prompted over the form. If conditions are met, an API call is made to
   * validate the headers on the backend. If the call was unsuccessful or the
   * server responds with an error, the NoticeBox class is called and the
   * error is populated into the NoticeBox. If the API call was successful,
   * the amount of tokens and bonus tokens calculated by the back end is
   * inserted into the disabled purchase_amount, token_early_bird and token_bulk
   * input fields respectively by changing their states. The
   * total_purchase_amount is also calculated and inserted into the disabled
   * total_purchase_amount input field by changing it's state.
   *
   * @param  {event} e currency amount onChange handler
   * @return {string}   NoticeBox
   */
  amountChange(e) {
    if(!/^[\d.]+$/.test(e.target.value)) {
      return this.setState({amount: ''});
    }
    this.setState({amount: e.target.value});
    axios.post(this.state.orderValidatorApi, {
      currency_amount: e.target.value,
      currency: this.currency.value,
    }).then(
      response => {
        if(response.data[0].status === "success") {
          this.setState({orderNoticeMessage: ''});
          this.setState({purchase_amount: response.data[0].token_quantity});
          this.setState({token_bulk: response.data[0].token_bulk});
          this.setState({token_early_bird: response.data[0].token_early_bird});
          var total_token = (response.data[0].token_quantity + response.data[0].token_early_bird + response.data[0].token_bulk).toFixed(2);
          this.setState({total_purchase_amount: total_token});
        }
        if(response.data[0].status === "error") {
          this.orderNotice({status: "error", message: response.data[0].message});
        }
      }
    ).catch(
      error => {
        this.orderNotice({status: "error", message: error.message});
      }
    );
  }

  /**
   * Changes the orderNotice state and calls orderNoticeMessage().
   *
   * @param  {Object} message contains an array with the status of the notice
   * and its message.
   */
  orderNotice(message) {
    this.setState({orderNoticeMessage: message});
    this.orderNoticeMessage();
  }

  /**
   * Checks if the orderNoticeMessage state is defined, if it is, the notice
   * array is passed through NoticeBox and the element is returned.
   *
   * @return {string} NoticeBox element and its contents
   */
  orderNoticeMessage() {
    if(this.state.orderNoticeMessage) {
      return <NoticeBox Array={this.state.orderNoticeMessage} />;
    }
  }

  /**
   * Contains the order validator form. If the place order button is clicked,
   * a conditional inside the data-target attribute checks if the
   * orderNoticeMessage is empty and the amount input field value is greater
   * than zero. If the condition is met, the data-target attribute is populated
   * with the ID of the policy modal. If successful, the policy modal is
   * prompted.
   *
   * @return {string} Buy tokens element
   */
  buyToken() {
    return (
      <div className="box">
        <span className="box-header">Buy Tokens</span>
        {this.orderNoticeMessage()}
        <form id="buyTokenForm">
          <div className="form-element">
            <label>Amount</label>
            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-money fw"></i></span>
              <input value={this.state.amount} onChange={this.amountChange} type="text" className="form-control" />
              <span className="input-group-addon">
                <select ref={(input) => this.currency = input} onChange={this.amountChange}>
                  <option>LTCT</option>
                </select>
              </span>
            </div>
          </div>
          <div className="form-element">
            <label>TORO Token Amount</label>
            <div className="input-group">
              <span className="input-group-addon"><img className="toro-token" src="img/dark-toro-icon.svg" alt="TORO coin" /></span>
              <input value={this.state.purchase_amount} type="text" className="form-control" disabled />
            </div>
          </div>
          <div className="form-element">
            <label>Early Bird Bonus Amount</label>
            <div className="input-group">
              <span className="input-group-addon"><img className="toro-token" src="img/dark-toro-icon.svg" alt="TORO coin" /></span>
              <input value={this.state.token_early_bird} type="text" className="form-control with-tooltip" disabled />
              <span data-tip data-for="earlyBonusInfo" className="input-group-addon field-info">
                <i className="fa fa-question-circle fw"></i>
              </span>
              <ReactTooltip id="earlyBonusInfo" effect="solid">
                <span>
                  Early bird bonus decreases by 1% everyday
                </span>
              </ReactTooltip>
            </div>
          </div>
          <div className="form-element">
            <label>Bulk Bonus Amount</label>
            <div className="input-group">
              <span className="input-group-addon"><img className="toro-token" src="img/dark-toro-icon.svg" alt="TORO coin" /></span>
              <input value={this.state.token_bulk} type="text" className="form-control with-tooltip" disabled />
              <span data-tip data-for="bulkBonusInfo" className="input-group-addon field-info">
                <i className="fa fa-question-circle fw"></i>
              </span>
              <ReactTooltip id="bulkBonusInfo" effect="solid">
                <span>
                  <table>
                    <thead>
                      <th>Amount</th>
                      <th>Bonus</th>
                    </thead>
                    <tbody>
                      <tr>
                        <td>20,000+</td>
                        <td>30%</td>
                      </tr>
                      <tr>
                        <td>500,000+</td>
                        <td>30%</td>
                      </tr>
                      <tr>
                        <td>500,000+</td>
                        <td>45%</td>
                      </tr>
                      <tr>
                        <td>1,000,000+</td>
                        <td>60%</td>
                      </tr>
                      <tr>
                        <td>10,000,000+</td>
                        <td>100%</td>
                      </tr>
                    </tbody>
                  </table>
                </span>
              </ReactTooltip>
            </div>
          </div>
          <div className="form-element">
            <label>Total Token Amount</label>
            <div className="input-group">
              <span className="input-group-addon"><img className="toro-token" src="img/dark-toro-icon.svg" alt="TORO coin" /></span>
              <input value={this.state.total_purchase_amount} type="text" className="form-control" disabled />
            </div>
          </div>
          <button type="button" className="full-width" data-toggle="modal" data-target={(this.state.orderNoticeMessage === "" && this.state.amount > 0  ? "#orderPolicyModal" : "")}>Place Order</button>
        </form>
      </div>
    );
  }

  /**
   * Validates whether the required policy agreement checkboxes were checked, if
   * they are not checked, a NoticeBox is prompted. If all checkboxes
   * were checked, an API call is made sending the currency amount value, the
   * currency selected and the value of all policy checkboxes. If the API call
   * returns a server side error or a call failure occurs, the NoticeBox is
   * prompted with an error message. If the API call was successful, the window
   * is redirected to a URL given by the backend.
   *
   * @param  {event} e onClick event handler
   * @return {string}   NoticeBox
   */
  placeOrderRequest(e) {
    e.preventDefault();
    if(!this.notUSResident.checked || !this.readLightWhitepaper.checked || !this.agreedToPurchaseTerms.checked || !this.agreedToTerms.checked) {
      return this.policyNotice({status: "error", message: "All checkboxes must be checked"});
    }
    axios.post(this.state.orderApi, {
      currency: this.currency.value,
      currency_amount: this.state.amount,
      not_us_resident: this.notUSResident.checked,
      read_light_whitepaper: this.readLightWhitepaper.checked,
      agreed_to_purchase_terms: this.agreedToPurchaseTerms.checked,
      agreed_to_terms: this.agreedToTerms.checked
    }).then(
      response => {
        if(response.data[0].status === "success") {
          window.location.href = response.data[0].redirect;
        } else {
          this.policyNotice({status: "error", message: response.data[0].message});
        }
      }
    ).catch(
      error => {
        this.policyNotice({status: "error", message: error.message});
      }
    );
  }

  /**
   * Changes the policyNotice state and calls policyNoticeMessage().
   *
   * @param  {Object} message contains an array with the status of the notice and its message
   */
  policyNotice(message) {
    this.setState({policyNoticeMessage: message});
    this.policyNoticeMessage();
  }

  /**
   * Checks if the policyNoticeMessage state is defined, if it is, the notice array
   * is passed through NoticeBox and the element is returned.
   *
   * @return {string} NoticeBox element and its contents
   */
  policyNoticeMessage() {
    if(this.state.policyNoticeMessage) {
      return <NoticeBox Array={this.state.policyNoticeMessage} />;
    }
  }

  /**
   * Renders the order modal that contains the Torochain terms and policy
   * agreement in an iframe. The element also contains a policy agreement form.
   * When the "Place Order" button is clicked, placeOrderRequest() is called.
   *
   * @return {string} Order modal
   */
  orderModal() {
    return(
      <div>
        <div className="modal fade" id="orderPolicyModal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <h4>
                  Please read the Token purchase agreeement, terms of use,
                  White paper and confirm the facts in the checkboxes
                  below in order to proceed.
                </h4>
                {this.policyNoticeMessage()}
                <iframe className="policy-box" title="order policy" src="order-policy.html" />
                <div className="row">
                  <div className="col-md-12">
                    <center>
                      <p>
                        Due to fluctuations in bitcoin to usd prices between the
                        time you enter amount and place an order you may receive
                        more or less TORO tokens than expected.
                      </p>
                    </center>
                  <br />
                  </div>
                  <div className="col-md-6">
                    <label className="checkbox-field">
                      <p>
                        I confirm that I am NOT a U.S. citizen, resident
                        or entity (each a "U.S. Person") nor are you purchasing
                        TORO Tokens or signing on behalf of a U.S. Person.
                      </p>
                      <input ref={(input) => this.notUSResident = input} type="checkbox" />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="col-md-6">
                    <label className="checkbox-field">
                      <p>I confirm that I have read the light whitepaper.</p>
                      <input ref={(input) => this.readLightWhitepaper = input} type="checkbox" />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="col-md-6">
                    <label className="checkbox-field">
                      <p>
                        I confirm that I have read, understood and
                        agreed to the terms of the purchase agreement.
                      </p>
                      <input ref={(input) => this.agreedToPurchaseTerms = input} type="checkbox" />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="col-md-6">
                    <label className="checkbox-field">
                      <p>
                        I confirm that I have read, understood and
                        agreed to the terms of use.
                      </p>
                      <input ref={(input) => this.agreedToTerms = input} type="checkbox" />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </div>
                <center>
                  <input type="submit" value="Place Order" onClick={this.placeOrderRequest} className="half-width" />
                </center>
              </div>
              <div className="modal-footer">
                <button type="button" data-dismiss="modal">Close</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  /**
   * Next ITO stage box with info about the next ITO stage.
   *
   * @return {string} Next ITO stage element
   */
  nextStage() {
    return(
      <div className="box">
        <span className="box-header">Next ITO Stage</span>
        <div className="row">
          <div className="col-sm-6">
            <small>Price:</small>
            <h2>$ {this.state.nextItoStage.price}</h2>
          </div>
          <div className="col-sm-6">
            <small>Bonus Tokens:</small>
            <h2>{this.state.nextItoStage.bonus_token} %</h2>
          </div>
          <div className="col-sm-6">
            <small>Starting Date:</small><br />
            <small><strong>{this.state.nextItoStage.starting_date}</strong></small>
          </div>
          <div className="col-sm-6">
            <small>End Date:</small><br />
            <small><strong>{this.state.nextItoStage.end_date}</strong></small>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Contains the structure of the first bootstrap row of the page.
   *
   * @return {string} first row div of the page
   */
  firstRow() {
    return (
      <div id="buy-token-page">
        <div className="row">
          <div className="col-md-4">
            {this.currentStage()}
          </div>
          <div className="col-md-4">
            {this.buyToken()}
          </div>
          <div className="col-md-4">
            {this.nextStage()}
          </div>
        </div>
      </div>
    );
  }

  /**
   * Set the orderHistoryLoaded state to false to get the refresh button refresh
   * icon rotating. The yourOrdersRequest() function is called.
   *
   */
  youOrderHistoryRefresh(){
    this.setState({orderHistoryLoaded: false});
    this.yourOrdersRequest();
  }

  /**
   * A table with the personal order history info and data. A button is rendered
   * to give the user the option to refresh their order history.
   *
   * @return {string} Table
   */
  yourOrders() {
    return (
      <div id="your-orders">
        <div className="row">
          <div className="col-md-12">
            <div className="box">
              <span className="box-header">
                Your Orders
                <button onClick={this.youOrderHistoryRefresh} className="refresh-button">
                  <i className={"fa fa-refresh" + (!this.state.orderHistoryLoaded ? " fa-spin" : "")}></i>&nbsp; Refresh
                </button>
              </span>
              {this.yourOrdersNoticeMessage()}
              <div className="table">
                <table>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Tokens</th>
                      <th>Tokens For Claim</th>
                      <th>Price</th>
                      <th>Payment Method</th>
                      <th>Currency</th>
                      <th>Amount Paid</th>
                      <th>Status</th>
                      <th>Confirmed Blocks</th>
                      <th>Payment Address</th>
                      {/* <th>Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {this.printOrderRows()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Changes the orderNotice state and calls orderNoticeMessage().
   *
   * @param  {Object} message contains an array with the status of the notice and its message
   */
  yourOrdersNotice(message) {
    this.setState({yourOrdersNoticeMessage: message});
    this.policyNoticeMessage();
  }

  /**
   * Checks if the orderNoticeMessage state is defined, if it is, the notice array
   * is passed through NoticeBox and the element is returned.
   *
   * @return {string} NoticeBox element and its contents
   */
  yourOrdersNoticeMessage() {
    if(this.state.yourOrdersNoticeMessage) {
      return <NoticeBox Array={this.state.yourOrdersNoticeMessage} />;
    }
  }

  /**
   * Makes a GET API call and assigns the orders arrays into yourOrdersArray
   * state. If the API call was unsuccessful, a NoticeBox is prompted. When the
   * call is concluded, the orderHistoryLoaded state is set to false to stop the
   * refresh icon from rotating.
   *
   * @return {string} NoticeBox
   */
  yourOrdersRequest() {
    axios.get(this.state.yourOrderHistoryApi).then(
      response => {
        if(response.data[0].status === "success") {
          this.setState({yourOrdersArray: response.data[0].orders});
        } else {
          this.yourOrdersNotice({status: "error", message: response.data[0].message});
        }
        this.setState({orderHistoryLoaded: true});
      }
    ).catch(
      error => {
        this.yourOrdersNotice({status: "error", message: error.message});
        this.setState({orderHistoryLoaded: true});
      }
    );
  }

  /**
   * Loops through the arrays in yourOrdersArray and prints a row for each
   * array.
   *
   * @return {string} Order table rows
   */
  printOrderRows() {
    if(this.state.yourOrdersArray) {
      return this.state.yourOrdersArray.map(
        order => <tr key={order.uuidOrderId}>
                  <td>{order.uuid}</td>
                  <td>{order.date}</td>
                  <td>{order.tokensBought}</td>
                  <td>{order.tokensBonus}</td>
                  <td>{order.price}</td>
                  <td>{order.paymentMethod}</td>
                  <td>{order.currency}</td>
                  <td>{order.amountPaid}</td>
                  <td>{order.status}</td>
                  <td>{order.confirmedBlocks}</td>
                  <td>{order.paymentAddress}</td>
                </tr>
      );
    }
  }

  /**
   * Renders the elements for the buy token page. What is returned in this
   * lifecycle function, is returned when this class is invoked in other
   * areas of the app.
   *
   * @return {string} buy token page element
   */
  render() {
    return (
      <div>
        <Nav pageName="Buy Token" />
        <div className="page-body">
          {this.orderModal()}
          <div className="container">
            {this.firstRow()}
            {this.yourOrders()}
          </div>
        </div>
      </div>
    );
  }
}
export default BuyToken;
