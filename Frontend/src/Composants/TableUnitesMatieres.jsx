import { useState } from "react";
import { FaTrash, FaPlus, FaEdit, FaCheck } from "react-icons/fa";
import "../Styles/Matieres.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const TableUnitesMatieres = () => {
  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [unites, setUnites] = useState([]);
  const [editUniteIndex, setEditUniteIndex] = useState(null);
  const [editMatiereIndex, setEditMatiereIndex] = useState(null);
  const [newUnite, setNewUnite] = useState("");
  const [newMatiere, setNewMatiere] = useState("");
  const [filiere, setFiliere] = useState("");
  const navigate = useNavigate();

  const naviguerVersMatieres = () => {
    navigate("/programme");
  };
  const naviguerVerListe = () => {
    navigate("/matliste");
  };

  const handleAddUnite = () => {
    if (newUnite.trim() !== "") {
      setUnites([
        ...unites,
        { nom: newUnite, filiere: selectedFiliere, matieres: [] },
      ]);
      setNewUnite("");
    }
  };

  const handleEditUnite = (index, value) => {
    const updatedUnites = [...unites];
    updatedUnites[index].nom = value;
    setUnites(updatedUnites);
  };

  const handleDeleteUnite = (index) => {
    setUnites(unites.filter((_, i) => i !== index));
  };

  const handleAddMatiere = (index) => {
    if (newMatiere.trim() !== "") {
      const updatedUnites = [...unites];
      updatedUnites[index].matieres.push(newMatiere);
      setUnites(updatedUnites);
      setNewMatiere("");
    }
  };

  const handleEditMatiere = (uniteIndex, matiereIndex, value) => {
    const updatedUnites = [...unites];
    updatedUnites[uniteIndex].matieres[matiereIndex] = value;
    setUnites(updatedUnites);
  };

  const handleDeleteMatiere = (uniteIndex, matiereIndex) => {
    const updatedUnites = [...unites];
    updatedUnites[uniteIndex].matieres.splice(matiereIndex, 1);
    setUnites(updatedUnites);
  };

  const handleSaveMatiere = (uniteIndex, matiereIndex) => {
    setEditMatiereIndex(null);
  };

  const handleSaveUnite = () => {
    // Vérification si l'unité est valide avant d'y accéder
    if (!unites || unites.length === 0) {
      console.error("Aucune unité à sauvegarder");
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Il n'y a aucune unité à sauvegarder.",
      });
      return;
    }
    // Vérifier que la filière est bien sélectionnée
    if (!filiere) {
      console.error("Filière non sélectionnée");
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez sélectionner une filière.",
      });
      return;
    }

    // Préparer les données
    const dataToSend = {
      filiere: filiere,
      matieres: unites.map((unite) => ({
        nom: unite.nom,
        matieres: unite.matieres,
      })),
    };

    // Envoi des données de l'unité à l'API
    axios
      .post("http://localhost:5000/api/matiere/add", dataToSend)
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Unité enregistrée avec succès",
          text: response.data.message,
        });
        setUnites([]);
        setFiliere("");
        setNewUnite("");
        setNewMatiere("");
        setEditUniteIndex(null);
        setEditMatiereIndex(null);
      })
      .catch((error) => {
        console.error("Erreur lors de la sauvegarde:", error);
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Une erreur est survenue lors de l'enregistrement de l'unité.",
        });
      });
  };

  return (
    <div>
      <h5 className="fw-bold">Gestion des Unités d'Enseignement</h5>
      <div className="d-flex justify-content-end align-items-center">
        <button className="btn btn-success mb-0" onClick={naviguerVersMatieres}>
          Retour
        </button>
        <button className="btn btn-primary mb-0" onClick={naviguerVerListe}>
          Voir la liste
        </button>
      </div>
      <div className="hr mt-2 mb-4"></div>

      {/* Formulaire pour ajouter une unité */}
      <div className="form-container p-4 border rounded shadow-sm mb-4 bg-light">
        <label className="fw-bold">Nouvelle Unité d'Enseignement :</label>
        <div className="d-flex gap-3 align-items-center">
          <input
            type="text"
            className="form-control"
            placeholder="Nom de l'unité"
            value={newUnite}
            onChange={(e) => setNewUnite(e.target.value)}
          />
          <select
            className="form-control"
            value={filiere}
            onChange={(e) => {
              setFiliere(e.target.value);
              console.log("Filière sélectionnée:", e.target.value); // Ajout du log ici
            }}
          >
            <option value="">Sélectionner une filière</option>
            <option value="Gestion">Gestion</option>
            <option value="Commerce">Commerce</option>
            <option value="Tourisme">
              Tourisme
            </option>
          </select>

          <button
            type="button"
            className="btn btn-success"
            onClick={handleAddUnite}
          >
            <FaPlus /> Ajouter
          </button>
        </div>
      </div>

      {/* Tableau des unités d'enseignement */}
      <div className="d-flex justify-content-end mb-3">
        <label className="fw-bold me-2">Filtrer par filière :</label>
        <select
          className="form-control w-auto"
          value={selectedFiliere}
          onChange={(e) => setSelectedFiliere(e.target.value)}
        >
          <option value="">Toutes</option>
          <option value="Gestion">Gestion</option>
          <option value="Commerce">Commerce</option>
          <option value="Tourisme">
            Tourisme
          </option>
        </select>
      </div>

      <div className="Tablemat">
        <table
          className="table table-striped table-bordered text-center shadow-sm w-100"
          style={{
            display: "block",
            maxHeight: "400px",
            overflowY: "auto",
            width: "100%",
          }}
        >
          <thead className="table">
            <tr>
              <th>Unité d'Enseignement</th>
              <th>Matières</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {unites.map((unite, uniteIndex) => (
              <tr key={uniteIndex}>
                <td className="align-middle">
                  {editUniteIndex === uniteIndex ? (
                    <div className="d-flex gap-2">
                      <input
                        type="text"
                        className="form-control"
                        value={unite.nom}
                        onChange={(e) =>
                          handleEditUnite(uniteIndex, e.target.value)
                        }
                      />
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleSaveUnite(uniteIndex)}
                      >
                        <FaCheck />
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{unite.nom}</span>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => setEditUniteIndex(uniteIndex)}
                      >
                        <FaEdit />
                      </button>
                    </div>
                  )}
                </td>

                <td>
                  <ul className="list-unstyled">
                    {unite.matieres.map((matiere, matiereIndex) => (
                      <li
                        key={matiereIndex}
                        className="d-flex justify-content-between align-items-center"
                      >
                        {editMatiereIndex ===
                        `${uniteIndex}-${matiereIndex}` ? (
                          <div className="d-flex gap-2">
                            <input
                              type="text"
                              className="form-control"
                              value={matiere}
                              onChange={(e) =>
                                handleEditMatiere(
                                  uniteIndex,
                                  matiereIndex,
                                  e.target.value
                                )
                              }
                            />
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() =>
                                handleSaveMatiere(uniteIndex, matiereIndex)
                              }
                            >
                              <FaCheck />
                            </button>
                          </div>
                        ) : (
                          <div className="d-flex justify-content-between w-100">
                            <span>{matiere}</span>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() =>
                                handleDeleteMatiere(uniteIndex, matiereIndex)
                              }
                            >
                              <FaTrash />
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>

                  {/* Ajout d'une matière */}
                  <div className="d-flex mt-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ajouter une matière"
                      value={newMatiere}
                      onChange={(e) => setNewMatiere(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-sm btn-success ms-2"
                      onClick={() => handleAddMatiere(uniteIndex)}
                    >
                      <FaPlus />
                      Ajouter
                    </button>
                  </div>
                </td>

                <td className="align-middle">
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteUnite(uniteIndex)}
                    >
                      <FaTrash />
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="btnMatiere">
          <button className="btn btn-sm btn-success" onClick={handleSaveUnite}>
            <FaCheck />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableUnitesMatieres;
