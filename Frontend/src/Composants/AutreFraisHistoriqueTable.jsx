import { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/EcolageHistorique.css";

const AutreFraisHistoriqueTable = () => {
  const [paiements, setPaiements] = useState([]);
  const [filterNiveau, setFilterNiveau] = useState("");
  const [filterFiliere, setFilterFiliere] = useState("");
  const [filterAnnee, setFilterAnnee] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultCount, setResultCount] = useState(0);

  useEffect(() => {
    const fetchPaiements = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/paiement/frais/all"
        );
        setPaiements(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des paiements :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaiements();
  }, []);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return "Non payé";
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtrage des données
  useEffect(() => {
    const filtered = paiements.filter((paiement) => {
      const niveauMatch = filterNiveau
        ? paiement.niveau === filterNiveau
        : true;
      const anneeMatch = filterAnnee
        ? paiement.anneeUniv === filterAnnee
        : true;
      const filiereMatch = filterFiliere
        ? paiement.filiere === filterFiliere
        : true;

      const montantReste = parseFloat(paiement.montantReste);
      let statutMatch = true;
      if (filterStatut === "Effectuer") {
        statutMatch = montantReste === 0;
      } else if (filterStatut === "Reste") {
        statutMatch = montantReste > 0;
      }

      return niveauMatch && filiereMatch && anneeMatch && statutMatch;
    });

    setResultCount(filtered.length);
  }, [paiements, filterNiveau, filterFiliere, filterAnnee, filterStatut]);

  return (
    <div className="historique-ecolage mt-3">
      {/* Filtres */}
      <div className="filters d-flex gap-3 mb-3">
        <select
          className="form-control"
          value={filterNiveau}
          onChange={(e) => setFilterNiveau(e.target.value)}
        >
          <option value="">Tous les Niveaux</option>
         <option value="L1">L1</option>
          <option value="L2">L2</option>
          <option value="L3">L3</option>
          <option value="M1">M1</option>
          <option value="M2">M2</option>
          
          
        </select>
        <select
          className="form-control"
          value={filterFiliere}
          onChange={(e) => setFilterFiliere(e.target.value)}
        >
          <option value="">Sélectionner un parcours</option>
          <option value="Technicien de laboratoire">Technicien de laboratoire</option>
          <option value="Sciences infirmières">Sciences infirmières</option>
          <option value="Maieutique">Maieutique</option>
        </select>

        <select
          className="form-control"
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
        >
          <option value="">Statut</option>
          <option value="Effectuer">Tout Payer</option>
          <option value="Reste">Reste</option>
        </select>

        <input
          list="annees-universitaires"
          className="form-control filtreEco"
          value={filterAnnee}
          onChange={(e) => setFilterAnnee(e.target.value)}
          placeholder="Année universitaire"
        />

        <button className="btn btn-primary">{resultCount} Etudiants</button>
      </div>

      {/* Tableau */}
      <div className="historique-container">
        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : (
          <table className="historique-table">
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Niveau</th>
                <th>Spécialité</th>
                <th>Nom Frais</th>
                <th>Montant</th>
                <th>Déjà payé</th>
                <th>Reste à payer</th>
           
                <th>Année Universitaire</th>
              </tr>
            </thead>
            <tbody>
              {resultCount > 0 ? (
                paiements
                  .filter((paiement) => {
                    const niveauMatch = filterNiveau
                      ? paiement.niveau === filterNiveau
                      : true;
                    const filiereMatch = filterFiliere
                      ? paiement.filiere === filterFiliere
                      : true;
                    const anneeMatch = filterAnnee
                      ? paiement.anneeUniv === filterAnnee
                      : true;

                    const montantReste = parseFloat(paiement.montantReste);
                    let statutMatch = true;
                    if (filterStatut === "Effectuer") {
                      statutMatch = montantReste === 0;
                    } else if (filterStatut === "Reste") {
                      statutMatch = montantReste > 0;
                    }

                    return (
                      niveauMatch && filiereMatch && anneeMatch && statutMatch
                    );
                  })
                  .map((paiement, index) => (
                    <tr key={index}>
                      <td>{paiement.matricule}</td>
                      <td>{paiement.nom}</td>
                      <td>{paiement.prenom}</td>
                      <td>{paiement.niveau}</td>
                      <td>{paiement.filiere}</td>
                      <td>{paiement.nomFrais}</td>
                      <td>{paiement.montant} Ar</td>
                      <td>{paiement.montantPayer} Ar</td>
                      <td className={paiement.montantReste > 0 ? "text-danger" : "text-success"}>
                        {paiement.montantReste} Ar
                      </td>
                 
                      <td>{paiement.anneeUniv}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center">
                    Aucun paiement trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AutreFraisHistoriqueTable;