import React from "react";
import { Modal } from "react-bootstrap";
import QRCode from "qrcode.react";

const DonationModal = props => {
  const { modalShow, hideModal } = props;
  return (
    <Modal
      show={modalShow}
      onHide={hideModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Donation address
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <QRCode value="PPXMXETHJE3E8k6s8vmpDC18b7y5eKAudS" />
          <p className="donate_addr">PPXMXETHJE3E8k6s8vmpDC18b7y5eKAudS</p>
          <i className="fa fa-thumbs-o-up" />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={() => hideModal()}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DonationModal;
