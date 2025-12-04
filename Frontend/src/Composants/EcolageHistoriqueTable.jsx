import { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/EcolageHistorique.css";

const EcolageHistoriqueTable = () => {
  const [paiements, setPaiements] = useState([]);
  const [filterNiveau, setFilterNiveau] = useState("");
  const [mois, setMois] = useState("");
  const [filterAnnee, setFilterAnnee] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultCount, setResultCount] = useState(0);

  useEffect(() => {
    const fetchPaiements = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/paiement/ecolage/all"
        );
        setPaiements(response.data.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des paiements :", error);
      }
    };

    fetchPaiements();
  }, []);

  // Fonction pour filtrer les paiements selon les critères
  useEffect(() => {
    const filtered = paiements.filter((paiement) => {
      const niveauMatch = filterNiveau
        ? paiement.niveau === filterNiveau
        : true;
      const anneeMatch = filterAnnee
        ? paiement.anneeUniv === filterAnnee
        : true;

      let moisMatch = true;
      if (mois) {
        if (filterStatut === "Effectuer") {
          moisMatch = paiement.moisEffectuer?.includes(mois);
        } else if (filterStatut === "Non Effectuer") {
          moisMatch = paiement.moisRestant?.includes(mois);
        }
      }

      return niveauMatch && moisMatch && anneeMatch;
    });

    setResultCount(filtered.length);
  }, [paiements, filterNiveau, mois, filterAnnee, filterStatut]);

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
          value={mois}
          onChange={(e) => setMois(e.target.value)}
        >
          <option value="">Sélectionner un mois</option>
          <option value="Janvier">Janvier</option>
          <option value="Février">Février</option>
          <option value="Mars">Mars</option>
          <option value="Avril">Avril</option>
          <option value="Mai">Mai</option>
          <option value="Juin">Juin</option>
          <option value="Juillet">Juillet</option>
          <option value="Août">Août</option>
          <option value="Septembre">Septembre</option>
          <option value="Octobre">Octobre</option>
          <option value="Novembre">Novembre</option>
          <option value="Décembre">Décembre</option>
        </select>

        <select
          className="form-control"
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value)}
        >
          <option value="">Statut</option>
          <option value="Effectuer">Effectuer</option>
          <option value="Non Effectuer">Non Effectuer</option>
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
                <th>Filière</th>
                <th>Montant /mois</th>
                <th>Mois effectués</th>
                <th>Mois restants</th>
                <th>Année Scolaire</th>
                <th>Date dernier paiement</th>
              </tr>
            </thead>
            <tbody>
              {resultCount > 0 ? (
                paiements
                  .filter((paiement) => {
                    const niveauMatch = filterNiveau
                      ? paiement.niveau === filterNiveau
                      : true;
                    const anneeMatch = filterAnnee
                      ? paiement.anneeUniv === filterAnnee
                      : true;

                    let moisMatch = true;
                    if (mois) {
                      if (filterStatut === "Effectuer") {
                        moisMatch = paiement.moisEffectuer?.includes(mois);
                      } else if (filterStatut === "Non Effectuer") {
                        moisMatch = paiement.moisRestant?.includes(mois);
                      }
                    }

                    return niveauMatch && moisMatch && anneeMatch;
                  })
                  .map((paiement, index) => (
                    <tr key={index}>
                      <td>{paiement.matricule}</td>
                      <td>{paiement.nom}</td>
                      <td>{paiement.prenom}</td>
                      <td>{paiement.niveau}</td>
                      <td>{paiement.filiere}</td>
                      <td>{paiement.montantParMois} Ar</td>
                      <td>{paiement.moisEffectuer?.join(", ") || "Aucun"}</td>
                      <td>{paiement.moisRestant?.join(", ") || "Aucun"}</td>
                      <td>{paiement.anneeUniv}</td>
                      <td>
                        {new Date(paiement.updatedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">
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

export default EcolageHistoriqueTable;
