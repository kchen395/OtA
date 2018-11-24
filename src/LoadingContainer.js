import { drizzleConnect } from "drizzle-react";
import React, { Children, Component } from "react";
import PropTypes from "prop-types";

class LoadingContainer extends Component {
  render() {
    if (this.props.drizzleStatus.initialized) {
      return Children.only(this.props.children);
    }
    if (this.props.loadingComp) {
      return this.props.loadingComp;
    }
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1 header">
            <h1 className="loading3">Connecting to Ethereum</h1>
            <div>
              <img
                src="https://loading.io/spinners/ellipsis/lg.discuss-ellipsis-preloader.gif"
                alt="loading gif"
                className="load"
              />
            </div>
          </div>
        </div>
      </main>
    );
  }
}

LoadingContainer.contextTypes = {
  drizzle: PropTypes.object
};

const mapStateToProps = state => {
  return {
    accounts: state.accounts,
    drizzleStatus: state.drizzleStatus,
    web3: state.web3
  };
};
export default drizzleConnect(LoadingContainer, mapStateToProps);
