import React, { Component } from "react";
import Gallery from "./Gallery.js";
import FeaturedWork from "./FeaturedWork.js";
import ContractForm from "./ContractForm.js";
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
      done: false,
      vip: {
        name: "Childish Gambino - Feels Like Summer",
        thumbnail: "https://i.ytimg.com/vi/F1B9Fk_SgI0/maxresdefault.jpg",
        link: "https://www.youtube.com/watch?v=F1B9Fk_SgI0",
        description:
          "Unique music video depicting recent rap stars and hip-hop icons",
        address: "0x9C4C5497ba4EB915689bf4aF0A4C94980429Ec28",
        id: -1
      }
    };
    this.contracts = context.drizzle.contracts;
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.getData = this.getData.bind(this);
    this.donate = this.donate.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.dataHelper = this.dataHelper.bind(this);
    this.vipCheck = this.vipCheck.bind(this);
  }

  async handleClick() {
    await this.setState({ length: this.state.length + 10 });
    await this.getData(this.state.type);
  }

  async handleChange(e) {
    let val = e.target.value;
    await this.setState({ type: val, done: false, length: 10 });
    await this.getData(val);
  }

  vipCheck() {
    this.setState({ vipCheck: true });
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
        for (let i = this.state.length; i > 0; i--) {
          if (total === 0) break;
          await this.dataHelper(total--);
        }
        this.setState({
          done: true
        });
      })();
    } else if (type === "popular") {
      (async () => {
        for (let i = total; i > 0; i--) {
          await this.dataHelper(i);
        }
        this.setState({
          data: this.state.data
            .sort((a, b) => b.upvotes - a.upvotes)
            .slice(0, this.state.length),
          done: true
        });
      })();
    }
    this.contracts.TopArt.methods
      .getVip()
      .call()
      .then(bool => {
        if (bool) {
          let nProm = this.contracts.TopArt.methods.getName(0).call();
          let tProm = this.contracts.TopArt.methods.getThumbnail(0).call();
          let lProm = this.contracts.TopArt.methods.getLink(0).call();
          let dProm = this.contracts.TopArt.methods.getDescription(0).call();
          let aProm = this.contracts.TopArt.methods.getAddress(0).call();
          return Promise.all([nProm, tProm, lProm, dProm, aProm]).then(
            value => {
              let entry = {
                name: value[0],
                thumbnail: value[1],
                link: value[2],
                description: value[3],
                address: value[4],
                id: 0
              };
              this.setState({
                vip: entry
              });
            }
          );
        }
      });
  }

  dataHelper(i) {
    let nProm = this.contracts.TopArt.methods.getName(i).call();
    let tProm = this.contracts.TopArt.methods.getThumbnail(i).call();
    let lProm = this.contracts.TopArt.methods.getLink(i).call();
    let dProm = this.contracts.TopArt.methods.getDescription(i).call();
    let uProm = this.contracts.TopArt.methods.getUpvotes(i).call();
    let aProm = this.contracts.TopArt.methods.getAddress(i).call();
    return Promise.all([nProm, tProm, lProm, dProm, uProm, aProm]).then(
      value => {
        let entry = {
          name: value[0],
          thumbnail: value[1],
          link: value[2],
          description: value[3],
          upvotes: value[4],
          address: value[5],
          id: i
        };
        this.setState({
          data: [...this.state.data, entry]
        });
      }
    );
  }

  render() {
    let phrase = "Works";
    if (this.state.total === 0) {
      phrase = "Work";
    }
    return (
      <main className="container">
        <div>
          <button onClick={this.openModal} className="pure-button">
            Submit
          </button>
          <Modal open={this.state.open} onClose={this.closeModal}>
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
              Ethereum Storing {this.state.total + 1} {phrase} of Art
            </p>
          </div>

          <div className="pure-u-1-1 header">
            <h2>Featured</h2>
            <FeaturedWork
              vip={this.state.vip}
              account={this.state.account}
              donate={this.donate}
              web3={web3}
            />
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

export default Home;
