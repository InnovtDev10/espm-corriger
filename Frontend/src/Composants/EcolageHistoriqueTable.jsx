import { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/EcolageHistorique.css";

const EcolageHistoriqueTable = () => {
  const [paiements, setPaiements] = useState([]);
  const [filterNiveau, setFilterNiveau] = useState("");
  const [filterParcours, setFilterParcours] = useState("");
  const [searchNom, setSearchNom] = useState("");
  const [searchMatricule, setSearchMatricule] = useState("");
  const [mois, setMois] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [filterAnnee, setFilterAnnee] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultCount, setResultCount] = useState(0);
  const url = import.meta.env.VITE_API_URL;
  
  const resetFilters = () => {
    setFilterNiveau("");
    setFilterParcours("");
    setSearchNom("");
    setSearchMatricule("");
    setMois("");
    setFilterStatut("");
    setFilterAnnee("");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [paiementsRes, etudiantsRes] = await Promise.all([
          axios.get(`${url}/api/paiement/ecolage/all`, {
            headers: { 'Cache-Control': 'no-cache' }
          }),
          axios.get(`${url}/api/etudiant/tous`, {
            headers: { 'Cache-Control': 'no-cache' }
          })
        ]);

        const allPaiements = paiementsRes.data.data || [];
        const allEtudiants = Array.isArray(etudiantsRes.data) ? etudiantsRes.data : (etudiantsRes.data.data || []);

        console.log("Paiements bruts reçus:", allPaiements.length);
        console.log("Étudiants reçus:", allEtudiants.length);

        // Regrouper les paiements par matricule pour éviter les doublons d'affichage
        const paymentsByMatricule = allPaiements.reduce((acc, p) => {
          if (!acc[p.matricule] || new Date(p.updatedAt) > new Date(acc[p.matricule].updatedAt)) {
            acc[p.matricule] = p;
          }
          return acc;
        }, {});

        const tousLesMois = [
          "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
          "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
        ];

        // Créer la liste finale basée sur la liste exhaustive des étudiants
        const finalData = allEtudiants.map(e => {
          const paymentInfo = paymentsByMatricule[e.matricule];
          
          if (paymentInfo) {
            return {
              ...paymentInfo,
              nom: e.nom, // Priorité aux infos de la table Etudiant pour la cohérence
              prenom: e.prenom,
              niveau: e.niveau,
              filiere: e.filiere
            };
          } else {
            return {
              matricule: e.matricule,
              nom: e.nom,
              prenom: e.prenom,
              niveau: e.niveau,
              filiere: e.filiere,
              montantParMois: 0,
              moisEffectuer: [],
              moisRestant: tousLesMois,
              anneeUniv: "N/A",
              updatedAt: e.updatedAt || e.createdAt || new Date().toISOString()
            };
          }
        });

        console.log("Total final affiché (doit être 265):", finalData.length);
        setPaiements(finalData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  // Fonction pour filtrer les paiements selon les critères
  const getFilteredPaiements = () => {
    return paiements.filter((paiement) => {
      const nomMatch = searchNom
        ? paiement.nom.toLowerCase().includes(searchNom.toLowerCase()) || 
          paiement.prenom.toLowerCase().includes(searchNom.toLowerCase())
        : true;
      const matriculeMatch = searchMatricule
        ? paiement.matricule.toLowerCase().includes(searchMatricule.toLowerCase())
        : true;
      const niveauMatch = filterNiveau
        ? paiement.niveau === filterNiveau
        : true;
      const parcoursMatch = filterParcours
        ? paiement.filiere === filterParcours
        : true;
      const anneeMatch = filterAnnee
        ? paiement.anneeUniv === filterAnnee
        : true;

      let moisMatch = true;
      if (mois) {
        if (filterStatut === "Payé") {
          moisMatch = paiement.moisEffectuer?.includes(mois);
        } else if (filterStatut === "Non Payé") {
          moisMatch = paiement.moisRestant?.includes(mois);
        } else {
          moisMatch = (paiement.moisEffectuer?.includes(mois)) || (paiement.moisRestant?.includes(mois));
        }
      }

      // Filtre additionnel pour le statut global (si pas de mois sélectionné)
      let statutMatch = true;
      if (!mois && filterStatut) {
        if (filterStatut === "Payé") {
          statutMatch = paiement.moisEffectuer && paiement.moisEffectuer.length > 0;
        } else if (filterStatut === "Non Payé") {
          statutMatch = !paiement.moisEffectuer || paiement.moisEffectuer.length === 0;
        }
      }

      return nomMatch && matriculeMatch && niveauMatch && parcoursMatch && moisMatch && anneeMatch && statutMatch;
    });
  };

  useEffect(() => {
    setResultCount(getFilteredPaiements().length);
  }, [paiements, searchNom, searchMatricule, filterNiveau, filterParcours, mois, filterStatut, filterAnnee]);

  return (
    <div className="historique-ecolage mt-3">
      {/* Filtres */}
      <div className="filters d-flex flex-wrap gap-3 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher par nom..."
          value={searchNom}
          onChange={(e) => setSearchNom(e.target.value)}
          style={{ width: "200px" }}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Matricule..."
          value={searchMatricule}
          onChange={(e) => setSearchMatricule(e.target.value)}
          style={{ width: "150px" }}
        />
        <select
          className="form-control"
          value={filterNiveau}
          onChange={(e) => setFilterNiveau(e.target.value)}
          style={{ width: "150px" }}
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
          value={filterParcours}
          onChange={(e) => setFilterParcours(e.target.value)}
          style={{ width: "200px" }}
        >
          <option value="">Tous les Parcours</option>
          <option value="Technicien de laboratoire">Technicien de laboratoire</option>
          <option value="Sciences infirmières">Sciences infirmières</option>
          <option value="Maieutique">Maieutique</option>
        </select>

        <select
          className="form-control"
          value={mois}
          onChange={(e) => setMois(e.target.value)}
          style={{ width: "180px" }}
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
          style={{ width: "150px" }}
        >
          <option value="">Statut Paiement</option>
          <option value="Payé">Déjà Payé</option>
          <option value="Non Payé">Non Payé</option>
        </select>

        <input
          list="annees-universitaires"
          className="form-control filtreEco"
          value={filterAnnee}
          onChange={(e) => setFilterAnnee(e.target.value)}
          placeholder="Année universitaire"
          style={{ width: "180px" }}
        />

        <button className="btn btn-secondary" onClick={resetFilters}>
          Réinitialiser
        </button>

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
                getFilteredPaiements()
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
