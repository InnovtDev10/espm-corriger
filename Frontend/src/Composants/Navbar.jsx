import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Logo from "../assets/logo1.png";
import { FaUserCircle, FaBell, FaSignOutAlt } from "react-icons/fa"; // Importation des icônes de React Icons

function Navbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");


  useEffect(() => {
    // Récupérer les informations de l'utilisateur depuis localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.nom) {
      setUserName(user.nom); // Mettre à jour l'état avec le nom de l'utilisateur

    } else {
      console.log("Aucun utilisateur trouvé dans localStorage");
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez être déconnecté.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "secondary",
      confirmButtonText: "Oui",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        // Suppression des données de session (si nécessaire)
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("photo");
        localStorage.removeItem("nom");

        // Affichage du message de succès AVANT la redirection
        Swal.fire({
          title: "Déconnecté !",
          text: "Vous avez été déconnecté avec succès.",
          icon: "success",
          timer: 1000, 
          showConfirmButton: false,
        }).then(() => {
          // Redirection vers la page d'accueil APRÈS la fermeture de l'alerte
          navigate("/");
        });
      }
    });
  };

  // Récupérer la photo depuis le localStorage
  const userNom = localStorage.getItem("nom");
  const userRole = localStorage.getItem("role");


  return (
    <> 
      <div className="header p-3">
        {/* Logo et titre */}
        <div className="logo center">
          <img src={Logo} alt="logo" width={70} />
          {/* Affichage du rôle en gras */}
          <h4 className="fw-bold m-3" style={{ color: "#227d37" }}>
  {userRole || "Rôle non défini"}
</h4>

        </div>

        {/* Compte utilisateur */}
        <div className="center compte">
          <h2>
            <FaUserCircle className="me-2" />
          </h2>
          <p className="alert">{userNom || "Utilisateur non connecté"}</p>
          <h2 className="text-success">
            <FaBell className="me-2" />
          </h2>

          {/* Icône de déconnexion */}
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="me-2" />
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
