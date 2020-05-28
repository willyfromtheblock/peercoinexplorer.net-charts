import React from "react";
import ModalComponent from "./modal";

const PerformanceModal = (props) => {
  const {
    modalShow,
    hideModal,
    performanceCallBack,
    raisePerformanceChoice,
  } = props;
  return (
    <ModalComponent
      modalShow={modalShow}
      hideModal={hideModal}
      title={"Performance check"}
      footer={
        <div>
          <button
            className="btn btn-secondary"
            onClick={() => {
              performanceCallBack();
              raisePerformanceChoice("okay");
              hideModal();
            }}
          >
            Okay
          </button>
          <button className="btn btn-secondary" onClick={() => hideModal()}>
            Cancel
          </button>
        </div>
      }
    >
      <div className="text-center">
        The requested action requires some processing power and on certain
        devices it might cause this tab to freeze.
        {/* TODO: Save on devices (local storage) */}
      </div>
    </ModalComponent>
  );
};

export default PerformanceModal;
