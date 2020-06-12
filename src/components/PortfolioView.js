import React from 'react';
import axios from 'axios';
import Sockette from 'sockette';
import NumberFormat from 'react-number-format';

import NoticeBox from './../utilities/NoticeBox';
import { Api } from './../utilities/api';
import Nav from './../utilities/Nav';
import Table from './../utilities/Table';

import pdata from './../pdata.json';

var CanvasJSReact = require('./../lib/canvasjs.react');
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
/**
 * This class renders the portfolio view page, that inlcudes a candlestick ticker and a portfolio table.
 *
 * @extends React
 */
class PortfolioView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartSymbol: "BTCUSDT",
      chartInterval: "1m",
      graphData: [],
      predictionAI: [],
      candlestickNotice: {
        status: "alert",
        message: "Loading data from binance...",
      },
      portfolios: [
        {
          fund: "",
          amount: "",
          assets: []
        }
      ],
    }
    this.portfolioChange = this.portfolioChange.bind(this);
    this.candlestickNotice = this.candlestickNotice.bind(this);
    this.handlePredicitonData = this.handlePredicitonData.bind(this);
  }

  /**
   * Contains a list of functions that will be called before render() is called.
   *
   */
  componentWillMount() {
    this.setState({selectedPortfolio: this.state.portfolios[0]});
    // this.binanceSocket();
    this.getPortfolios();
    this.getPrediction();
  }

  /**
   * Fetches portfolios and inserts them in the protfolios state.
   *
   */
  getPortfolios() {
    axios.get(Api("tts", 1, "trading/portfoliopos")).then(
      response => {
        const res = response.data;
        if(res.status === "success"){
          this.setState({portfolios: res.result, selectedPortfolio: res.result[0]});
        } else {
          this.candlestickNotice(response.data);
        }
      }
    ).catch(
      error => {
        this.candlestickNotice({status: "error", message: error.message})
      }
    );
  }

  /**
   * Reformats json data into a schema acceptable by CanvasJS. Then inserts new
   * json into the state for graphing.
   *
   * @param  {Object} data
   * @param  {int}    index
   */
  handlePredicitonData(data, index){
    const d = new Date();
    const timestamp = new Date(d.getFullYear(), d.getMonth(), d.getDate(), '9', index).getTime();
    const actual = {
      x: timestamp,
      y: Number(data.Actual)
    };
    const prediction = {
      x: timestamp,
      y: Number(data.Predicted)
    };
    this.setState(prevState => ({
      graphData: [...prevState.graphData, actual],
      predictionAI: [...prevState.predictionAI, prediction],
    }));
  }

  /**
   * Fetches past and future crypto price perdicition AI, and inserts them in
   * the protfolios state.
   *
   */
  getPrediction() {
    axios.get("https://www.torochainfinancial.io/pdata/pdata.json").then(
      response => {
        response.data.forEach(this.handlePredicitonData);
      }
    ).catch(
      error => {
        pdata.forEach(this.handlePredicitonData);
      }
    );
  }

  /**
   * Prints portfolios table, includes a fund selector.
   *
   * @return {string} table
   */
  portfolioTable() {
    const dataSelector = (
      <tr>
        <th colSpan="1">
          <select value={this.state.selectedPortfolio.fund} onChange={this.portfolioChange}>
            {
              this.state.portfolios.map(
                (portfolio, index) => {
                  return (
                    <option
                      key={index}
                      value={portfolio.fund}
                    >
                      {portfolio.fund}
                    </option>
                  )
                }
              )
            }
          </select>
        </th>
        <th colSpan="3">
          <NumberFormat
            value={this.state.selectedPortfolio.amount}
            displayType={'text'}
            thousandSeparator={true}
            prefix={'$'}
          />
          USD
        </th>
      </tr>
    );
    return (
      <Table
        name="portfolio"
        additionalHeader={dataSelector}
        columnHeaders={['assets', 'quantity', 'price', 'change']}
        columnKeys={['asset', 'quantity', 'price', 'change']}
        data={this.state.selectedPortfolio.assets}
      />
    );
  }

  /**
   * Prints the candlestick crypto ticker.
   *
   * @return {string} candlestick chart
   */
  candlestick(){
    const config = {
      title: {
        text: this.state.chartSymbol
      },
      backgroundColor: "#ededed",
			exportEnabled: true,
			axisX: {
				valueFormatString: "HH:mm:ss DDD"
			},
			axisY: {
				includeZero: false,
			},
			data: [
          {
  				type: "line",
          name: "Price",
          xValueFormatString: "HH:mm DDD",
          xValueType: "dateTime",
          color: "#212628",
          showInLegend: true,
  				dataPoints: this.state.graphData
  			},
        {
          type: "line",
          name: "Prediction AI",
          xValueFormatString: "HH:mm DDD",
          xValueType: "dateTime",
          color: "#88c140",
          showInLegend: true,
          dataPoints: this.state.predictionAI
        }
      ]
		};
    return (
      <div className="chart-wrapper">
        <div className="chart-selectors">
          <div className="selector">
            <span>Chart Interval:</span>
            <select defaultValue={this.state.chartInterval}>
              <option value="1m">1m</option>
            </select>
          </div>
          <div className="selector">
            <span>Chart Symbol:</span>
            <select defaultValue={this.state.chartSymbol}>
              <option value="ethbtc">ETHBTC</option>
            </select>
          </div>
        </div>
        <NoticeBox
          Message={this.state.candlestickNotice}
        />
        <CanvasJSChart options={config} />
      </div>
    );
  }

  /**
   * Updates chartSymbol to newly selected chartSymbol, truncates graphData
   * array and closes binance socket.
   *
   * @param  {event} e event handler
   */
  symbolChanger(e){
    this.setState({chartSymbol: e.target.value, graphData: []});
    this.ws.close(1000);
  }

  /**
   * Updates chartSymbol to newly selected chartSymbol, truncates graphData
   * array and closes binance socket.
   *
   * @param  {event} e event handler
   */
  intervalChanger(e){
    this.setState({chartInterval: e.target.value});
    this.ws.close(1000);
  }

  /**
   * Creates binance websocket handshake and defines event handlers.
   *
   */
  binanceSocket() {
    this.ws = new Sockette("wss://stream.binance.com:9443/ws/" + this.state.chartSymbol + "@kline_" + this.state.chartInterval, {
      timeout: 5e3,
      maxAttempts: 10,
      onopen: e => this.candlestickNotice(),
      onmessage: e => this.binanceDataHandler(JSON.parse(e.data)),
      onreconnect: e => console.log('Reconnecting...', e),
      onclose: e => console.log('Websocket closed', e),
      onerror: e => this.candlestickNotice({
        status: "error",
        message: "If you are at a school, a workplace or on a business network, and data is not being displayed, we suggest you try again later somewhere else. Refer to console log for more details.",
      })
		});
  }

  /**
   * Is called when state/props are changed. Closes websocket if new chartSymbol
   * is different than the old chartSymbol and initiates a new socket
   * connection.
   *
   * @param  {[type]} prevProps Previous Props
   * @param  {[type]} prevState Previous State
   */
  componentDidUpdate(prevProps, prevState) {
		if(prevState.chartSymbol !== this.state.chartSymbol || prevState.chartInterval !== this.state.chartInterval) {
			this.ws.close(1000);
			this.binanceSocket();
		}
	}

  /**
   * Handles the payload from the binance websocket. Checks if timestamp isn't
   * already exists in a data array in graphData. Reformats the payload into
   * a canvasjs line chart acceptable schema, and pushes the newly
   * constructed array into the graphData state array.
   *
   * @param  {Object} response payload
   */
  binanceDataHandler(payload) {
    if(this.state.graphData.filter(data => data.x === payload.k.t).length > 0){
      return;
    }
    const graphData = {
      x: payload.k.t,
      y: Number(payload.k.c)
    };
    this.setState({
      graphData: this.state.graphData.concat(graphData)
    });
  }

  /**
   * Handles the portfolio change dropdown, filters the portfolios array for the
   * newly selected fund, and redefines the selectedPortfolio state to include
   * the newly selected fund.
   *
   * @param  {event} e
   */
  portfolioChange(e) {
    const portfolio = this.state.portfolios.filter(portfolio => portfolio.fund === e.target.value)[0];
    this.setState({selectedPortfolio: portfolio});
  }

  /**
   * Message array becomes the new value of the NoticeMessage state.
   *
   * @param  {object} message Notice message array.
   */
  candlestickNotice(message) {
    this.setState({candlestickNotice: message});
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
            <div className="row">
              <div className="col-lg-12">
                {this.candlestick()}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                {this.portfolioTable()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default PortfolioView;
