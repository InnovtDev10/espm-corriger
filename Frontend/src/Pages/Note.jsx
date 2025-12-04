import React, { useState, useEffect } from "react";
import axios from "axios"; // Ajoutez axios si ce n'est pas déjà importé
import Navbar from "../Composants/Navbar";
import Sidebar from "../Composants/Sidebar";
import NoteTable from "../Composants/NoteTable";
import "../Styles/Professeur.css";
import { useNavigate } from "react-router-dom";
import NotePratiqueTable from "../Composants/NotePratiqueTable";

function Note() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [matricule, setMatricule] = useState(""); // Ajouter un état pour le matricule

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/etudiant/tous"
        );
        setStudents(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des étudiants :", error);
      }
    };
    fetchStudents();
  }, []);

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
          <h4 className="fw-bold">Gestion des Notes</h4>
          <button className="payment2-btn" onClick={() => navigate("/notemaj")}>
            <i className="fas fa-money-bill-wave"></i> Attribution des notes
          </button>

          <div className="hr mt-2"></div>
          <div className="filtre mt-3">
            <input
              type="text"
              placeholder="Matricule"
              className="form-control"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
            />
          </div>
          <h4 className="mt-2">Notes Théoriques</h4>
          <NoteTable matricule={matricule} />
          <h4 className="mt-2">Notes Pratiques</h4>
          <NotePratiqueTable matricule={matricule} />
        </section>
      </main>
      <footer></footer>
    </>
  );
}

export default Note;
