import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import './scss/style.scss';

import { Api } from './utilities/api';
import UserContext from './utilities/context';

import LoginPage from './components/LoginPage';
import TradingView from './components/TradingView';
import PortfolioView from './components/PortfolioView';

/**
 * Ensures a session exists before rendering the called component, if not, a
 * redirect will occur.
 *
 * @extends React
 */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session: {
        session_loaded: false,
        session_exists: false
      }
    }
    this.getSession = this.getSession.bind(this);
    this.getCSRF = this.getCSRF.bind(this);
  }

  /**
   * Contains a list of functions that will be called before render() is called.
   *
   */
  componentWillMount() {
    setInterval(this.getSession, 15 * 60 * 1000);
    this.getSession();
    this.getCSRF();
  }

  /**
   * Makes an API call, recieves the CSRF token and defines the default
   * X-CSRF-Token header for all following requests.
   *
   */
  getCSRF(){
    axios.get(Api("tts", 1, "csrfToken")).then(
      response => {
        axios.defaults.headers.common['X-CSRF-Token'] = response.data[0].csrftoken;
      }
    ).catch(
      error => {
        console.error("Failed to obtain CSRF token:  " + error.message);
      }
    );
  }

  /**
   * Checks if a session exists, changes the state according to response
   * results.
   *
   */
  getSession(){
    axios.get(Api("tts", 1, "getSession")
    ).then(
      response => {
        if(response.data.session_exists){
          this.setState({
            session: {
              session_loaded: true,
              session_exists: true,
              first_name: response.data.first_name,
              last_name: response.data.last_name
            }
          });
        } else {
          this.setState({
            session: {
              session_loaded: true,
              session_exists: false,
            }
          });
        }
      }
    ).catch(
      error => {
        this.setState({
          session: {
            session_loaded: true,
            session_exists: false,
          }
        });
      }
    );
  }

  /**
   *
   * @return {string} Called component
   */
  render() {
    const pathname = window.location.pathname;
    if(/\/$/.test(pathname) && pathname !== "/"){
      window.location.pathname = pathname.replace(/\/$/, "");
      return (
        <div className="loader-backgroud">
          <div className="loader"></div>
        </div>
      );
    }
    /**
     * Contains the router, that will insert and remove components from the DOM
     * based on the route used.
     *
     */
    const Component = () => (
      <Router>
        <Switch>
          <Route
            exact path="/"
            render={() => (
              <Redirect to="/maintenance" />
            )}
          />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/trading" component={(this.state.session.session_exists ? TradingView : ReturnToLogin)} />
          <Route exact path="/portfolio" component={(this.state.session.session_exists ? PortfolioView : ReturnToLogin)} />

          <Route exact path="/maintenance" component={Maintenance} />
          <Route component={Error404} />
        </Switch>
      </Router>
    );

    /**
     * Returns user to login page if user is not already on login page.
     *
     */
    const ReturnToLogin = () => {
      if(window.location.pathname !== "/login"){
        return window.location.href = "/login";
      }
    }

    /**
     * Contains the Error page component if a route does not exist.
     *
     * @param {string} location route
     */
    const Error404 = ({ location }) => (
      <div>
        <center>
          <img className="error-page-logo" src={window.location.origin + "/img/dark-vlogo.svg"} alt="Torochain Logo" />
          <h5>404 {location.pathname} does not exist</h5>
          <Link to="/portfolio">
            <button>
              Go Back to Dashboard
            </button>
          </Link>
        </center>
      </div>
    );

    /**
     * Renders maintenance page component.
     *
     */
    const Maintenance = () => (
      <div>
        <div className="maintenance-page-body">
          <div className="logo-bg">
            <img   src="https://i2.wp.com/www.torochainfinancial.com/wp-content/uploads/2018/05/TOROLOGO-05-1.png?resize=632%2C632&ssl=1" alt="Toro logo" className="logo" />
          </div>
          <div className="message">
            <p>
              We appreciate your patience while we perform maintenance on this page, functionality will be restored soon.
            </p>
            <a href="https://torochainfinancial.com">
              <button className="action">
                go back to site
              </button>
            </a>
          </div>
        </div>
      </div>
    );

    if(this.state.session.session_loaded){
      return (
        <UserContext.Provider value={{session: this.state.session}}>
          <Component />
        </UserContext.Provider>
      );
    } else {
      return (
        <div className="loader-backgroud">
          <div className="loader"></div>
        </div>
      );
    }
  }
}
export default App;
