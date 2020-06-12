import React from 'react';

class HeaderTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render(){
    return (
      <div className="tab">
        <div className="tab-box">
          <p className="title capitalize">{this.props.title}</p>
        </div>
      </div>
    );
  }
}
export default HeaderTab;
