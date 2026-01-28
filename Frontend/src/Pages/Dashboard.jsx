// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import Navbar from "../Composants/Navbar";
import Sidebar from "../Composants/Sidebar";

import DashTable from "../Composants/DashTable";
import "../Styles/Home.css";
import axios from "axios";

function Dashboard() {
  const [counts, setCounts] = useState({
    infirmier: 0,
    sageFemme: 0,
    bioTechnicien: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/etudiant/count"
        );
        setCounts({
          infirmier: response.data.totalInfirmiers,
          sageFemme: response.data.totalSageFemmes,
          bioTechnicien: response.data.totalBioTechniciens,
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchCounts();
  }, []);
  const [searchName, setSearchName] = useState("");
  const [searchMatricule, setSearchMatricule] = useState("");
  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [selectedAnnee, setSelectedAnnee] = useState("");

  return (
    <>
      <header className="pt-3">
        <Navbar />
      </header>
      <main className="center p-3">
        <aside className="p-3">
          <Sidebar />
        </aside>
        <section className="contenu2 mt-3 p-3">
          <div className="stats">
            <p className="alert alert-success fw-bold">
              <i className="fa fa-line-chart"></i> Tableau de bord génerale au
              sein de l&apos;établissement
            </p>

            <div className="mt-2 center">
              <div className="stat center p-1">
                <div className="nbr center p-5">
                  <h1 className="text-light">{counts.infirmier}</h1>
                </div>
                <div className="text center">
                  <h5 className="text-light p-2">Etudiants Technicien de laboratoire</h5>
                </div>
              </div>
              <div className="stat center p-1">
                <div className="nbr center p-5">
                  <h1 className="text-light">{counts.sageFemme}</h1>
                </div>
                <div className="text center">
                  <h5 className="text-light ">Etudiants Sciences infirmières</h5>
                </div>
              </div>
              <div className="stat center p-1">
                <div className="nbr center p-5">
                  <h1 className="text-light">{counts.bioTechnicien}</h1>
                </div>
                <div className="text center">
                  <h5 className="text-light p-2">Etudiants Maieutique</h5>
                </div>
              </div>
            </div>
          </div>
          <div className="historique mt-2 bg-light p-4">
            <h4 className="fw-bold">Liste de tous les étudiants</h4>
            <div className="filtre center mb-3 mt-3">
              <input
                type="text"
                placeholder="Recherche par nom"
                className="form-control"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Matricule"
                className="form-control"
                value={searchMatricule}
                onChange={(e) => setSearchMatricule(e.target.value)}
              />
              <select
                className="form-control"
                value={selectedFiliere}
                onChange={(e) => setSelectedFiliere(e.target.value)}
              >
                <option value="">Toutes les filières</option>
                <option>Technicien de laboratoire</option>
                <option>Sciences infirmières</option>
                <option>Maieutique</option>
              </select>
              <select
                className="form-control"
                value={selectedNiveau}
                onChange={(e) => setSelectedNiveau(e.target.value)}
              >
                <option value="">Tous les niveaux</option>
                <option value="L1">L1</option>
                <option value="L2">L2</option>
                <option value="L3">L3</option>
                <option value="M1">M1</option>
          <option value="M2">M2</option>
              </select>
            </div>

            <DashTable
              searchName={searchName}
              searchMatricule={searchMatricule}
              selectedFiliere={selectedFiliere}
              selectedNiveau={selectedNiveau}
              selectedAnnee={selectedAnnee}
            />
          </div>
        </section>
      </main>
      <footer></footer>
    </>
  );
}

export default Dashboard;
