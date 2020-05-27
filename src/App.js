import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import DonationModal from "./components/donationModal";
import SentryBoundary from "./components/sentry";
import * as Sentry from "@sentry/browser";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Footer from "./components/footer";
import Header from "./components/header";
import Charts from "./components/charts";

class App extends Component {
  state = {
    modalShow: false,
  };

  componentDidMount() {
    this.setState({ didMount: true });
    Sentry.init({
      dsn:
        "https://4b8b4e3c16ae4e188b6112c866225b20@o260704.ingest.sentry.io/1457664",
    });
  }

  showModal = () => {
    this.setState({
      modalShow: true,
    });
  };

  hideModal = () => {
    this.setState({
      modalShow: false,
    });
  };

  render() {
    const { modalShow } = this.state;
    return (
      <React.Fragment>
        <SentryBoundary>
          <ToastContainer />
          <div
            style={{
              position: "absolute",
              width: "100%",
              minHeight: "100vh",
            }}
          >
            <DonationModal modalShow={modalShow} hideModal={this.hideModal} />
            <Header />
            <main role="main">
              <Charts didMount={this.state.didMount} />
            </main>
          </div>
          <Footer raiseShowModal={this.showModal} />
        </SentryBoundary>
      </React.Fragment>
    );
  }
}

export default App;
