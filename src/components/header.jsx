import React from "react";

const Header = () => {
  return (
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
  );
};

export default Header;
