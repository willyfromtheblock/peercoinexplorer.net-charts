import React from "react";

const OptionsGroup = props => {
  const { options, selectedOption, raiseOptions } = props;
  return (
    <React.Fragment>
      <div
        className="btn-group"
        role="group"
        aria-label="Basic example"
        style={{ marginTop: "2vh" }}
      >
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
    </React.Fragment>
  );
};

export default OptionsGroup;
