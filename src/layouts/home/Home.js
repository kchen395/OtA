import React, { Component } from "react";
import Gallery from "./Gallery.js";
import { ContractForm } from "drizzle-react-components";
import PropTypes from "prop-types";
import Web3 from "web3";
import Modal from "react-responsive-modal";

let web3;
if (!window.web3) {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
} else {
  web3 = new Web3(window.web3.currentProvider);
}

class Home extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      length: 10,
      value: null,
      data: [],
      total: null,
      type: "recent",
      account: null,
      open: false,
      done: false
    };
    this.contracts = context.drizzle.contracts;
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.getData = this.getData.bind(this);
    this.donate = this.donate.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  async handleClick() {
    await this.setState({ length: this.state.length + 10 });
    await this.getData(this.state.type);
  }

  handleChange(e) {
    this.setState({ type: e.target.value, done: false });
    this.getData(e.target.value);
  }

  handleLike(id) {
    this.contracts.TopArt.methods
      .like(id)
      .send()
      .then(() => this.getData(this.state.type))
      .catch(error => console.log(error.message));
  }

  openModal() {
    this.setState({ open: true });
  }

  closeModal() {
    this.setState({ open: false });
  }

  donate(receiver, amount) {
    web3.eth.sendTransaction({
      from: this.state.account,
      to: receiver,
      value: web3.utils.toWei(amount)
    });
  }

  componentDidMount() {
    this.contracts.TopArt.methods
      .getCounter()
      .call()
      .then(async total => {
        let accounts = await web3.eth.getAccounts();
        this.setState({ total: total - 1, account: accounts[0] });
        this.getData(this.state.type);
      })
      .catch(error => console.log(error.message));
  }

  getData(type) {
    this.setState({ data: [] });
    let total = this.state.total;

    if (type === "recent") {
			(async () => {
        for (let i = total; i >= 0; i--) {
          await dataHelper(this, i);
        }
        this.setState({
          done: true
        });
      })();
    } else if (type === "popular") {
      (async () => {
        for (let i = total; i >= 0; i--) {
          await dataHelper(this, i);
        }
        this.setState({
          data: this.state.data
            .sort((a, b) => b.upvotes - a.upvotes)
            .slice(0, this.state.length),
          done: true
        });
      })();
    }
  }

  render() {
    let phrase = "Works";
    if (this.state.total === 1) {
      phrase = "Work";
    }
    return (
      <main className="container">
        <div>
          <button onClick={this.openModal} className="pure-button">
            Submit
          </button>
          <Modal open={this.state.open} onClose={this.closeModal} center>
            <h2>Submit Form</h2>
            <p>Add your art to the Ethereum blockchain!</p>
            <p>Your Account: {this.state.account}</p>
            <ContractForm
              contract="TopArt"
              method="add"
              labels={["title", "thumbnail url", "link url", "description"]}
            />
          </Modal>
        </div>

        <div className="pure-g">
          <div className="pure-u-1-1 header">
            <h1>OtA</h1>
            <p>Decentralized Art Gallery</p>
            <p>
              Ethereum Storing {this.state.total} {phrase} of Art
            </p>
          </div>

          <div className="pure-u-1-1">
            <h2>Gallery</h2>

            <div>
              <select onChange={this.handleChange}>
                <option value={"recent"}>Most Recent</option>
                <option value={"popular"}>Most Popular</option>
              </select>
            </div>
            <br />
            <Gallery
              data={this.state.data}
              like={this.handleLike}
              donate={this.donate}
              done={this.state.done}
            />
            <br />

            <div>
              <button onClick={this.handleClick} className="btn">
                Show More
              </button>
            </div>
            <br />
            <br />
          </div>
        </div>
      </main>
    );
  }
}

Home.contextTypes = {
  drizzle: PropTypes.object
};

function dataHelper(that, i) {
  let nProm = that.contracts.TopArt.methods.getName(i).call();
  let tProm = that.contracts.TopArt.methods.getThumbnail(i).call();
  let lProm = that.contracts.TopArt.methods.getLink(i).call();
  let dProm = that.contracts.TopArt.methods.getDescription(i).call();
  let uProm = that.contracts.TopArt.methods.getUpvotes(i).call();
  let aProm = that.contracts.TopArt.methods.getAddress(i).call();
  return Promise.all([nProm, tProm, lProm, dProm, uProm, aProm]).then(value => {
    let entry = {
      name: value[0],
      thumbnail: value[1],
      link: value[2],
      description: value[3],
      upvotes: value[4],
      address: value[5],
      id: i
    };
    that.setState({
      data: [...that.state.data, entry]
    });
  });
}

export default Home;
