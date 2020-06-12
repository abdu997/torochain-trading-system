import React from 'react';

/**
 * Renders the NoticeBox element to be used through out the app.
 *
 * @extends React
 */
class NoticeBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  /**
   * Builds the NoticeBox by concatenating values from the Array props.
   * Inserts the status and message of the array into the element.
   *
   * @param {string} this.props.Array
   * @return {string} NoticeBox
   */
  render() {
    return (
      <div className="notice-box">
        <table>
          <tbody>
            <tr>
              <td>
                <i className={"fa notice-icon " + (this.props.Array.status === "error" ? "fa-times-circle" : "fa-check-circle")}></i>
              </td>
              <td className="notice-message">
                {this.props.Array.message}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
export default NoticeBox;
