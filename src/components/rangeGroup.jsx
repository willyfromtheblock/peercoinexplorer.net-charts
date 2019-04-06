import React from "react";

const RangeGroup = props => {
  const { ranges, selectedRange, raiseRange } = props;
  return (
    <React.Fragment>
      <div
        className="btn-group"
        role="group"
        aria-label="Basic example"
        style={{ marginTop: 15 }}
      >
        {ranges.map(range => (
          <button
            type="button"
            key={range.name}
            className={
              range.days === selectedRange
                ? "btn btn-light btn-sm active"
                : "btn btn-light btn-sm"
            }
            onClick={() => raiseRange(range.days)}
          >
            {range.name}
          </button>
        ))}
      </div>
    </React.Fragment>
  );
};

export default RangeGroup;
