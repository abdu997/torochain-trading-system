import React from 'react';
import axios from 'axios';
import NumberFormat from 'react-number-format';

import { Api } from './../utilities/api';
import NoticeBox from './../utilities/NoticeBox';
import Nav from './../utilities/Nav';
import Table from './../utilities/Table'

/**
 * This class renders the trading view page.
 *
 * @extends React
 */
class TradingView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      funds: [
        {
          name: '',
          amount: '',
          data: [],
        },
      ],
      selectedFund: '',
      models: [
        {
          name: '',
          data: [],
        },
      ],
      selectedModel: '',
      proposedTrades: [],
      proposedPortfolio: [],
      tradeBlotter: [],
    }
    this.selectFund = this.selectFund.bind(this);
    this.selectModel = this.selectModel.bind(this);
    this.proposedTradesTable = this.proposedTradesTable.bind(this);
  }

  /**
   * Contains a list of functions that will be called before render() is called.
   *
   */
  componentWillMount() {
    this.setState({selectedFund: this.state.funds[0], selectedModel: this.state.models[0]});
    this.getFunds();
    this.getModels();
    this.getProposedTrades();
    this.getProposedPortfolio();
    this.getTradeBlotter();
  }

  /**
   * Handles the fund change dropdown, filters the portfolios array for the
   * newly selected fund, and redefines the selectedFund state to include
   * the newly selected fund.
   *
   * @param  {event} e
   */
  selectFund(e){
    const fund = this.state.funds.filter(fund => fund.name === e.target.value)[0];
    this.setState({selectedFund: fund});
  }

  /**
   * Message array becomes the new value of the NoticeMessage state.
   *
   * @param  {object} message Notice message array.
   */
  tradingViewNotice(message) {
    this.setState({tradingViewNotice: message});
  }

  /**
   * Fetches funds and inserts them in the funds state.
   *
   */
  getFunds() {
    axios.get(Api("server", "version", "route name")).then(
      response => {
        if(response.data.status === "success"){
          this.setState({funds: response.data.result, selectedFund: response.data.result[0]});
        } else {
          this.tradingViewNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.tradingViewNotice({status: "error", message: error.message})
      }
    );
  }

  /**
   * Fetches models and inserts them in the models state.
   *
   */
  getModels() {
    axios.get(Api("server", "version", "route name")).then(
      response => {
        if(response.data.status === "success"){
          this.setState({models: response.data.result, selectedModel: response.data.result[0]});
        } else {
          this.tradingViewNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.tradingViewNotice({status: "error", message: error.message})
      }
    );
  }

  /**
   * Fetches proposed trades and inserts them in the proposed trades state.
   *
   */
  getProposedTrades() {
    axios.get(Api("server", "version", "route name")).then(
      response => {
        if(response.data.status === "success"){
          this.setState({proposedTrades: response.data.result});
        } else {
          this.tradingViewNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.tradingViewNotice({status: "error", message: error.message})
      }
    );
  }

  /**
   * Fetches proposed portfolios and inserts them in the proposed portfolios state.
   *
   */
  getProposedPortfolio() {
    axios.get(Api("server", "version", "route name")).then(
      response => {
        if(response.data.status === "success"){
          this.setState({proposedPortfolio: response.data.result});
        } else {
          this.tradingViewNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.tradingViewNotice({status: "error", message: error.message})
      }
    );
  }

  /**
   * Fetches trade blotter and inserts them in the trade blotter state.
   *
   */
  getTradeBlotter() {
    axios.get(Api("server", "version", "route name")).then(
      response => {
        if(response.data.status === "success"){
          this.setState({tradeBlotter: response.data.result});
        } else {
          this.tradingViewNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.tradingViewNotice({status: "error", message: error.message})
      }
    );
  }

  /**
   * Prints funds table with a funds selector
   *
   * @return {string} fund table
   */
  fundTable() {
    const dataSelector = (
      <tr>
        <th colSpan="2">
          <select className="capitalize" value={this.state.selectedFund.name} onChange={this.selectFund}>
            {
              this.state.funds.map(
                fund => {
                  return (
                    <option key={fund.name} value={fund.name}>{fund.name}</option>
                  )
                }
              )
            }
          </select>
        </th>
        <th colSpan="1">
          <NumberFormat
            value={this.state.selectedFund.amount} displayType={'text'} thousandSeparator={true} prefix={'$'}
          />
          USD
        </th>
      </tr>
    );
    return (
      <Table
        name="fund"
        additionalHeader={dataSelector}
        columnHeaders={['asset', 'quantity', 'weight']}
        columnKeys={['asset', 'quantity', 'weight']}
        data={this.state.selectedFund.data}
      />
    );
  }

  /**
   * Handles the Model change dropdown, filters the Models array for the
   * newly selected Model, and redefines the selectedModel state to include
   * the newly selected Model.
   *
   * @param  {event} e
   */
  selectModel(e){
    const model = this.state.models.filter(model => model.name === e.target.value)[0];
    this.setState({selectedModel: model});
  }

  /**
   * Prints models table with a models selector and apply model button in the
   * footer.
   *
   * @return {string} fund table
   */
  modelTable() {
    const dataSelector = (
      <tr>
        <th colSpan="3">
          <select className="capitalize" value={this.state.selectedModel.name} onChange={this.selectModel}>
            {
              this.state.models.map(
                model => {
                  return (
                    <option key={model.name} value={model.name}>{model.name}</option>
                  )
                }
              )
            }
          </select>
        </th>
      </tr>
    );
    const tfoot = (
      <tfoot>
        <tr>
          <th>
            <input type="text" placeholder="Asset" className="form-control" />
          </th>
          <th>
            <input type="text" placeholder="Quantity" className="form-control" />
          </th>
          <th>
            <input type="text" placeholder="Weight" className="form-control" />
          </th>
        </tr>
        <tr>
          <th colSpan="3">
            <center>
              <button className="mini-button">
                Apply Model
              </button>
            </center>
          </th>
        </tr>
      </tfoot>
    );
    return (
      <Table
        name="model"
        additionalHeader={dataSelector}
        columnHeaders={['asset', 'quantity', 'weight']}
        columnKeys={['asset', 'quantity', 'weight']}
        data={this.state.selectedModel.data}
        foot={tfoot}
      />
    );
  }

  /**
   * Prints proposed trades table, with create new model form in the footer.
   *
   * @return {string} fund table
   */
  proposedTradesTable() {
    const tfoot = (
      <tfoot>
        <tr>
          <th colSpan="3">
            <center>
              <button className="mini-button">
                Apply Model
              </button>
            </center>
          </th>
        </tr>
      </tfoot>
    );
    return (
      <Table
        name="proposed trades"
        columnHeaders={['symbol', 'side', 'quantity']}
        columnKeys={['symbol', 'side', 'quantity']}
        data={this.state.proposedTrades}
        foot={tfoot}
      />
    );
  }

  /**
   * Prints proposed portfolios table.
   *
   * @return {[type]} [description]
   */
  proposedPortfolioTable() {
    return (
      <Table
        name="proposed portfolio"
        columnHeaders={['asset', 'quantity']}
        columnKeys={['asset', 'quantity']}
        data={this.state.proposedPortfolio}
      />
    );
  }

  /**
   * Prints trade blotter table with a compliance check button in the header.
   *
   * @return {string} fund table
   */
  blotterTable() {
    const compliance = (
      <tr>
        <th colSpan="9">
          <button className="mini-button">
            Compliance Check
          </button>
        </th>
      </tr>
    );
    return (
      <Table
        name="trade blotter"
        additionalHeader={compliance}
        columnHeaders={['portfolio ID', 'symbol', 'side', 'quantity', 'date', 'filled', 'working', 'avg. fill price', 'status']}
        columnKeys={['portfolio_id', 'symbol', 'side', 'quantity', 'date', 'filled', 'working', 'avg_fill_price', 'status']}
        data={this.state.tradeBlotter}
      />
    );
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
      <div>
        <Nav />
        <div className="page-body">
          <div className="container">
            <NoticeBox Message={this.state.tradingViewNotice} />
            <div className="row">
              <div className="col-lg-3">
                {this.fundTable()}
              </div>
              <div className="col-lg-3">
                {this.modelTable()}
              </div>
              <div className="col-lg-3">
                {this.proposedTradesTable()}
              </div>
              <div className="col-lg-3">
                {this.proposedPortfolioTable()}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                {this.blotterTable()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default TradingView;
