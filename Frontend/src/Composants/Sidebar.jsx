import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaClipboard,
  FaChartBar,
  FaBriefcase,
  FaDollarSign,
  FaBoxOpen,
  FaCoins,
  FaCogs,
} from "react-icons/fa";
import defaultPhoto from "../assets/default_photo.jpg";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePhotoUrl = "http://localhost:5000/uploads/";

  const isActive = (path) => {
    if (path === "/classe") {
      return (
        location.pathname.startsWith("/classe") ||
        location.pathname === "/ecolagePayment" ||
        location.pathname === "/ecolagehistorique"
      );
    }
    if (path === "/stage") {
      return (
        location.pathname.startsWith("/stage") ||
        location.pathname === "/notestage" ||
        location.pathname === "/notestagelabo"
      );
    }
    if (path === "/note") {
      return (
        location.pathname.startsWith("/note") ||
        location.pathname === "/notemaj"
      );
    }
    if (path === "/frais") {
      return (
        location.pathname.startsWith("/frais") ||
        location.pathname === "/autrefraishistorique"
      );
    }
    if (path === "/financegenerale") {
      return (
        location.pathname.startsWith("/financegenerale") ||
        location.pathname === "/finance" ||
        location.pathname === "/sortie"
      );
    }
    if (path === "/caisse") {
      return (
        location.pathname.startsWith("/caisse") ||
        location.pathname === "/caissesortie"
      );
    }
    if (path === "/programme") {
      return (
        location.pathname.startsWith("/programme") ||
        location.pathname === "/matieres" ||
        location.pathname === "/matliste"
      );
    }
    if (path === "/etudiant") {
      return (
        location.pathname.startsWith("/etudiant") ||
        location.pathname === "/dossier" ||
        location.pathname === "/livret"
      );
    }
    return location.pathname === path;
  };

  // Récupérer la photo depuis le localStorage
  const userPhoto = localStorage.getItem("photo");

  // Vérifier si la photo est valide, sinon utiliser l'image par défaut
  const profilePhoto =
    userPhoto && userPhoto !== "null" && userPhoto !== ""
      ? basePhotoUrl + userPhoto
      : defaultPhoto;

  return (
    <div className="sidebar p-3">
      <div className="profil">
        <div className="pdc"></div>
        <div className="pdp">
          {/* Affichage de la photo si elle existe, sinon afficher une image par défaut */}
          <img src={profilePhoto} alt="Profile" className="profile-pic" />
        </div>
      </div>
      <div className="menu mt-4">
        {/* Accueil fixe */}
        <div className="fixed-accueil">
          <button
            className={`btn mt-0 p-2 ${
              isActive("/Dashboard") ? "btn-primary active" : "btn-light"
            }`}
            onClick={() => navigate("/Dashboard")}
          >
            <FaHome className="me-2" /> Accueil
          </button>
        </div>

        {/* Menu scrollable */}
        <div className="scrollable-menu">
          <button
            className={`btn mt-2 p-2 ${
              isActive("/etudiant") ? "btn-primary active" : "btn-light"
            }`}
            onClick={() => navigate("/etudiant")}
          >
            <FaUserGraduate className="me-2" /> Gestion étudiant
          </button>

          <button
            className={`btn mt-2 p-2 ${
              isActive("/programme") ? "btn-primary active" : "btn-light"
            }`}
            onClick={() => navigate("/programme")}
          >
            <FaUserGraduate className="me-2" /> Gestion Programme
          </button>

          <button
            className={`btn mt-2 p-2 ${
              isActive("/classe") ? "btn-primary active" : "btn-light"
            }`}
            onClick={() => navigate("/classe")}
          >
            <FaCoins className="me-2" /> Gestion Droit & Écolages
          </button>

          <button
            className={`btn mt-2 p-2 ${
              isActive("/paie") ? "btn-primary active" : "btn-light"
            }`}
            onClick={() => navigate("/paie")}
          >
            <FaCoins className="me-2" /> Gestion Paiement Salaires
          </button>

          <button
            className={`btn mt-2 p-2 ${
              isActive("/prof") ? "btn-primary active" : "btn-light"
            }`}
            onClick={() => navigate("/prof")}
          >
            <FaChalkboardTeacher className="me-2" /> Gestion des profs
          </button>

          <button
            className={`btn mt-2 p-2 ${
              isActive("/note") ? "btn-primary active" : "btn-light"
            }`}
            onClick={() => navigate("/note")}
          >
            <FaClipboard className="me-2" /> Gestion des notes
          </button>

          <button
            className={`btn mt-2 p-2 ${
              isActive("/resultat") ? "btn-primary active" : "btn-light"
            }`}
            onClick={() => navigate("/resultat")}
          >
            <FaChartBar className="me-2" /> Résultat
          </button>

          <button
            className={`btn mt-2 p-2 ${
              isActive("/stage") ? "btn-primary active" : "btn-light"
            }`}
            onClick={() => navigate("/stage")}
          >
            <FaBriefcase className="me-2" /> Gestion de{" "}
            <b className="text-success">STAGE</b>
          </button>

          <button
            className={`btn mt-2 p-2 ${
              isActive("/frais") ? "btn-primary active" : "btn-light"
            }`}
            onClick={() => navigate("/frais")}
          >
            <FaDollarSign className="me-2" /> Gestion Autres Frais Étudiants
          </button>

          <button
            className={`btn mt-2 p-2 ${
              isActive("/fourniture") ? "btn-primary active" : "btn-light"
            }`}
            onClick={() => navigate("/fourniture")}
          >
            <FaBoxOpen className="me-2" /> Gestion des Matériels & Fournitures
          </button>

          <button
            className={`btn mt-2 p-2 ${
              isActive("/financegenerale") ? "btn-primary active" : "btn-light"
            }`}
            onClick={() => navigate("/financegenerale")}
          >
            <FaCoins className="me-2" /> Gestion financière
          </button>
          <button
            className={`btn mt-2 p-2 ${
              isActive("/caisse") ? "btn-primary active" : "btn-light"
            }`}
            onClick={() => navigate("/caisse")}
          >
            <FaCoins className="me-2" />
            Suivi de Caisse
          </button>
          <button
            className={`btn mt-2 p-2 ${
              isActive("/rapport") ? "btn-primary active" : "btn-light"
            }`}
            onClick={() => navigate("/rapport")}
          >
            <FaCoins className="me-2" /> Rapport
          </button>
          <button
            className={`btn mt-2 p-2 ${
              isActive("/chart") ? "btn-primary active" : "btn-light"
            }`}
            onClick={() => navigate("/chart")}
          >
            <FaChartBar className="me-2" /> Tableau de bord
          </button>
          <button
            className={`btn mt-2 p-2 ${
              isActive("/profil") ? "btn-primary active" : "btn-light"
            }`}
            onClick={() => navigate("/profil")}
          >
            <FaCogs className="me-2" /> Gestion Utilisateurs
          </button>
          <button
            className={`btn mt-2 p-2 ${
              isActive("/doc") ? "btn-primary active" : "btn-light"
            }`}
            onClick={() => navigate("/doc")}
          >
            <FaCogs className="me-2" /> Documents Administratifs
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
