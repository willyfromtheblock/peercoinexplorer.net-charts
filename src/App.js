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
import PerformanceModal from "./components/performanceModal";

class App extends Component {
  state = {
    modalShow: false,
    performanceChoice: null,
    performanceCallBack: undefined,
  };

  componentDidMount() {
    this.setState({ didMount: true });
    Sentry.init({
      dsn:
        "https://4b8b4e3c16ae4e188b6112c866225b20@o260704.ingest.sentry.io/1457664",
    });
  }

  toggleModal = (type) => {
    this.setState({
      modalShow: !this.state.modalShow,
      modalType: type,
    });
  };

  handlePerformanceCheck = (performanceCallBack) => {
    const { performanceChoice } = this.state;
    if (performanceChoice === null) {
      this.setState({ performanceCallBack }, () =>
        this.toggleModal("performance")
      );
    } else {
      performanceCallBack();
    }
  };

  handlePerformanceChoice = (choice) => {
    this.setState({ performanceChoice: choice });
  };

  render() {
    const {
      modalShow,
      modalType,
      performanceCallBack,
      performanceChoice,
    } = this.state;
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
            {modalType === "donation" ? (
              <DonationModal
                modalShow={modalShow}
                hideModal={this.toggleModal}
              />
            ) : (
              modalType === "performance" && (
                <PerformanceModal
                  modalShow={modalShow}
                  hideModal={this.toggleModal}
                  performanceCallBack={performanceCallBack}
                  raisePerformanceChoice={this.handlePerformanceChoice}
                />
              )
            )}
            <Header />
            <main role="main">
              <Charts
                didMount={this.state.didMount}
                raisePerformanceCheck={this.handlePerformanceCheck}
                performanceChoice={performanceChoice}
              />
            </main>
          </div>
          <Footer raiseShowModal={this.toggleModal} />
        </SentryBoundary>
      </React.Fragment>
    );
  }
}

export default App;
