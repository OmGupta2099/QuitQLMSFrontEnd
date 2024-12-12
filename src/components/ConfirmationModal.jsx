import React from "react";
import { Modal } from "react-bootstrap";

const ConfirmationModal = ({ show, onConfirm, onCancel, message }) => {
  return (
    <Modal show={show} onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn btn-danger" onClick={onConfirm}>
          Confirm
        </button>
      </Modal.Footer>
    </Modal>
  );
};
export default ConfirmationModal;
