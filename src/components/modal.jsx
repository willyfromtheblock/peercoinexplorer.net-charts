import React from "react";
import { Modal } from "react-bootstrap";

const ModalComponent = (props) => {
  const { modalShow, hideModal, title, children, footer } = props;
  return (
    <Modal
      show={modalShow}
      onHide={hideModal}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>{footer}</Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;
