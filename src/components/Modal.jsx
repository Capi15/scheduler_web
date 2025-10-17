import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

/**
 * Componente de modal personalizável.
 *
 * @param {boolean} show Se o modal deve ser exibido ou não.
 * @param {function} onPrimaryButtonClick Função a ser executada quando o botão primário for clicado.
 * @param {function} onSecondButtonClick Função a ser executada quando o botão secundário for clicado.
 * @param {string} title Título do modal.
 * @param {string} body Corpo do modal.
 * @param {string} primaryButtonText Texto do botão primário.
 * @param {string} secondButtonText Texto do botão secundário.
 *
 * @returns {React.Component} O componente de modal renderizado.
 */
function CustomModal({
  show,
  onPrimaryButtonClick,
  onSecondButtonClick,
  title,
  body,
  primaryButtonText,
  secondButtonText,
  children,
  error,
}) {
  return (
    <Modal
      show={show}
      onHide={onSecondButtonClick || (() => { })} // Se não passar uma função, não faz nada
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && <div className="text-danger mt-2">{error}</div>}
        {children ? children : <p>{body}</p>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onSecondButtonClick}>
          {secondButtonText}
        </Button>
        <Button variant="primary" onClick={onPrimaryButtonClick}>
          {primaryButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CustomModal;
