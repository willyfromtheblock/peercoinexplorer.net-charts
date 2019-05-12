import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import GitHubButton from "react-github-btn";
import Loader from "react-loader-spinner";
import http from "./services/httpService";
import Highcharts from "highcharts/highstock";
import OptionsGroup from "./components/optionsGroup";
import ButtonGroup from "./components/buttonGroup";
import DonationModal from "./components/donationModal";
import { charts, options, dataGroups } from "./components/config";
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
    extremes: { min: null, max: null },
    selectedGroup: "default",
    selectedChart: ""
  };

  componentDidMount() {
    this.setState({ didMount: true });
    this.parseWindowUrl();
  }

  parseWindowUrl = () => {
    const splitPath = window.location.pathname.split("/").splice(1);
    let option = this.state.option;
    let rangeSelected = this.state.rangeSelected;
    let selectedGroup = this.state.selectedGroup;

    if (splitPath[1] >= 0 && splitPath[1] <= 5) {
      rangeSelected = splitPath[1];
    } else {
      rangeSelected = 5;
    }

    Object.keys(options).forEach(x => {
      if (options[x].type === splitPath[2]) {
        option = splitPath[2];
      }
    });

    Object.keys(dataGroups).forEach(x => {
      if (dataGroups[x].type === splitPath[3]) {
        selectedGroup = splitPath[3];
      }
    });

    this.setState(
      { rangeSelectedBuffer: rangeSelected, option, selectedGroup },
      () =>
        Object.keys(charts).forEach(x => {
          if (charts[x].name === splitPath[0]) {
            this.handleLoad(charts[x]);
          }
        })
    );
  };

  changeWindowURL = () => {
    window.history.pushState(
      null,
      "",
      `/${this.state.selectedChart}/${this.state.rangeSelectedBuffer}/${
        this.state.option
      }/${this.state.selectedGroup}`
    );
  };

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
      prevState.selectedGroup !== this.state.selectedGroup ||
      prevState.rangeSelected !== this.state.rangeSelected
    ) {
      value = true;
    }
    return value;
  }

  calcDataGroups = () => {
    const { selectedGroup } = this.state;
    switch (selectedGroup) {
      case "days":
        return [["day", [1]]];
      case "weeks":
        return [["week", [1]]];
      case "months":
        return [["month", [1]]];
      default:
        return [
          ["day", [1]],
          ["week", [1]],
          ["month", [1, 3, 6]],
          ["year", null]
        ];
    }
  };

  handleLoad = async ({ name, ytitle, label, decimals, multi }) => {
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

    this.setState(
      {
        ytitle,
        selectedChart: name,
        chartTitle: label,
        decimals,
        initialLoad: true,
        loading: false,
        seriesOptions,
        rangeSelected: this.state.rangeSelectedBuffer
      },
      () => this.changeWindowURL()
    );
    this.refs["optionsGroup"].scrollIntoView({
      block: "end",
      behavior: "smooth"
    });
  };

  handleOptions = option => {
    const { rangeSelectedBuffer } = this.state;
    this.setState(
      { option, rangeSelected: rangeSelectedBuffer },
      () => this.changeWindowURL(),
      this.refs["optionsGroup"].scrollIntoView({
        block: "end",
        behavior: "smooth"
      })
    );
  };

  handleGroup = selectedGroup => {
    const { rangeSelectedBuffer } = this.state;
    this.setState(
      { selectedGroup, rangeSelected: rangeSelectedBuffer },
      () => this.changeWindowURL(),
      this.refs["optionsGroup"].scrollIntoView({
        block: "end",
        behavior: "smooth"
      })
    );
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
      selectedChart,
      ytitle,
      option,
      didMount,
      modalShow,
      initialLoad,
      loading,
      rangeSelected,
      seriesOptions,
      extremes,
      selectedGroup
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
                  _this.changeWindowURL();
                }
              }
            },
            {
              type: "month",
              count: 3,
              text: "3m",
              events: {
                click: () => {
                  _this.handleRange(1);
                  _this.changeWindowURL();
                }
              }
            },
            {
              type: "month",
              count: 6,
              text: "6m",
              events: {
                click: () => {
                  _this.handleRange(2);
                  _this.changeWindowURL();
                }
              }
            },
            {
              type: "ytd",
              text: "YTD",
              events: {
                click: () => {
                  _this.handleRange(3);
                  _this.changeWindowURL();
                }
              }
            },
            {
              type: "year",
              count: 1,
              text: "1y",
              events: {
                click: () => {
                  _this.handleRange(4);
                  _this.changeWindowURL();
                }
              }
            },
            {
              type: "all",
              text: "All",
              events: {
                click: () => {
                  _this.handleRange(5);
                  _this.changeWindowURL();
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
            turboThreshold: 5000,
            dataGrouping: {
              enabled: true,
              forced: true,
              units: _this.calcDataGroups()
            }
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
                  selected={selectedChart}
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
                      dataGroups={dataGroups}
                      selectedOption={option}
                      selectedGroup={selectedGroup}
                      raiseOptions={this.handleOptions}
                      raiseGroup={this.handleGroup}
                    />
                  </div>
                )}
                <p style={{ marginTop: "10px", marginBottom: "10px" }}>
                  <small>Data is updated every 24 hours.</small>
                </p>
                <GitHubButton
                  href="https://github.com/bananenwilly/peercoinexplorer.net-charts/issues"
                  data-icon="octicon-issue-opened"
                  data-size="large"
                  data-show-count="true"
                  aria-label="Issue bananenwilly/peercoinexplorer.net-charts on GitHub"
                >
                  Issue
                </GitHubButton>
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
