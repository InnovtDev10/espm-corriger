import { Navigate, Outlet, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  // Vérifier si le token et le rôle existent, sinon rediriger vers la page d'accueil
  if (!token || !role) {
    return <Navigate to="/" replace />;
  } 

  // Mapping des rôles et de leurs pages autorisées
  const rolePaths = { 
    Fondatrice: ["/Dashboard","/matliste"  ,"/rapport","/livret", "/dossier", "/etudiant", "/classe", "/prof", "/note", "/resultat","/fourniture", "/frais", "/stage", "/ecolagePayment", "/notestage","/notestagelabo", "/notemaj", "/sortie", "/financegenerale", "/programme","/profil", "/paie", "/caissesortie", "/ecolagehistorique", "/caisse", "/modifier-note", "/doc", "/matieres", "/dossier", "/livret", "/matliste", "/rapport", "/chart", "/autrefraishistorique"],
    Admin: ["/Dashboard", "/etudiant", "/classe", "/prof", "/note", "/resultat","/fourniture", "/frais", "/stage", "/ecolagePayment", "/notestage","/notestagelabo", "/notemaj", "/sortie", "/financegenerale", "/programme","/profil", "/paie", "/caissesortie", "/ecolagehistorique", "/caisse", "/modifier-note", "/doc", "/matieres", "/dossier", "/livret", "/matliste", "/rapport", "/chart", "/autrefraishistorique"],
    Monitrice: ["/Dashboard", "/etudiant", "/note", "/notemaj", "/prof", "/matieres", "/resultat", "/programme", "/dossier", "/livret", "/stage"], // Ajout de /Dashboard
    Monitrice_de_stage: ["/Dashboard", "/stage", "/notestage", "/notestagelabo", "/resultat", "/programme", "/matieres", "/etudiant", "/stage", "/dossier", "/livret"], // Ajout de /Dashboard
    Caissier: ["/Dashboard","/ecolagehistorique", "/classe", "/ecolagePayment", "/frais","/paie","/caisse", "/etudiant", "/prof", "/dossier", "/autrefraishistorique"], // Ajout de /Dashboard
    RAF: ["/Dashboard", "/financegenerale", "/classe", "/frais", "/fourniture", "/paie","/doc", "/dossier", "/chart", "/autrefraishistorique"], // Ajout de /Dashboard
    Responsable_de_suivi: ["/Dashboard", "/etudiant", "/programme", "/prof","programme","matieres","resultat", "/dossier", "/livret", "/stage"], // Ajout de /Dashboard
  };   

  // Page d'accueil par rôle
  const defaultHomePage = {
    Fondatrice: "/Dashboard",
    Admin: "/Dashboard",
    Monitrice: "/Dashboard",
    Monitrice_de_stage: "/Dashboard",
    Caissier: "/Dashboard",
    RAF: "/Dashboard",
    Responsable_de_suivi: "/Dashboard",
  };

  // Vérifier si le rôle est autorisé à accéder à la route
  if (!allowedRoles.includes(role)) {
    // Rediriger vers une page d'accès refusé ou une page par défaut
    return <Navigate to="/access-denied" replace />;
  }

  // Vérifier si la route actuelle est autorisée pour ce rôle
  if (!rolePaths[role]?.includes(location.pathname)) {
    return <Navigate to={defaultHomePage[role]} replace />;
  }

  return <Outlet />;
};
PrivateRoute.propTypes = {
  allowedRoles: PropTypes.array.isRequired, // S'assure que allowedRoles est un tableau obligatoire
};

export default PrivateRoute;
