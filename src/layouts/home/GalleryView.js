import React, { Component } from "react";

export default class GalleryView extends Component {
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
            src={dark ? "https://imgur.com/AlDhHVy.gif" : "https://loading.io/spinners/flower/lg.peacock-flower-spinner.gif"}
            alt="loading gif"
            className="load"
          />
        </div>
      );
    }
    return (
      <div className="center width">
        {data
          .filter(item => item.name)
          .map((item, i) => {
            return (
              <main className="bottom2" key={i}>
                <p className={dark ? "title2 dark-h" : "title 2"}>
                  {item.name}
                </p>
                <div className="frame">
                  <a href={item.link}>
                    <img
                      src={item.thumbnail}
                      alt={"Featured"}
                      display="block"
                      width="90%"
                      height="auto"
                      className={
                        dark ? "featuredBorder inline dark-b" : "featuredBorder"
                      }
                    />
                  </a>
                  <p className={dark ? "des dark-h" : "des"}>
                    {item.description}
                  </p>
                </div>
                <table className="listTable smoke">
                  <tbody>
									<tr className="white">
                    <td className={dark ? "dark-tt dark-ttt" : ""}>
                      <div className="up">
                        <button
                          className={
                            dark
                              ? "btn button-border size dark-tt"
                              : "btn button-border size"
                          }
                          onClick={() => like(item.id)}
                        >
                          <i
                            className={
                              dark ? "fa fa-caret-up dark-h" : "fa fa-caret-up"
                            }
                          />
                        </button>
                        <div className={dark ? "dark-h" : ""}>
                          {item.upvotes}
                        </div>
                      </div>
                    </td>
                    <td className={dark ? "dark-tt dark-ttt" : ""}>
                      <form>
                        <input
                          className={dark ? "dark-input" : ""}
                          type="number"
                          min="0"
                          step="0.01"
                          onChange={this.onChange}
                        />
                      </form>
                      <button
                        className={
                          dark
                            ? "pure-button button-border dark-tt dark-h"
                            : "pure-button button-border"
                        }
                        onClick={() => donate(item.address, this.state.amount)}
                      >
                        Send Ether
                      </button>
                    </td>
                  </tr>
									</tbody>
                </table>
              </main>
            );
          })}
      </div>
    );
  }
}
