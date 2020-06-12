import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { Api } from './api';
import { WithContext } from './context';

/**
 * Renders the side nav and top nav and checks if a session exists.
 *
 * @extends React
 */
class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileSideNav: '',
      currentRoute: window.location.pathname,
      pageName: '',
      navPages: [
        {
          pageName: 'Portfolio View',
          pageRoute: '/portfolio',
        },
        // {
        //   pageName: 'Trading View',
        //   pageRoute: '/trading',
        // },
      ],
      fullName: this.props.context.session.first_name + ' ' + this.props.context.session.last_name,
    }
    this.closeSideNav = this.closeSideNav.bind(this);
    this.openSideNav = this.openSideNav.bind(this);
    this.logout = this.logout.bind(this);
  }

  /**
   * Contains a list of functions that will be called before render() is called.
   *
   */
  componentWillMount() {
    this.definePageName();
  }

  /**
   * Filters pages array to get the page name of the current session route. Updates the state with the new page name.
   *
   */
  definePageName() {
    const pageName = this.state.navPages.filter(page => this.state.currentRoute === page.pageRoute)[0].pageName;
    this.setState({pageName: pageName});
  }

  /**
   * The nav bar pages in the navPages state are looped and an element is
   * printed for each array. It also checks if the page route matches the route
   * of the looped page, if so, the element is marked as active.
   *
   * @return {string} Nav bar pages
   */
  navigation() {
    return this.state.navPages.map(page => {
      return (
        <div key={page.pageRoute}>
          <Link to={page.pageRoute}>
            <li className={"side-nav-item" + (this.state.currentRoute === page.pageRoute ? ' active' : '')}>
              {page.pageName}
            </li>
          </Link>
        </div>
      );
    })
  }

  /**
   * Removes the active value of the mobileSideNav state, to remove the active
   * class from the side nav to close the side nav when the screen width is
   * smaller than 992px.
   *
   */
  closeSideNav() {
    this.setState({mobileSideNav: ''});
  }

  /**
   * Adds the active value in the mobileSideNav state, to add the active
   * class from the side nav to open the side nav when the screen width is
   * smaller than 992px.
   *
   */
  openSideNav() {
    this.setState({mobileSideNav: 'active'});
  }

  /**
   * Renders the side nav bar.
   *
   * @return {string} side navbar
   */
  sideNav() {
    return (
      <div className={"side-nav " + this.state.mobileSideNav}>
        <center>
          <img className="logo" alt="TORO logo" src={window.location.origin + "/img/white-vlogo.svg"} />
        </center>
        <nav>
          <ul className="side-nav-list">
            <li className="side-nav-item close-nav" onClick={this.closeSideNav}><i className="fa fa-times close-icon"></i>Close Navigation</li>
            {this.navigation()}
            <li className="side-nav-item" onClick={this.logout}>Log Out</li>
          </ul>
        </nav>
      </div>
    );
  }

  /**
   * Makes an API call to terminate the session, if the call was successful
   * the user is redirected to the login.
   *
   * @param  {event} e onClick event handler
   */
  logout(e) {
    e.preventDefault();
    axios.get(Api("tts", 1, "logout")).then(
      response => {
        if(response.data[0].logout) {
          window.location.href = "/login";
        }
      }
    );
  }

  /**
   * Renders the top nav with th User's name and membership tier
   *
   * @return {string} top nav
   */
  topNav(){
    return (
      <div className="page-body">
        <div className="top-nav tts">
          <div className="left">
            <span className="nav-open-button" onClick={this.openSideNav}><i className="fa fa-bars fw"></i></span>
            <div>
              <span className="welcome">Torochain Trading System</span>
              <span className="page-name">{this.state.pageName}</span>
            </div>
          </div>
          <div className="right">
            <div className="top-nav-icon">
            </div>
            <span className="user-name">
              {this.state.fullName}
            </span>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Renders the elements for the page wrapper. What is returned in this
   * lifecycle function, will be returned when this class is invoked in other
   * areas of the app. It will also redirect the user back to the login page
   * if th session_exists value is false. Also contains a function call interval
   * that calls the sessionValidator() every 15 minutes.
   *
   * @return {string} nav elements
   */
  render() {
    return (
      <div>
        {this.sideNav()}
        {this.topNav()}
      </div>
    );
  }
}
export default WithContext(Nav);
