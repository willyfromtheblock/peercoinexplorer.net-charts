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
        <p className="text-light" style={{ marginTop: "0.5rem" }}>
          <a href="https://www.coinerella.com" target="_blank" rel="noopener noreferrer">
            <img
              src="https://fonts.peercoinexplorer.net/coinerella.png"
              alt="Coinerella"
              style={{ height: "1.5em", verticalAlign: "middle", marginRight: "0.3rem" }}
            />
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
