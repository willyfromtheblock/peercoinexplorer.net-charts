import React from "react";

const ButtonGroup = props => {
  const { selected, charts, raiseLoad } = props;
  return (
    <React.Fragment>
      <div
        className="btn-group-justified"
        role="group"
        aria-label="Basic example"
        style={{ marginBottom: 15 }}
      >
        {charts.map(chart => (
          <button
            type="button"
            key={chart.name}
            className={
              chart.name === selected
                ? "btn btn-secondary active"
                : "btn btn-secondary"
            }
            onClick={() => raiseLoad(chart)}
          >
            {chart.label}
          </button>
        ))}
      </div>
    </React.Fragment>
  );
};

export default ButtonGroup;
