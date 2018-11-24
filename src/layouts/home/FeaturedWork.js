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
    const { vip, account, donate, web3, toggle, dark } = this.props;
    const modal = (
      <Modal open={this.state.open} onClose={this.toggle}>
        <h2 className={dark ? "dark-h" : ""}>Replace</h2>
        <p className={dark ? "dark-t" : ""}>Replace the featured piece!</p>
        <p className={dark ? "dark-t" : ""}>Your Account: {account}</p>
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
          <button onClick={this.toggle} className={dark ? "pure-button button-border dark-h dark-tt" : "pure-button button-border"}>
            Replace
          </button>
          {modal}{" "}
        </div>
      );
    } else {
      return (
        <div>
          <p className={dark ? "title dark-h" : "title"}>
            {vip.name}
          </p>
          <div className="frame">
            <a href={vip.link}>
              <img
                src={vip.thumbnail}
                alt={"Featured"}
                display="block"
                width="90%"
                height="auto"
								className={dark ? "featuredBorder dark-b" : "featuredBorder"}
              />
            </a>
            <p className={dark ? "des dark-h" : "des"}>{vip.description}</p>
          </div>
          <div className="top">
            <form className="inline">
              <input
								className={dark ? "dark-input" : ""}
                type="number"
                min="0"
                step="0.01"
                onChange={this.onChange}
              />
            </form>
            <button
							className={dark ? "pure-button inline send button-border dark-h dark-tt" : "pure-button inline send button-border"}
              onClick={() => donate(vip.address, this.state.amount)}
            >
              Send Ether
            </button>
          </div>

          <button onClick={this.toggle} className={dark ? "pure-button button-border dark-h dark-tt" : "pure-button button-border"}>
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
