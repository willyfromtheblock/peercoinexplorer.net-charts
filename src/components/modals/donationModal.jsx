import React from "react";
import QRCode from "qrcode.react";
import ModalComponent from "./modal";

const DonationModal = (props) => {
  const { modalShow, hideModal } = props;
  return (
    <ModalComponent
      modalShow={modalShow}
      hideModal={hideModal}
      title={"Donation address"}
      footer={
        <button className="btn btn-secondary" onClick={() => hideModal()}>
          Close
        </button>
      }
    >
      <div className="text-center">
        <QRCode value="PM7jjBUPjzpkZy1UZtD7mvmHoXJ2BGvbx9" />
        <p className="donate_addr">PM7jjBUPjzpkZy1UZtD7mvmHoXJ2BGvbx9</p>
        <i className="fa fa-thumbs-o-up" />
      </div>
    </ModalComponent>
  );
};

export default DonationModal;
