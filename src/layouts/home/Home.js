import React, { Component } from "react";
import Gallery from "./Gallery.js";
import GalleryView from "./GalleryView.js";
import FeaturedWork from "./FeaturedWork.js";
import ContractForm from "./ContractForm.js";
import PropTypes from "prop-types";
import getWeb3 from "../../util/web3/getWeb3.js";
import Modal from "react-responsive-modal";

let web3;

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
      toggle: true,
      view: true,
      dark: false
    };
    this.contracts = context.drizzle.contracts;
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.getData = this.getData.bind(this);
    this.donate = this.donate.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.dataHelper = this.dataHelper.bind(this);
    this.vipCheck = this.vipCheck.bind(this);
    this.toggle = this.toggle.bind(this);
    this.refresh = this.refresh.bind(this);
    this.handleView = this.handleView.bind(this);
    this.toggleDark = this.toggleDark.bind(this);
  }

  async handleClick() {
    await this.setState({ length: this.state.length + 10, galleryDone: false });
    await this.getData(this.state.type);
  }

  async refresh() {
    await this.setState({ done: false });
    await this.getData(this.state.type);
  }

  async handleChange(e) {
    let val = e.target.value;
    await this.setState({ type: val, length: 10, galleryDone: false });
    await this.getData(val);
  }

  handleView() {
    this.setState({ view: !this.state.view });
  }

  vipCheck() {
    this.setState({ vipCheck: true });
  }

  async handleLike(id) {
    await this.setState({ galleryDone: false });
    await this.contracts.TopArt.methods
      .like(id)
      .send()
      .then(() => this.getData(this.state.type))
      .catch(error => {
        console.log(error.message);
        this.setState({ galleryDone: true });
      });
  }

  toggleModal() {
    this.setState({ open: !this.state.open });
  }

  toggleDark() {
    this.setState({ dark: !this.state.dark });
  }

  toggle() {
    this.setState({ toggle: !this.state.toggle });
  }

  donate(receiver, amount) {
    web3.eth.sendTransaction({
      from: this.state.account,
      to: receiver,
      value: web3.utils.toWei(amount)
    });
  }

  async componentDidMount() {
    await getWeb3.then(res => {
      web3 = res.payload.web3Instance;
    });
    await this.contracts.TopArt.methods
      .counter()
      .call()
      .then(async total => {
        let accounts = await web3.eth.getAccounts();
        this.setState({ total: total - 2, account: accounts[0] });
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
          this.contracts.TopArt.methods
            .counter()
            .call()
            .then(total => {
              this.setState({ total: total - 1 });
            })
            .catch(error => console.log(error.message));
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
        } else {
          this.contracts.TopArt.methods
            .counter()
            .call()
            .then(total => {
              this.setState({ total: total - 2 });
            })
            .catch(error => console.log(error.message));
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
        <main
          className={this.state.dark ? "container2 dark" : "container light"}
        >
          <div className="pure-g">
            <div className="pure-u-1-1 header">
              <h1 className={this.state.dark ? "loading dark-h" : "loading"}>OtA</h1>
              <h4 className={this.state.dark ? "loading2 dark-t" : "loading2"}>Decentralized Art Gallery</h4>
              <div>
                <img
                  src={this.state.dark ? "https://i.imgur.com/PPC6eK8.gif" : "https://loading.io/spinners/ellipsis/lg.discuss-ellipsis-preloader.gif"}
                  alt="loading gif"
                  className="load"
                />
              </div>
            </div>
          </div>
        </main>
      );
    }
    return (
      <main className={this.state.dark ? "container dark" : "container light"}>
        <div className={this.state.dark ? "dark-t" : ""}>
          <Modal open={this.state.open} onClose={this.toggleModal}>
            <h2 className={this.state.dark ? "dark-h" : ""}>Submit Form</h2>
            <p className={this.state.dark ? "dark-t" : ""}>
              Add your art to the Ethereum blockchain!
            </p>
            <p className={this.state.dark ? "dark-t" : ""}>
              Your Account: {this.state.account}
            </p>
            <ContractForm
              contract="TopArt"
              method="add"
              labels={["title", "thumbnail url", "link url", "caption"]}
            />
          </Modal>
        </div>
        <div className={"pure-g " + (this.state.dark ? "dark" : "")}>
          <button
            onClick={this.refresh}
            className={
              this.state.dark
                ? "pure-button smoke refresh dark dark-t"
                : "pure-button smoke refresh light-blue"
            }
          >
            <i className="fas fa-redo" />
          </button>
          <button
            onClick={this.toggleDark}
            className={
              this.state.dark
                ? "pure-button smoke refresh right dark dark-t"
                : "pure-button smoke refresh right light-blue"
            }
          >
            {this.state.dark ? (
              <i className="fas fa-moon" />
            ) : (
              <i className="far fa-moon" />
            )}{" "}
          </button>
          <div
            className={"pure-u-1-1 header " + (this.state.dark ? "dark" : "")}
          >
            <h1 className={this.state.dark ? "dark-h" : ""}>OtA</h1>
            <h4 className={this.state.dark ? "dark-t" : ""}>
              Decentralized Art Gallery
            </h4>
            <h4 className={this.state.dark ? "dark-t" : ""}>
              Ethereum Storing {this.state.total + 1} {phrase} of Art
            </h4>
          </div>

          <div className="pure-u-1-1 header">
            <div>
              <h2 className={"inline " + (this.state.dark ? "dark-h" : "")}>
                Featured
              </h2>
              <button
                onClick={this.toggle}
                className={
                  this.state.dark
                    ? "toggle pure-button smoke inline dark dark-t"
                    : "toggle pure-button smoke inline light-blue"
                }
              >
                {this.state.toggle ? (
                  <i className="fa fa-toggle-on" />
                ) : (
                  <i className="fa fa-toggle-off" />
                )}
              </button>
            </div>
            <FeaturedWork
              vip={this.state.vip}
              account={this.state.account}
              donate={this.donate}
              web3={web3}
              toggle={this.state.toggle}
              dark={this.state.dark}
            />
          </div>

          <div className="pure-u-1-1">
            <h2 className={this.state.dark ? "title dark-h" : "title"}>
              Gallery
            </h2>
            <br />
            <div className="bottom">
              <div className="inline">
                <select
                  onChange={this.handleChange}
                  className={this.state.dark ? "dark-input" : ""}
                >
                  <option value={"recent"}>Most Recent</option>
                  <option value={"popular"}>Most Popular</option>
                </select>
              </div>
              <div className="inline selector">
                <select
                  onChange={this.handleView}
                  className={this.state.dark ? "dark-input" : ""}
                >
                  <option>List</option>
                  <option>Grid</option>
                </select>
              </div>
            </div>
            <br />
            {this.state.view ? (
              <div className="pure-u-1-1 header">
                <GalleryView
                  data={this.state.data}
                  like={this.handleLike}
                  donate={this.donate}
                  galleryDone={this.state.galleryDone}
                  dark={this.state.dark}
                />
              </div>
            ) : (
              <Gallery
                data={this.state.data}
                like={this.handleLike}
                donate={this.donate}
                galleryDone={this.state.galleryDone}
                dark={this.state.dark}
              />
            )}

            <br />
            <div>
              <button
                onClick={this.handleClick}
                className={
                  this.state.dark
                    ? "btn button-border dark-h dark-tt"
                    : "btn button-border"
                }
              >
                Show More
              </button>
            </div>
            <div className="header">
              <button
                onClick={this.toggleModal}
                className={
                  this.state.dark
                    ? "pure-button button-border dark-h dark-tt"
                    : "pure-button button-border"
                }
              >
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
