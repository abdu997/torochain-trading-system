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
   * Builds the NoticeBox by concatenating values from the Message props.
   * Inserts the status and message of the array into the element.
   *
   * @return {string} NoticeBox
   */
  render() {
    if(this.props.Message){
      var icon;
      if(this.props.Message.status === "error"){
        icon = "fa-times-circle";
      } else if(this.props.Message.status === "alert"){
        icon = "fa fa-exclamation-circle";
      } else {
        icon = "fa fa-check-circle";
      }
      return (
        <div className="notice-box full-width">
          <table>
            <tbody>
              <tr>
                <td>
                  <i className={"fa notice-icon " + icon}></i>
                </td>
                <td className="notice-message">
                  {this.props.Message.message}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div>
        </div>
      );
    }
  }
}
export default NoticeBox;
