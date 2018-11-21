import React, { Component } from "react";
import Gallery from "./Gallery.js"
import {
  AccountData,
  // ContractData,
  ContractForm
} from "drizzle-react-components";
import PropTypes from "prop-types";

class Home extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      length: 10,
      value: null,
      data: [],
      total: null,
      type: "recent"
    };
    this.contracts = context.drizzle.contracts;
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLike = this.handleLike.bind(this);
    this.getData = this.getData.bind(this);
  }

  handleClick() {
    this.setState({ length: this.state.length + 100 });
    this.getData(this.state.type);
  }

  handleChange(e) {
    this.setState({ type: e.target.value });
    this.getData(e.target.value);
  }

  handleLike(id) {
    this.contracts.TopArt.methods
      .like(id)
      .send()
      .then(() => this.getData(this.state.type))
      .catch(error => console.log(error.message));
  }

  componentDidMount() {
    this.contracts.TopArt.methods
      .getCounter()
      .call()
      .then(total => {
        this.setState({ total: total - 1 });
        this.getData(this.state.type);
      })
      .catch(error => console.log(error.message));
  }

  getData(type) {
    this.setState({ data: [] });
    let total = this.state.total;
    let counter = 0;

    if (type === "recent") {
      for (let i = total; i >= 0; i--) {
        if (counter > this.state.length) break;
        counter++;
        let nProm = this.contracts.TopArt.methods.getName(i).call();
        let tProm = this.contracts.TopArt.methods.getThumbnail(i).call();
        let lProm = this.contracts.TopArt.methods.getLink(i).call();
        let dProm = this.contracts.TopArt.methods.getDescription(i).call();
        let uProm = this.contracts.TopArt.methods.getUpvotes(i).call();
				let aProm = this.contracts.TopArt.methods.getAddress(i).call();
        Promise.all([nProm, tProm, lProm, dProm, uProm, aProm])
          .then(value => {
						let entry = {
							name: value[0],
							thumbnail: value[1],
							link: value[2],
							description: value[3],
							upvotes: value[4],
							address: value[5],
							id: i
						}
            this.setState({
              data: [
                ...this.state.data,
                entry
              ]
            });
          })
          .catch(error => {
            console.log(error.message);
          });
			}
			
    } else if (type === "popular") {
      for (let i = total; i >= 0; i--) {
        let nProm = this.contracts.TopArt.methods.getName(i).call();
        let tProm = this.contracts.TopArt.methods.getThumbnail(i).call();
        let lProm = this.contracts.TopArt.methods.getLink(i).call();
        let dProm = this.contracts.TopArt.methods.getDescription(i).call();
				let uProm = this.contracts.TopArt.methods.getUpvotes(i).call();
				let aProm = this.contracts.TopArt.methods.getAddress(i).call();
        Promise.all([nProm, tProm, lProm, dProm, uProm, aProm])
          .then(value => {
						let entry = {
							name: value[0],
							thumbnail: value[1],
							link: value[2],
							description: value[3],
							upvotes: value[4],
							address: value[5],
							id: i
						}
            this.setState({
              data: [
                ...this.state.data,
                entry
              ]
            });
					})
					.then(() => {
						this.setState({data: this.state.data.sort((a, b) => b.upvotes - a.upvotes)})
					})
          .catch(error => {
            console.log(error.message);
          });
      }
    }
  }

  render() {
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1 header">
            <h1>OtA</h1>
            <h4>Total Works: {this.state.total}</h4>
            <br />
          </div>

          <div className="pure-u-1-1">
            <h2>Your Account</h2>
            <AccountData accountIndex="0" units="ether" precision="3" />
          </div>

          <div className="pure-u-1-1">
            <h2>Submit</h2>
            <p>Add your art to the blockchain!</p>
            <ContractForm
              contract="TopArt"
              method="add"
              labels={["title", "thumbnail url", "link url", "description"]}
            />

            <h2>Gallery</h2>
            <div>
              <select onChange={this.handleChange}>
                <option value={"recent"}>Most Recent</option>
                <option value={"popular"}>Most Popular</option>
              </select>
            </div>
            <br />
						<Gallery data={this.state.data}/>
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
