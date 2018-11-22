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
    const { data, like, donate, galleryDone } = this.props;
    if (!galleryDone) {
      return (
        <div>
          <img
            src="https://loading.io/spinners/flower/lg.peacock-flower-spinner.gif"
            alt="loading gif"
            className="center"
          />
        </div>
      );
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Work</th>
            <th>Description</th>
            <th>Upvotes</th>
            <th>Support Artist</th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter(item => item.name)
            .map((item, i) => {
              return (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>
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
                  <td>{item.description}</td>
                  <td>
                    <button className="btn" onClick={() => like(item.id)}>
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
              );
            })}
        </tbody>
      </table>
    );
  }
}
