import React from "react";
import Navbar from "../Composants/Navbar";
import Sidebar from "../Composants/Sidebar";
import "../Styles/Professeur.css";
import FournitureTable from "../Composants/FournitureTable";
import AttributionFourniture from "../Composants/AttributionFourniture";
import SortieHistoriqueTable from "../Composants/SortieHistoriqueTable";

function Fourniture() {
  return (
    <>
      <header className="pt-3">
        <Navbar />
      </header>
      <main className="center p-3">
        <aside className="p-3">
          <Sidebar />
        </aside>
        <section className="contenu mt-3 p-4">
          <h4 className="fw-bold">Gestion des Fournitures</h4>
          <div className="hr mt-5"></div>

          {/* Conteneur du tableau des fournitures */}
          <div className="table3-container">
            <FournitureTable />
          </div>

          {/* Conteneur du tableau d'historique des sorties */}
          <div className="table3-container mt-2">
            <SortieHistoriqueTable />
          </div>
        </section>
        <article className="p-3">
          <AttributionFourniture />
        </article>
      </main>
      <footer></footer>
    </>
  );
}

export default Fourniture;
