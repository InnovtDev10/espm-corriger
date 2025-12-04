import React, { useState } from "react";
import Navbar from "../Composants/Navbar";
import Sidebar from "../Composants/Sidebar";
import FormulaireMatieres from "../Composants/FormulaireMatieres";
import TableUnitesMatieres from "../Composants/TableUnitesMatieres";

function Matieres() {
  // États pour stocker les données nécessaires
  const [filiere, setFiliere] = useState(""); // Exemple de valeur initiale
  const [niveauxSemestres, setNiveauxSemestres] = useState({}); // Objet vide par défaut
  const [unitesEtMatieres, setUnitesEtMatieres] = useState([]); // Tableau vide par défaut

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
          {/* Tableau des unités */}
          <TableUnitesMatieres />
        </section>
             {/* Formulaire d'ajout */}  
      </main>
      <footer></footer>
    </>
  );
}

export default Matieres;
