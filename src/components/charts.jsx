import React, { Component, Fragment } from "react";
import Loader from "react-loader-spinner";
import GitHubButton from "react-github-btn";
import http from "../services/httpService";
import Highcharts from "highcharts/highstock";
import OptionsGroup from "./optionsGroup";
import ButtonGroup from "./buttonGroup";
import { charts, options, dataGroups } from "./config";

class Charts extends Component {
  state = {
    option: "linear",
    selectedGroup: "default",
    rangeSelectedBuffer: 5,
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

  componentDidMount() {
    this.parseWindowUrl();
  }

  checkDataGroupDayRangeAll = (index, selectedGroup, callback) => {
    if (parseInt(index) === 5 && selectedGroup === "days") {
      if (this.props.performanceChoice === null) {
        //check mobile
        if (window.matchMedia("only screen and (max-width: 768px)").matches) {
          this.props.raisePerformanceCheck(callback);
          return false;
        }
      }
    }
    callback();
    return true;
  };

  handleChartClick = (index) => {
    return this.checkDataGroupDayRangeAll(
      index,
      this.state.selectedGroup,
      () => {
        this.handleRange(index);
        this.changeWindowURL();
      }
    );
  };

  parseWindowUrl = () => {
    const splitPath = window.location.pathname.split("/").splice(2);
    let { option, rangeSelected, selectedGroup } = this.state;

    if (splitPath[1] >= 0 && splitPath[1] <= 6) {
      rangeSelected = splitPath[1];
    } else {
      rangeSelected = 6;
    }

    Object.keys(options).forEach((x) => {
      if (options[x].type === splitPath[2]) {
        option = splitPath[2];
      }
    });

    Object.keys(dataGroups).forEach((x) => {
      if (dataGroups[x].type === splitPath[3]) {
        selectedGroup = splitPath[3];
      }
    });

    this.checkDataGroupDayRangeAll(rangeSelected, selectedGroup, () => {
      this.setState(
        { rangeSelectedBuffer: rangeSelected, option, selectedGroup },
        () =>
          Object.keys(charts).forEach((x) => {
            if (charts[x].name === splitPath[0]) {
              this.handleLoad(charts[x]);
            }
          })
      );
    });
  };

  changeWindowURL = () => {
    let { option, selectedGroup, selectedChart, rangeSelectedBuffer } =
      this.state;
    window.history.pushState(
      null,
      "",
      `/charts/${selectedChart}/${rangeSelectedBuffer}/${option}/${selectedGroup}`
    );
  };

  handleRange = (index) => {
    this.setState({ rangeSelectedBuffer: index });
  };

  handleLoad = async ({ name, ytitle, label, decimals, multi }) => {
    this.setState({
      loading: true,
    });
    const { data } = await http.get(
      `https://peercoinexplorer.net/chart_data/${name}.json`
    );

    let array = [];
    let seriesOptions = [];
    let obj = {};

    if (decimals === undefined) {
      decimals = 2;
    }

    if (multi === undefined) {
      Object.keys(data).forEach((key) => {
        const date = key.split("-");
        array.push([Date.UTC(date[0], date[1] - 1, date[2]), data[key]]);
      });

      seriesOptions = [
        {
          name: label,
          data: array,
          tooltip: {
            valueDecimals: decimals,
          },
        },
      ];
    } else {
      Object.keys(data).forEach((key) => {
        if (key === "series") {
          data[key].forEach((x) => (obj[x] = []));
        } else {
          const date = key.split("-");
          Object.keys(data[key]).forEach((name) => {
            const newArray = [
              Date.UTC(date[0], date[1] - 1, date[2]),
              data[key][name],
            ];
            obj[name] = [...obj[name], newArray];
          });
        }
      });

      Object.keys(obj).forEach((name) => {
        seriesOptions.push({
          name,
          data: obj[name],
          tooltip: {
            valueDecimals: decimals,
          },
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
        rangeSelected: this.state.rangeSelectedBuffer,
      },
      () => this.changeWindowURL()
    );
    this.refs["optionsGroup"].scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
  };

  handleOptions = (option) => {
    const { rangeSelectedBuffer } = this.state;
    this.setState(
      { option, rangeSelected: rangeSelectedBuffer },
      () => this.changeWindowURL(),
      this.refs["optionsGroup"].scrollIntoView({
        block: "end",
        behavior: "smooth",
      })
    );
  };

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
          ["year", null],
        ];
    }
  };

  handleGroup = (selectedGroup) => {
    const { rangeSelectedBuffer } = this.state;

    this.checkDataGroupDayRangeAll(rangeSelectedBuffer, selectedGroup, () => {
      this.setState(
        { selectedGroup, rangeSelected: rangeSelectedBuffer },
        () => this.changeWindowURL(),
        this.refs["optionsGroup"].scrollIntoView({
          block: "end",
          behavior: "smooth",
        })
      );
    });
  };

  render() {
    const {
      chartTitle,
      selectedChart,
      ytitle,
      option,
      initialLoad,
      loading,
      rangeSelected,
      seriesOptions,
      selectedGroup,
    } = this.state;

    const { didMount } = this.props;

    if (didMount && !loading && initialLoad) {
      const _this = this;

      Highcharts.stockChart("chartContainer", {
        colors: ["#3cb054", "#b35900", "dodgerblue"],
        chart: {
          zoomType: "x",
        },
        legend: {
          enabled: true,
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
                  return _this.handleChartClick(0);
                },
              },
            },
            {
              type: "month",
              count: 3,
              text: "3m",
              events: {
                click: () => {
                  return _this.handleChartClick(1);
                },
              },
            },
            {
              type: "month",
              count: 6,
              text: "6m",
              events: {
                click: () => {
                  return _this.handleChartClick(2);
                },
              },
            },
            {
              type: "ytd",
              text: "YTD",
              events: {
                click: () => {
                  return _this.handleChartClick(3);
                },
              },
            },
            {
              type: "year",
              count: 1,
              text: "1y",
              events: {
                click: () => {
                  return _this.handleChartClick(4);
                },
              },
            },
            {
              type: "year",
              count: 5,
              text: "5y",
              events: {
                click: () => {
                  return _this.handleChartClick(5);
                },
              },
            },
            {
              type: "all",
              text: "All",
              events: {
                click: () => {
                  return _this.handleChartClick(6);
                },
              },
            },
          ],
        },
        title: {
          text: chartTitle,
        },
        plotOptions: {
          series: {
            turboThreshold: 5000,

            dataGrouping: {
              enabled: true,
              forced: true,
              units: _this.calcDataGroups(),
            },
          },
        },
        yAxis: {
          title: {
            text: ytitle,
            style: {
              "font-size": "0.8rem",
            },
          },
          type: option,
          min: 0.1,
          minorTickInterval: "auto",
        },
        series: seriesOptions,
      });
    }

    return (
      <Fragment>
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
        <section className="jumbotron text-center">
          <div className="container">
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
            <div style={{ marginBottom: "2rem" }}>
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
          </div>
        </section>
      </Fragment>
    );
  }
}

export default Charts;
