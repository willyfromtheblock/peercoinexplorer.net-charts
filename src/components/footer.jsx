import React from "react";

const Footer = (props) => {
  return (
    <footer className="footer navbar_ppc">
      <div className="container">
        <p className="donate_addr text-light">
          If you're enjoying this service, please consider donating to
          <button
            type="button"
            onClick={() => props.raiseShowModal("donation")}
            className="btn btn-secondary donate_addr"
          >
            PM7jjBUPjzpkZy1UZtD7mvmHoXJ2BGvbx9
          </button>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
