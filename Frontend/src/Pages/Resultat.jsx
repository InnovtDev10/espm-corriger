import React, { useState } from "react";
import Navbar from "../Composants/Navbar";
import Sidebar from "../Composants/Sidebar";
import ResultatTable from "../Composants/ResultatTable";
import "../Styles/Professeur.css";

function Resultat() {
    const [searchMatricule, setSearchMatricule] = useState("");
    const [niveau, setNiveau] = useState("");
    const [semestre, setSemestre] = useState("");
    const [filiere, setFiliere] = useState(""); 
    const [status, setStatus] = useState("");
    const [anneeUniversitaire, setAnneeUniversitaire] = useState("");

    // États pour les filtres des moyennes (on enlève les valeurs max)
    const [moyenneTheorique, setMoyenneTheorique] = useState("");
    const [moyennePratique, setMoyennePratique] = useState("");
    const [moyenneMemoire, setMoyenneMemoire] = useState("");
    const [moyenneGenerale, setMoyenneGenerale] = useState("");

    const niveaux = ["L1", "L2", "L3","M1","M2"];
    const filieres = ["Technicien de laboratoire", "Sciences infirmières", "Maieutique"];

    return (
        <>
            <header className="pt-3">
                <Navbar />
            </header>
            <main className="center p-3">
                <aside className="p-3">
                    <Sidebar />
                </aside>
                <section className="contenu2 mt-3 p-4">
                    <h4 className="fw-bold">Résultats des évaluations</h4>
                    <div className="hr mt-3"></div>

                    {/* Filtres principaux */}
                    <div className="filtre-container mt-3 d-flex justify-content-between">
                        <input
                            type="text"
                            placeholder="Matricule"
                            className="form-control me-2"
                            value={searchMatricule}
                            onChange={(e) => setSearchMatricule(e.target.value)}
                        />
                        <select
                            className="form-select me-2"
                            value={niveau}
                            onChange={(e) => setNiveau(e.target.value)}
                        >
                            <option value="">Sélectionner Niveau</option>
                            {niveaux.map((niv) => (
                                <option key={niv} value={niv}>{niv}</option>
                            ))}
                        </select>

                        <select
                            className="form-select me-2"
                            value={filiere}
                            onChange={(e) => setFiliere(e.target.value)}
                        >
                            <option value="">Sélectionner Filière</option>
                            {filieres.map((fil) => (
                                <option key={fil} value={fil}>{fil}</option>
                            ))}
                        </select>

                        <select
                            className="form-select"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Sélectionner Status</option>
                            <option value="Admis">Admis</option>
                            <option value="Ajourné">Ajourné</option>
                        </select>
                        
                        <input
                            type="text"
                            placeholder="Année Universitaire (ex: 2023-2024)"
                            className="form-control me-2"
                            value={anneeUniversitaire}
                            onChange={(e) => setAnneeUniversitaire(e.target.value)}
                        />
                    </div>

                    {/* Filtres pour les moyennes */}
                    <div className="filtre-container mt-3">
                        <h5>Filtrer par Moyenne</h5>
                        <div className="d-flex justify-content-between">
                            <input
                                type="number"
                                placeholder="Théorique"
                                className="form-control me-2"
                                value={moyenneTheorique}b                                                                                                                                             
                                onChange={(e) => setMoyenneTheorique(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Pratique"
                                className="form-control me-2"
                                value={moyennePratique}
                                onChange={(e) => setMoyennePratique(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Mémoire"
                                className="form-control me-2"
                                value={moyenneMemoire}
                                onChange={(e) => setMoyenneMemoire(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Générale"
                                className="form-control me-2"
                                value={moyenneGenerale}
                                onChange={(e) => setMoyenneGenerale(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Tableau des résultats */}
                    <ResultatTable 
                        searchMatricule={searchMatricule} 
                        niveau={niveau} 
                        semestre={semestre} 
                        filiere={filiere} 
                        moyenneTheorique={moyenneTheorique}
                        moyennePratique={moyennePratique}
                        moyenneMemoire={moyenneMemoire}
                        moyenneGenerale={moyenneGenerale}
                        status={status}
                        anneeUniversitaire={anneeUniversitaire}
                    />
                </section>
            </main>
        </>
    );
}

export default Resultat;
