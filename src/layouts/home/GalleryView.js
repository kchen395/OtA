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
    const { data, like, donate, galleryDone } = this.props;
    if (!galleryDone) {
      return (
        <div>
          <img
            src="https://loading.io/spinners/flower/lg.peacock-flower-spinner.gif"
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
          .map(item => {
            return (
              <main className="bottom2">
                <p className="title2">{item.name}</p>
                <div className="frame">
                  <a href={item.link}>
                    <img
                      src={item.thumbnail}
                      alt={"Featured"}
                      display="block"
                      width="100%"
                      height="auto"
                      className="inline featuredBorder"
                    />
                  </a>
									<p className="des">{item.description}</p>
                </div>
                <div>
                </div>
                <table className="listTable center2 no smoke">
                    <tr className="white">
										<td>
                      <button
                        className="btn size"
                        onClick={() => like(item.id)}
                      >
                        <i className="fa fa-caret-up" />
                      </button>
                      <div>{item.upvotes}</div>
                    </td>
                    <td>
                      <form>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          onChange={this.onChange}
                        />
                      </form>
                      <button
                        className="pure-button"
                        onClick={() => donate(item.address, this.state.amount)}
                      >
                        Send Ether
                      </button>
                    </td>
										</tr>
                </table>
              </main>
            );
          })}
      </div>
    );
  }
}
