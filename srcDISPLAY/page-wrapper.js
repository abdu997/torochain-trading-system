import React from 'react';
import {Root} from './api-root';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';

/**
 * Renders the side nav and top nav and checks if a session exists.
 *
 * @extends React
 */
class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionApi: Root("prito", 1) + 'account/api/v1/getSession',
      logoutApi: Root("prito", 1) + 'account/api/v1/logout',
      page_name: '',
      mobile_side_nav: '',
      current_route: window.location.pathname,
      nav_pages: [
        {
          page_name: 'Buy Tokens',
          page_route: '/buytoken',
          icon: 'img/toro-icon.svg',
        },
        {
          page_name: 'My Profile',
          page_route: '/profile',
          icon: 'img/nav-profile.svg',
        },
        {
          page_name: 'Referral Link',
          page_route: '/referral',
          icon: 'img/nav-referral.svg',
        },
      ],
      session_info: {
        session_exists: true,
        full_name: "John Doe",
        token_amount: "457"
      },
      session_loaded: true,
    }
    this.closeSideNav = this.closeSideNav.bind(this);
    this.openSideNav = this.openSideNav.bind(this);
    this.logout = this.logout.bind(this);
    this.render = this.render.bind(this);
    this.navigation = this.navigation.bind(this);
  }

  /**
   * Contains a list of functions that will be called before render() is called.
   *
   */
  componentWillMount() {
    // this.sessionValidator();
  }

  /**
   * Makes a GET API call to see if a session exists, if a session does not
   * exist, the session_exists in the state is set to false. Otherwise, a
   * session info array is created and inserted into the sesson_info state.
   *
   */
  sessionValidator() {
    axios.get(this.state.sessionApi).then(
      response => {
        if(response.data[0].session_exists) {
          const session_info = {
            session_exists: true,
            full_name: response.data[0].first_name + ' ' + response.data[0].last_name,
            membership: response.data[0].tier,
            token_amount: parseFloat(response.data[0].token_quantity).toFixed(2),
          }
          this.setState({session_info: session_info, session_loaded: true})
        } else {
          const session_info = {
            session_exists: false
          };
          this.setState({session_info: session_info, session_loaded: true})
        }
      }
    ).catch(
      error => {
        const session_info = {
          session_exists: false
        };
        this.setState({session_info: session_info, session_loaded: true})
      }
    );
  }

  /**
   * The nav bar pages in the nav_pages state are looped and an element is
   * printed for each array. It also checks if the page route matches the route
   * of the looped page, if so, the element is marked as active.
   *
   * @return {string} Nav bar pages
   */
  navigation() {
    return this.state.nav_pages.map(page => {
      return (
        <div key={page.page_route}>
          <Link to={page.page_route}>
            <li className={"side-nav-item" + (this.state.current_route === page.page_route ? ' active' : '')}>
              <img src={page.icon} alt={page.page_name} className="nav-item-icon" />{page.page_name}
            </li>
          </Link>
        </div>
      )
    })
  }

  /**
   * Removes the active value of the mobile_side_nav state, to remove the active
   * class from the side nav to close the side nav when the screen width is
   * smaller than 992px.
   *
   */
  closeSideNav() {
    this.setState({mobile_side_nav: ''});
  }

  /**
   * Adds the active value in the mobile_side_nav state, to add the active
   * class from the side nav to open the side nav when the screen width is
   * smaller than 992px.
   *
   */
  openSideNav() {
    this.setState({mobile_side_nav: 'active'});
  }

  /**
   * Renders the side nav bar.
   *
   * @return {string} side navbar
   */
  sideNav() {
    return (
      <div className={"side-nav " + this.state.mobile_side_nav}>
        <center>
          <img className="logo" alt="TORO logo" src="img/white-vlogo.svg" />
        </center>
        <table className="token-count">
          <tbody>
            <tr>
              <td className="token-icon"><img className="token-icon" alt="TORO coin" src="img/toro-icon.svg" /></td>
              <td>
                <span className="token-quantity">{this.state.session_info.token_amount}</span>
                <span className="token-title">TORO Tokens</span>
              </td>
            </tr>
          </tbody>
        </table>
        <nav>
          <ul className="side-nav-list">
            <li className="side-nav-item close-nav" onClick={this.closeSideNav}><i className="fa fa-times close-icon"></i>Close Navigation</li>
            {this.navigation()}
            <li className="side-nav-item" onClick={this.logout}><img src="img/nav-logout.svg" alt="logout icon" className="nav-item-icon" />Log Out</li>
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
    axios.get(this.state.logoutApi).then(
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
        <div className="top-nav">
          <div className="left">
            <span className="nav-open-button" onClick={this.openSideNav}><i className="fa fa-bars fw"></i></span>
            <div>
              <span className="welcome">Welcome to The Torochain Platform</span>
              <span className="page-name">{this.props.pageName}</span>
            </div>
          </div>
          <div className="right">
            <div className="top-nav-icon">
              <span className="icon"><i className="fa fa-bell-o fw"></i></span>
              <span className="icon"><i className="fa fa-envelope-o fw"></i></span>
            </div>
            <span className="user-name">
              {this.state.session_info.full_name}
              {/* <small className="member-type">{this.state.session_info.membership}</small> */}
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
    if(this.state.session_loaded) {
      if(this.state.session_info.session_exists) {
        setInterval(this.sessionValidator, 15 * 60 * 1000);
        return (
          <div>
            {this.sideNav()}
            {this.topNav()}
          </div>
        );
      } else {
        return (
          <Redirect to="/login" />
        )
      }
    } else {
      return(
        <div className="loader-backgroud">
          <div className="loader"></div>
        </div>
      );
    }
  }
}
export default Nav;
