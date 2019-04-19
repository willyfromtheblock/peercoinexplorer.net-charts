import React from "react";

const OptionsGroup = props => {
  const {
    options,
    dataGroups,
    selectedOption,
    raiseOptions,
    raiseGroup,
    selectedGroup
  } = props;
  return (
    <React.Fragment>
      <div className="btn-group" role="group" style={{ marginTop: "2vh" }}>
        {options.map(options => (
          <button
            type="button"
            key={options.name}
            className={
              options.type === selectedOption
                ? "btn btn-light btn-sm active"
                : "btn btn-light btn-sm"
            }
            onClick={() => raiseOptions(options.type)}
          >
            {options.name}
          </button>
        ))}
      </div>
      <div
        className="btn-group"
        role="group"
        style={{ display: "block", marginTop: "2vh" }}
      >
        <label>
          <small>Data grouping</small>
        </label>
        <br />
        {dataGroups.map(options => (
          <button
            type="button"
            key={options.name}
            className={
              options.type === selectedGroup
                ? "btn btn-light btn-sm active"
                : "btn btn-light btn-sm"
            }
            onClick={() => raiseGroup(options.type)}
          >
            {options.name}
          </button>
        ))}
      </div>
    </React.Fragment>
  );
};

export default OptionsGroup;
