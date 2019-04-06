import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import Loader from "react-loader-spinner";
import http from "./services/httpService";
import Highcharts from "highcharts/highstock";
import OptionsGroup from "./components/optionsGroup";
import ButtonGroup from "./components/buttonGroup";
import DonationModal from "./components/donationModal";
import { charts, options } from "./components/config";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

class App extends Component {
  state = {
    data: [],
    ytitle: "",
    modalShow: false,
    option: "linear",
    initialLoad: false,
    loading: false,
    rangeSelected: 5,
    rangeSelectedBuffer: 5,
    decimals: 2,
    extremes: { min: null, max: null }
  };

  componentDidMount() {
    this.setState({ didMount: true });
  }

  shouldComponentUpdate(prevProps, prevState) {
    let value = true;
    if (prevState.rangeSelected === this.state.rangeSelected) {
      value = false;
    }
    if (
      prevState.option !== this.state.option ||
      prevState.chartTitle !== this.state.chartTitle ||
      prevState.loading !== this.state.loading ||
      prevState.modalShow !== this.state.modalShow ||
      prevState.option !== this.state.option ||
      prevState.rangeSelected !== this.state.rangeSelected
    ) {
      value = true;
    }
    return value;
  }

  handleLoad = async (name, ytitle, label, decimals, multi) => {
    this.setState({
      loading: true
    });
    const { data } = await http.get(`data/${name}.json`);

    let array = [];
    let seriesOptions = [];
    let obj = {};

    if (decimals === undefined) {
      decimals = 2;
    }

    if (multi === undefined) {
      Object.keys(data).forEach(key => {
        const date = key.split("-");
        array.push([Date.UTC(date[0], date[1] - 1, date[2]), data[key]]);
      });

      seriesOptions = [
        {
          name: label,
          data: array,
          tooltip: {
            valueDecimals: decimals
          }
        }
      ];
    } else {
      Object.keys(data).forEach(key => {
        if (key === "series") {
          data[key].forEach(x => (obj[x] = []));
        } else {
          const date = key.split("-");
          Object.keys(data[key]).forEach(name => {
            const newArray = [
              Date.UTC(date[0], date[1] - 1, date[2]),
              data[key][name]
            ];
            obj[name] = [...obj[name], newArray];
          });
        }
      });

      Object.keys(obj).forEach(name => {
        seriesOptions.push({
          name,
          data: obj[name],
          tooltip: {
            valueDecimals: decimals
          }
        });
      });
    }

    this.setState({
      ytitle,
      chartTitle: label,
      decimals,
      initialLoad: true,
      loading: false,
      seriesOptions,
      rangeSelected: this.state.rangeSelectedBuffer
    });
    this.refs["optionsGroup"].scrollIntoView({
      block: "end",
      behavior: "smooth"
    });
  };

  handleOptions = option => {
    this.refs["optionsGroup"].scrollIntoView({
      block: "end",
      behavior: "smooth"
    });
    this.setState({ option });
  };

  showModal = () => {
    this.setState({
      modalShow: true
    });
  };

  hideModal = () => {
    this.setState({
      modalShow: false
    });
  };

  handleRange = index => {
    this.setState({ rangeSelectedBuffer: index });
  };

  handleExtremes = event => {
    let extremes = {};
    extremes.max = Math.round(event.max, 0);
    extremes.min = Math.round(event.min, 0);

    this.setState({ extremes });
  };

  render() {
    const {
      chartTitle,
      selected,
      ytitle,
      option,
      didMount,
      modalShow,
      initialLoad,
      loading,
      rangeSelected,
      seriesOptions,
      extremes
    } = this.state;

    if (didMount && !loading && initialLoad) {
      const _this = this;

      Highcharts.stockChart("chartContainer", {
        colors: ["#3cb054", "#b35900"],
        chart: {
          zoomType: "x"
        },
        legend: {
          enabled: true
        },
        rangeSelector: {
          inputDateFormat: "%Y-%m-%d",
          selected: rangeSelected,
          buttons: [
            {
              type: "month",
              count: 1,
              text: "1m",
              events: {
                click: () => {
                  _this.handleRange(0);
                }
              }
            },
            {
              type: "month",
              count: 3,
              text: "3m",
              events: {
                click: function() {
                  _this.handleRange(1);
                }
              }
            },
            {
              type: "month",
              count: 6,
              text: "6m",
              events: {
                click: function() {
                  _this.handleRange(2);
                }
              }
            },
            {
              type: "ytd",
              text: "YTD",
              events: {
                click: function() {
                  _this.handleRange(3);
                }
              }
            },
            {
              type: "year",
              count: 1,
              text: "1y",
              events: {
                click: function() {
                  _this.handleRange(4);
                }
              }
            },
            {
              type: "all",
              text: "All",
              events: {
                click: function() {
                  _this.handleRange(5);
                }
              }
            }
          ]
        },
        title: {
          text: chartTitle
        },
        plotOptions: {
          series: {
            turboThreshold: 5000
          }
        },
        /*  xAxis: {
          events: {
            setExtremes: function(e) {
              _this.handleExtremes(e);
            }
          }
                   max: extremes.max,
          min: extremes.min 
        },*/
        yAxis: {
          title: {
            text: ytitle,
            style: {
              "font-size": "0.8rem"
            }
          },
          type: option,
          min: 1,
          minorTickInterval: "auto"
        },
        series: seriesOptions
      });
    }

    return (
      <React.Fragment>
        <ToastContainer />
        <div
          style={{
            position: "absolute",
            width: "100%",
            minWidht: "100vw",
            minHeight: "100vh"
          }}
        >
          {loading && (
            <div className="loader">
              <Loader
                type="RevolvingDot"
                color="#3cb054"
                height="100"
                width="100"
              />
            </div>
          )}
          <header>
            <div className="navbar_ppc navbar-dark shadow-sm">
              <div className="container d-flex justify-content-between">
                <img
                  className="logo"
                  style={{ maxWidth: "100vw", margin: 10 }}
                  src="https://peercoinexplorer.net/peercoin-horizontal-greenleaf-whitetext-transparent.svg"
                  alt="Peercoin Logo"
                />
              </div>
            </div>
          </header>
          <main role="main">
            <section className="jumbotron text-center">
              <div className="container">
                <DonationModal
                  modalShow={modalShow}
                  hideModal={this.hideModal}
                />
                <h1 className="jumbotron-heading">Peercoin charts</h1>
                <hr />
                <ButtonGroup
                  selected={selected}
                  charts={charts}
                  raiseLoad={this.handleLoad}
                />
                <div id="chartContainer" />
                {!initialLoad ? (
                  <div className="jumbotron jumbotron-fluid">
                    <div className="container">
                      <h5>Please select a chart to load.</h5>
                    </div>
                  </div>
                ) : (
                  <div ref={"optionsGroup"}>
                    <OptionsGroup
                      options={options}
                      selectedOption={option}
                      raiseOptions={this.handleOptions}
                    />
                  </div>
                )}
                <p style={{ marginTop: "0.5vw", marginBottom: "0" }}>
                  <small>Data is updated every 24 hours.</small>
                </p>
              </div>
            </section>
          </main>
          <footer className="footer navbar_ppc">
            <div className="container">
              <p className="donate_addr text-light">
                If you're enjoying this service, please consider donating to
                <button
                  type="button"
                  onClick={() => this.showModal()}
                  className="btn btn-secondary donate_addr"
                >
                  PA3VZmupxdsX5TuS1PyXZPsbbhZGT2htPz
                </button>
              </p>
            </div>
          </footer>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
