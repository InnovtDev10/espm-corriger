import React, { useState, useEffect } from "react";
import Navbar from "../Composants/Navbar";
import Sidebar from "../Composants/Sidebar";
import FraisTable from "../Composants/FraisTable";
import "../Styles/Classe.css";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Button } from "react-bootstrap";
import { FaPen, FaTrash } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

function Frais() {
  const url = import.meta.env.VITE_API_URL;
  const [niveau, setNiveau] = useState(["L1", "L2", "L3","M1","M2"]);
  const [montant, setMontant] = useState("");
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [specialite, setSpecialite] = useState([
    "Technicien de laboratoire",
    "Sciences infirmières",
    "Maieutique",
  ]);
  const [frais, setFrais] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFrais, setSelectedFrais] = useState(null);

  const navigate = useNavigate();

  // Handle niveau change
  const handleNiveauChange = (e) => {
    const selectedValues = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    if (selectedValues.includes("Tous")) {
      setNiveau(["L1", "L2", "L3","M1","M2"]);
    } else {
      setNiveau(selectedValues);
    }
  };

  // Handle specialite change
  const handleSpecialiteChange = (e) => {
    const selectedValues = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    if (selectedValues.includes("Tous")) {
      setSpecialite([
        "Technicien de laboratoire",
        "Sciences infirmières",
        "Maieutique",
      ]);
    } else {
      setSpecialite(selectedValues);
    }
  };

  // Fetch frais data
  useEffect(() => {
    const fetchFrais = async () => {
      try {
        const response = await axios.get(
          `${url}/api/frais/tous`,
          {
            headers: {
              'Cache-Control': 'no-cache'
            }
          }
        );
        setFrais(response.data);
      } catch (error) {
        console.error("Error fetching frais data:", error);
      }
    };

    fetchFrais();
  }, []);

  const handleAddFrais = async () => {
    if (niveau && montant && nom && specialite && description) {
      const newFrais = { niveau, montant, nom, specialite, description };

      try {
        await axios.post(`${url}/api/frais/add`, newFrais);
        setFrais([...frais, newFrais]);
        setNiveau("");
        setMontant("");
        setNom("");
        setSpecialite("");
        setDescription("");

        Swal.fire("Succès", "Autres frais ajouté avec succès !", "success");
        window.location.reload();
      } catch (error) {
        console.error("Error adding frais:", error);
        Swal.fire(
          "Erreur",
          "Une erreur s'est produite lors de l'ajout.",
          "error"
        );
      }
    }
  };

  const handleEdit = (frais) => {
    setSelectedFrais(frais);
    setNom(frais.nom);
    setNiveau(frais.niveau);
    setSpecialite(frais.specialite);
    setMontant(frais.montant);
    setDescription(frais.description);
    setShowEditModal(true);
  };

  const handleDelete = (frais) => {
    setSelectedFrais(frais);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${url}/api/frais/delete/${selectedFrais.id}`
      );
      setFrais(frais.filter((f) => f.id !== selectedFrais.id));
      setShowDeleteModal(false);
      Swal.fire("Supprimé!", "Le frais a été supprimé avec succès.", "success");
    } catch (error) {
      console.error("Error deleting frais:", error);
      Swal.fire(
        "Erreur",
        "Une erreur s'est produite lors de la suppression.",
        "error"
      );
    }
  };

  const handleUpdateFrais = async () => {
    if (selectedFrais) {
      // Assurez-vous que niveau et specialite sont des tableaux
      const updatedFrais = {
        nom,
        niveau: Array.isArray(niveau) ? niveau : [niveau], // Convertir en tableau si nécessaire
        specialite: Array.isArray(specialite) ? specialite : [specialite], // Convertir en tableau si nécessaire
        montant,
        description,
      };

      try {
        await axios.put(
          `${url}/api/frais/update/${selectedFrais.id}`,
          updatedFrais
        );

        // Mettre à jour l'état des frais dans l'UI
        setFrais(
          frais.map((f) =>
            f.id === selectedFrais.id ? { ...f, ...updatedFrais } : f
          )
        );
        setNom("");
        setNiveau("");
        setSpecialite("");
        setMontant("");
        setDescription("");
        setShowEditModal(false);
        Swal.fire("Succès", "Frais mis à jour avec succès !", "success");
      } catch (error) {
        console.error("Erreur lors de la mise à jour du frais:", error);
        Swal.fire(
          "Erreur",
          "Une erreur s'est produite lors de la mise à jour.",
          "error"
        );
      }
    }
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
          <div className="header-section">
            <h4 className="fw-bold">Autres Frais</h4>
            <button
              className="payment-btn"
              onClick={() => navigate("/autrefraishistorique")}
            >
              <GiReceiveMoney size={24} /> Voir les historiques
            </button>
          </div>
          <div className="hr mt-2"></div>

          <div className="niveau-container">
            {/* Formulaire d'ajout de frais */}
            <div className="niveau-form">
              <h5>Ajouter un autre frais</h5>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  placeholder="Nom du frais"
                  className="form-control"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                />
                <select
                  className="form-control mb-2"
                  value={specialite}
                  onChange={handleSpecialiteChange}
                >
                  <option value="Tous">Toutes les spécialités</option>
                  <option value="Technicien de laboratoire">
                    Technicien de laboratoire
                  </option>
                  <option value="Sciences infirmières">Sciences infirmières</option>
                  <option value="Maieutique">
                    Maieutique
                  </option>
                </select>
              </div>
              <div className="d-flex gap-2 ">
                <select
                  className="form-control mb-2"
                  value={niveau}
                  onChange={handleNiveauChange}
                >
                  <option value="Tous">Tous les niveaux</option>
                  <option value="L1">L1</option>
                  <option value="L2">L2</option>
                  <option value="L3">L3</option>
                  <option value="M1">M1</option>
            <option value="M2">M2</option>
                </select>
                <input
                  type="number"
                  placeholder="Montant"
                  className="form-control mb-2"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                />
              </div>
              <div className="d-flex gap-2 ">
                <textarea
                  placeholder="Description"
                  className="form-control mb-0"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="2"
                ></textarea>
                <button
                  className="btn btn-success   h-100"
                  onClick={handleAddFrais}
                >
                  Enregistrer
                </button>
              </div>
            </div>

            {/* Tableau des frais */}
            <div className="niveau-table">
              <h5>Liste des Frais supplémentaires</h5>

              <div style={{ maxHeight: "180px", overflowY: "auto" }}>
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", border: "none" }}>Nom</th>
                      <th style={{ textAlign: "left", border: "none" }}>
                        Niveau
                      </th>
                      <th style={{ textAlign: "left", border: "none" }}>
                        Spécialité
                      </th>
                      <th style={{ textAlign: "left", border: "none" }}>
                        Déscription
                      </th>
                      <th style={{ textAlign: "left", border: "none" }}>
                        Montant
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          width: "100px",
                          border: "none",
                        }}
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {frais.map((niv, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: "left", border: "none" }}>
                          {niv.nom}
                        </td>
                        <td style={{ textAlign: "left", border: "none" }}>
                          {Array.isArray(niv.niveau)
                            ? niv.niveau.join(", ")
                            : niv.niveau}
                        </td>
                        <td style={{ textAlign: "left", border: "none" }}>
                          {Array.isArray(niv.specialite)
                            ? niv.specialite.join(", ")
                            : niv.specialite}
                        </td>
                        <td style={{ textAlign: "left", border: "none" }}>
                          {niv.description}
                        </td>
                        <td style={{ textAlign: "left", border: "none" }}>
                          {niv.montant} Ar
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            padding: "5px",
                            border: "none",
                          }}
                        >
                          <div style={{ display: "inline-flex", gap: "5px" }}>
                            <button
                              className="edit-btn"
                              onClick={() => handleEdit(niv)}
                              style={{
                                fontSize: "14px",
                                padding: "5px",
                                border: "none",
                              }}
                            >
                              <FaPen size={14} />
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDelete(niv)}
                              style={{
                                fontSize: "14px",
                                padding: "5px",
                                border: "none",
                              }}
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Tableau général des classes */}
          <FraisTable />
        </section>
      </main>

      {/* Modal d'édition */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier un frais</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            placeholder="Nom du frais"
            className="form-control"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
          <input
            type="text"
            placeholder="Niveau"
            className="form-control"
            value={niveau}
            onChange={(e) => setNiveau(e.target.value)}
          />
          <input
            type="text"
            placeholder="Spécialité"
            className="form-control"
            value={specialite}
            onChange={(e) => setSpecialite(e.target.value)}
          />
          <input
            type="number"
            placeholder="Montant"
            className="form-control"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
          />
          <textarea
            placeholder="Description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleUpdateFrais}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Êtes-vous sûr de vouloir supprimer ce frais ?</p>
          <p className="fw-bold">Niveau : {selectedFrais?.niveau}</p>
          <p className="fw-bold">Montant : {selectedFrais?.montant} Ar</p>
          <p className="fw-bold">Spécialité : {selectedFrais?.specialite}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
      <footer></footer>
    </>
  );
}

export default Frais;
