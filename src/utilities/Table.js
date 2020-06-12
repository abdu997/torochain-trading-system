import React from 'react';
import NumberFormat from 'react-number-format';

import HeaderTab from './HeaderTab';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentWillMount() {
  }

  render(){
    return (
      <div className="table-responsive">
        <HeaderTab title={this.props.name} />
        <table className="table">
          <thead>
            {this.props.additionalHeader}
            <tr>
              {
                this.props.columnHeaders.map(
                  (header, index) => {
                    const key = this.props.columnKeys[index];
                    return (
                      <th className="pointer" key={index} onClick={
                        () =>{
                          this.setState(
                            {
                              tableSortKey: key,
                              tableSortOrder: (this.state.tableSortKey === key ? -this.state.tableSortOrder : 1)
                            }
                          )
                        }
                      }>
                        {header}
                        &nbsp;
                        &nbsp;
                        {
                          (
                            this.state.tableSortOrder === -1 &&
                            this.state.tableSortKey === key
                            ?
                            <i className="fa fa-sort-amount-asc"></i>
                            :
                            <i className="fa fa-sort-amount-desc"></i>
                          )
                        }
                      </th>
                    )
                  }
                )
              }
            </tr>
          </thead>
          <tbody>
            {
              this.props.data.sort(
                (a, b) => {
                  const x = a[this.state.tableSortKey];
                  const y = b[this.state.tableSortKey];
                  if(x < y){
                    return 1 * this.state.tableSortOrder;
                  } else {
                    return -1 * this.state.tableSortOrder;
                  }
                }
              ).map(
                (row, index) => {
                  return (
                    <tr key={index}>
                      {
                        this.props.columnKeys.map(
                          (key, index) => {
                            return (
                              <td
                                key={index}
                                className={key === "asset" || key === "symbol" ? "uppercase" : ""}
                              >
                                {
                                  (
                                    isNaN(row[key]) ?
                                    row[key] :
                                    <NumberFormat
                                      value={row[key]}
                                      displayType={'text'} thousandSeparator={true} suffix={(key === "weight"
                                      || key === "change" ? "%" : "")}
                                      prefix={(key.includes("price") ? "$" : "")}
                                    />
                                  )
                                }
                                {
                                  (
                                    key === "change" ?
                                    (
                                      <i className={"fa " + (row[key] > 0 ? "fa-chevron-up" : "fa-chevron-down") +
                                        (row[key] > 0 ? " profit" : " loss")
                                      }></i>
                                    )
                                    :
                                    ""
                                  )
                                }
                              </td>
                            )
                          }
                        )
                      }
                    </tr>
                  )
                }
              )
            }
            {
              (this.props.data.length === 0 ?
                <tr><td align="center" colSpan={this.props.columnHeaders.length}>No data</td></tr>
                :
                null
              )
            }
          </tbody>
          {this.props.foot}
        </table>
      </div>
    );
  }
}
export default Table;
