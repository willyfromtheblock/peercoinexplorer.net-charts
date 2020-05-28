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
            PPXMXETHJE3E8k6s8vmpDC18b7y5eKAudS
          </button>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
