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
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  openModal() {
    this.setState({ open: true });
  }

  closeModal() {
    this.setState({ open: false });
  }

  onChange(e) {
    this.setState({ amount: e.target.value });
  }

  render() {
    const { vip, account, donate, web3, toggle } = this.props;
    if (vip === null || !toggle) {
      return (
        <div>
          <button onClick={this.openModal} className="pure-button">
            Replace
          </button>
          <Modal open={this.state.open} onClose={this.closeModal}>
            <h2>Replace</h2>
            <p>Replace the featured piece!</p>
            <p>Your Account: {account}</p>
            <ContractForm
              contract="TopArt"
              method="addVip"
              labels={["title", "thumbnail url", "link url", "description"]}
              methodArgs={[
                {
                  from: account,
                  value: web3.utils.toWei("1", "ether"),
                  data: "Test"
                }
              ]}
            />
          </Modal>
        </div>
      );
    } else {
      return (
        <div>
          <p className="title">{vip.name}</p>
          <div>
            <a href={vip.link}>
              <img
                src={vip.thumbnail}
                alt={"Featured"}
                display="block"
                width="70%"
                height="auto"
              />
            </a>
          </div>
          <div>
            <p>{vip.description}</p>
          </div>
          <div>
            <form className="inline">
              <input
                type="number"
                min="0"
                step="0.01"
                onChange={this.onChange}
              />
            </form>
            <button
              className="pure-button inline send"
              onClick={() => donate(vip.address, this.state.amount)}
            >
              Send Ether
            </button>
          </div>

          <button onClick={this.openModal} className="pure-button">
            Replace
          </button>

          <Modal open={this.state.open} onClose={this.closeModal}>
            <h2>Replace</h2>
            <p>Replace the featured piece!</p>
            <p>Your Account: {account}</p>
            <ContractForm
              contract="TopArt"
              method="addVip"
              labels={["title", "thumbnail url", "link url", "description"]}
              methodArgs={[
                {
                  from: account,
                  value: web3.utils.toWei("1", "ether"),
                  data: "Test"
                }
              ]}
            />
          </Modal>
        </div>
      );
    }
  }
}

FeaturedWork.contextTypes = {
  drizzle: PropTypes.object
};

export default FeaturedWork;
