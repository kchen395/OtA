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
			galleryDone: false,
      vip: null,
			toggle: true
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
		this.toggle = this.toggle.bind(this);
  }

  async handleClick() {
    await this.setState({ length: this.state.length + 10, galleryDone: false });
    await this.getData(this.state.type);
  }

  async handleChange(e) {
    let val = e.target.value;
    await this.setState({ type: val, length: 10, galleryDone: false });
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
	
	toggle() {
		this.setState({toggle: !this.state.toggle})
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
      .counter()
      .call()
      .then(async total => {
        let accounts = await web3.eth.getAccounts();
        this.setState({ total: total - 2, account: accounts[0]});
        this.getData(this.state.type);
      })
      .catch(error => console.log(error.message));
  }

  getData(type) {
    this.setState({ data: [] });
    let total = this.state.total;
    if (type === "recent") {
      (async () => {
        let counter = await this.contracts.TopArt.methods
          .counter()
          .call()
          .then(count => count)
          .catch(error => console.log(error.message));
        for (let i = this.state.length; i > 0; i--) {
          if (counter === 0) break;
          await this.dataHelper(counter--);
        }
        this.setState({
					done: true,
					galleryDone: true
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
					done: true,
					galleryDone: true
        });
      })();
    }
    this.contracts.TopArt.methods
      .vip()
      .call()
      .then(bool => {
        if (bool) {
          if (bool && this.state.vip === null) {
            this.setState({ total: this.state.total + 1 });
          }
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
    if (!this.state.done) {
      return (
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1 header">
              <h1>OtA</h1>
              <h4>Decentralized Art Gallery</h4>
              <div>
                <img
                  src="https://loading.io/spinners/ellipsis/lg.discuss-ellipsis-preloader.gif"
                  alt="loading gif"
                  className="center"
                />
              </div>
            </div>
          </div>
        </main>
      );
    }
    return (
      <main className="container">
        <div>
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
            <h4>Decentralized Art Gallery</h4>
            <h4>
              Ethereum Storing {this.state.total + 1} {phrase} of Art
            </h4>
          </div>

          <div className="pure-u-1-1 header">
					<div>
					<h2 className="inline">Featured</h2>
						<button onClick={this.toggle} className="toggle pure-button smoke inline">{this.state.toggle ? <i className="fa fa-toggle-on"></i> : <i className="fa fa-toggle-off"></i>}</button>

					</div>
            <FeaturedWork
              vip={this.state.vip}
              account={this.state.account}
              donate={this.donate}
							web3={web3}
							toggle={this.state.toggle}
            />
          </div>

          <div className="pure-u-1-1">
            <h2>Gallery</h2>
            <br />

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
							galleryDone={this.state.galleryDone}
            />

            <br />

            <div>
              <button onClick={this.handleClick} className="btn">
                Show More
              </button>
            </div>
            <div className="header">
              <button onClick={this.openModal} className="pure-button">
                Submit
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
