import React from "react";
import "../Styles/AccessDenied.css";
import LogoInterdit from "../assets/interdit.png";
import { useNavigate } from "react-router-dom"; 

const AccessDenied = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <div className="access-denied-container">
      <div className="access-denied-content">
        <img src={LogoInterdit} alt="Logo interdit" className="access-denied-logo" />
        <h1>Accès refusé</h1>
        <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
        <button onClick={handleBack}>Retour</button> 
      </div>
    </div>
  );
};

export default AccessDenied;
