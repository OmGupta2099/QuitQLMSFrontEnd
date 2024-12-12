import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHammer } from "@fortawesome/free-solid-svg-icons";
import "../css/Error.css";
export const Error = () => {
  return (
    <>
      <div className="error-container">
        <FontAwesomeIcon icon={faHammer} size="6x" className="error-icon" />
        <h1 className="error-title">404 Not Found</h1>
        <p className="error-message">Please Check your URL</p>
      </div>
    </>
  );
};
