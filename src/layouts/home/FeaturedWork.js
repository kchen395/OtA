import React, { Component } from "react";
import ContractForm from "./ContractForm.js";
import PropTypes from "prop-types";
import Modal from "react-responsive-modal";

class FeaturedWork extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      amount: null
    };
    this.toggle = this.toggle.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  toggle() {
    this.setState({ open: !this.state.open });
  }

  onChange(e) {
    this.setState({ amount: e.target.value });
  }

  render() {
    const { vip, account, donate, web3, toggle } = this.props;
    const modal = (
      <Modal open={this.state.open} onClose={this.toggle}>
        <h2>Replace</h2>
        <p>Replace the featured piece!</p>
        <p>Your Account: {account}</p>
        <ContractForm
          contract="TopArt"
          method="addVip"
          labels={["title", "thumbnail url", "link url", "caption"]}
          methodArgs={[
            {
              from: account,
              value: web3.utils.toWei("1", "ether"),
              data: "Test"
            }
          ]}
        />
      </Modal>
    );

    if (vip === null || !toggle) {
      return (
        <div>
          <button onClick={this.toggle} className="pure-button button-border">
            Replace
          </button>
          {modal}{" "}
        </div>
      );
    } else {
      return (
        <div>
          <p className="title">{vip.name}</p>
          <div className="frame">
            <a href={vip.link}>
              <img
                src={vip.thumbnail}
                alt={"Featured"}
                display="block"
                width="100%"
                height="auto"
                className="featuredBorder"
              />
            </a>
            <p className="des">{vip.description}</p>
          </div>
          <div className="top">
            <form className="inline">
              <input
                type="number"
                min="0"
                step="0.01"
                onChange={this.onChange}
              />
            </form>
            <button
              className="pure-button inline send button-border"
              onClick={() => donate(vip.address, this.state.amount)}
            >
              Send Ether
            </button>
          </div>

          <button onClick={this.toggle} className="pure-button button-border">
            Replace
          </button>

          {modal}
        </div>
      );
    }
  }
}

FeaturedWork.contextTypes = {
  drizzle: PropTypes.object
};

export default FeaturedWork;
