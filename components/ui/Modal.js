import { Fragment, useState, useEffect } from "react";
import { createPortal } from "react-dom";

import classes from "./Modal.module.css";

function Backdrop() {
  return <div className={classes.backdrop} />;
}

function ModalOverlay({ children }) {
  return (
    <div className={classes.modal}>
      {/* The actual Modal content */}
      <div className={classes.content}>{children}</div>{" "}
    </div>
  );
}

function Modal({ children }) {
  const [mounted, setMounted] = useState(false);
  const [hideModal, setHideModal] = useState(false);

  useEffect(() => {
    setMounted(true);

    function handleBeforePrint() {
      setHideModal(true);
    }

    function handleAfterPrint() {
      setHideModal(false);
    }

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
      setMounted(false);
    };
  }, []);

  const portalElement = mounted ? document.getElementById("overlays") : null;

  return mounted && !hideModal ? (
    <Fragment>
      {createPortal(<Backdrop />, portalElement)}
      {createPortal(<ModalOverlay>{children}</ModalOverlay>, portalElement)}
    </Fragment>
  ) : (
    children 
  );
}

export default Modal;
