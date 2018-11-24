import React, { Component } from "react";

export default class Gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: null
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({ amount: e.target.value });
  }

  render() {
    const { data, like, donate, galleryDone, dark } = this.props;
    if (!galleryDone) {
      return (
        <div>
          <img
            src={dark ? "https://i.imgur.com/AlDhHVy.gif" : "https://loading.io/spinners/flower/lg.peacock-flower-spinner.gif"}
            alt="loading gif"
            className="load"
          />
        </div>
      );
    }
    return (
      <table >
        <tbody>
          {data
            .filter(item => item.name)
            .map((item, i) => {
              return (
                <tr key={i}>
                  <td className={dark ? "dark-h dark-tt dark-ttt" : ""}>{item.name}</td>
                  <td className={dark ? "dark-h dark-tt dark-ttt" : ""}>
                    <a href={item.link}>
                      <img
                        src={item.thumbnail}
                        alt={"Image " + i}
                        display="block"
                        width="200px"
                        height="auto"
                      />
                    </a>
                  </td>
                  <td className={dark ? "dark-h dark-tt dark-ttt" : ""}>{item.description}</td>
                  <td className={dark ? "dark-h dark-tt dark-ttt" : ""}>
                    <div className="up">
                      <button
                        className={dark ? "btn size button-border dark-tt dark-h" : "btn size button-border"}
                        onClick={() => like(item.id)}
                      >
                        <i className="fa fa-caret-up" />
                      </button>
                      <div>{item.upvotes}</div>
                    </div>
                  </td>
                  <td className={dark ? "dark-h dark-tt dark-ttt" : ""}>
                    <form>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
												onChange={this.onChange}
												className={dark ? "dark-input" : ""}
                      />
                    </form>
                    <button
                      className={dark ? "pure-button button-border dark-h dark-tt" : "pure-button button-border lbb"}
                      onClick={() => donate(item.address, this.state.amount)}
                    >
                      Send Ether
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  }
}
