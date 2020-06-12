import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import './css/dashboard.scss';
import LoginPage from './login-page';
import BuyToken from './buy-token';
import PasswordReset from './password-reset';
import MyProfile from './my-profile';
import ReferralPage from './referral';


/**
 * Contains the router, that will insert and remove components from the DOM
 * based on the route used.
 *
 */
const AppRouter = () => (
  <Router>
    <Switch>
      <Route
        exact path="/"
        render={() => (
          <Redirect to="/buytoken"/>
        )}
      />
      <Route
        exact path="/dashboard"
        render={() => (
          <Redirect to="/buytoken"/>
        )}
      />
      <Route path="/buytoken" component={BuyToken} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={LoginPage} />
      <Route path="/password" component={PasswordReset} />
      <Route path="/profile" component={MyProfile} />
      <Route path="/referral" component={ReferralPage} />
      <Route component={Error404} />
    </Switch>
  </Router>
);

/**
 * Contains the Error page component if a route does not exist.
 *
 * @param {string} location route
 */
const Error404 = ({ location }) => (
  <div>
    <center>
      <img className="error-page-logo" src="https://torochainfinancial.io/img/dark-vlogo.svg" alt="Torochain Logo" />
      <h5>404 {location.pathname} does not exist</h5>
      <Link to="/buytoken">
        <button>
          Go Back to Dashboard
        </button>
      </Link>
    </center>
  </div>
);

/**
 * Renders the app inside the root element on index.html
 *
 */
ReactDOM.render(
  <AppRouter />,
  document.getElementById('root')
);
