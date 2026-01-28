import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../Composants/Navbar";
import Sidebar from "../Composants/Sidebar";
import "../Styles/Etudiant.css";
import { useNavigate } from "react-router-dom";

const TableauMat = () => {
  const [unites, setUnites] = useState([]);
  const [selectedFiliere, setSelectedFiliere] = useState("");
  const navigate = useNavigate();
  const naviguerVersMatieres = () => {
    navigate("/matieres");
  };
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/matiere/tous")
      .then((response) => {
        console.log("Données reçues du backend:", response.data); // 🔍 Vérification des données
        setUnites(response.data);
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des données:", error)
      );
  }, []);

  const handleDeleteUnite = (id) => {
    Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Cette action est irréversible!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5000/api/matiere/delete/${id}`)
          .then(() => {
            setUnites(unites.filter((unite) => unite.id !== id));
            Swal.fire("Supprimé!", "L'unité a été supprimée.", "success");
          })
          .catch((error) =>
            Swal.fire(
              "Erreur",
              "Une erreur est survenue lors de la suppression",
              "error"
            )
          );
      }
    });
  };

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
          <h4 className="fw-bold">
            Liste des Unités d'Enseignement & Matières
          </h4>
          <div className="d-flex justify-content-end align-items-center">
            <button
              className="btn btn-primary mb-0"
              onClick={naviguerVersMatieres}
            >
              Retour
            </button>
          </div>
          <div className="hr mt-2"></div>

          <div className="d-flex justify-content-end mt-3">
            <label className="fw-bold me-2">Filtrer par parcours :</label>
            <select
              className="form-control w-auto"
              value={selectedFiliere}
              onChange={(e) => setSelectedFiliere(e.target.value)}
            >
              <option value="">Toutes</option>
              <option value="Technicien de laboratoire">Technicien de laboratoire</option>
              <option value="Sciences infirmières">Sciences infirmières</option>
              <option value="Maieutique">Maieutique</option>
            </select>
          </div>

          <table className="table table-striped table-bordered text-center shadow-sm mt-4">
            <thead className="table">
              <tr>
                <th>Parcours</th>
                <th>Unité d'Enseignement</th>
                <th>Matières</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {unites
                .filter(
                  (unite) =>
                    selectedFiliere === "" || unite.filiere === selectedFiliere
                )
                .map((unite, index) => (
                  <tr key={index}>
                    <td>{unite.filiere}</td>

                    {/* Afficher les Unités d'Enseignement */}
                    <td>
                      {unite.matieres.map((matiere, idx) => (
                        <div key={idx}>{matiere.nom}</div> // Affiche les noms des unités
                      ))}
                    </td>

                    {/* Afficher les Matières */}
                    <td>
                      {unite.matieres.map((matiere, idx) => (
                        <div key={idx}>{matiere.matieres.join(", ")}</div>
                      ))}
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteUnite(unite.id)}
                      >
                        <FaTrash /> Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      </main>
      <footer></footer>
    </>
  );
};

export default TableauMat;
