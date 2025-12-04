import React, { useState, useEffect } from "react";
import Navbar from "../Composants/Navbar";
import Sidebar from "../Composants/Sidebar";
import ClasseTable from "../Composants/ClasseTable";
import "../Styles/Classe.css";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaPen, FaTrash } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi"; // Ajoute l'import pour l'icône

function Classe() {
  const [ecolages, setEcolages] = useState([]);
  const [niveau, setNiveau] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [ecolage, setEcolage] = useState("");
  const [droit, setDroit] = useState("");
  const [anneeUniv, setAnneeUniv] = useState("");
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedEcolage, setSelectedEcolage] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedEcolageForDelete, setSelectedEcolageForDelete] =
    useState(null);

  const navigate = useNavigate();

  const openModalEdit = (item) => {
    setSelectedEcolage(item);
    setShowModalEdit(true);
  };

  const closeModalEdit = () => {
    setShowModalEdit(false);
    setSelectedEcolage(null);
  };

  const openConfirmDeleteModal = (item) => {
    setSelectedEcolageForDelete(item);
    setShowConfirmModal(true);
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setSelectedEcolageForDelete(null);
  };

  const confirmDelete = async () => {
    if (selectedEcolageForDelete) {
      try {
        await axios.delete(
          `http://localhost:5000/api/ecolage/delete/${selectedEcolageForDelete.id}`
        );
        setEcolages(
          ecolages.filter(
            (ecolage) => ecolage.id !== selectedEcolageForDelete.id
          )
        );
        Swal.fire("Succès", "Écolage supprimé avec succès !", "success");
      } catch (error) {
        console.error("Erreur lors de la suppression de l'écolage:", error);
        Swal.fire(
          "Erreur",
          "Une erreur s'est produite lors de la suppression.",
          "error"
        );
      }
    }
    setShowConfirmModal(false);
    setSelectedEcolageForDelete(null);
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/ecolage/get")
      .then((response) => {
        setEcolages(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des écolages:", error);
      });
  }, []);

  const handleAddEcolage = async () => {
    if (!niveau || !specialite || !droit || !ecolage || !anneeUniv) {
      Swal.fire("Erreur", "Veuillez remplir tous les champs !", "error");
      return;
    }

    const newEcolage = {
      niveau,
      specialite,
      droit,
      ecolage,
      anneeUniv,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ecolage/add",
        newEcolage
      );
      setEcolages([...ecolages, response.data]);
      setNiveau("");
      setSpecialite("");
      setDroit("");
      setEcolage("");
      setAnneeUniv("");

      Swal.fire("Succès", "Écolage & Droit ajouté avec succès !", "success");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'écolage:", error);
      Swal.fire(
        "Erreur",
        "Une erreur s'est produite lors de l'ajout.",
        "error"
      );
    }
  };

  const handleUpdate = async () => {
    if (!selectedEcolage) return;

    const updatedEcolage = {
      niveau: selectedEcolage.niveau,
      specialite: selectedEcolage.specialite,
      droit: selectedEcolage.droit,
      ecolage: selectedEcolage.ecolage,
      anneeUniv: selectedEcolage.anneeUniv,
    };

    try {
      // Effectuer la requête PUT pour mettre à jour l'écologie
      const response = await axios.put(
        `http://localhost:5000/api/ecolage/update/${selectedEcolage.id}`,
        updatedEcolage
      );

      // Mettre à jour la liste des écologies avec la version modifiée
      setEcolages(
        ecolages.map((item) =>
          item.id === selectedEcolage.id ? response.data : item
        )
      );

      Swal.fire("Succès", "Écolage & Droit modifié avec succès !", "success");
      closeModalEdit();
    } catch (error) {
      console.error("Erreur lors de la modification de l'écolage:", error);
      Swal.fire(
        "Erreur",
        "Une erreur s'est produite lors de la modification.",
        "error"
      );
    }
  };
  const ecolagesFiltres = ecolages.filter((item) => {
    return (
      (niveau === "" || item.niveau === niveau) &&
      (specialite === "" || item.specialite === specialite)
    );
  });
  // Générer dynamiquement toutes les années académiques à partir de 2024
  const anneesAcademiques = [];
  const startYear = 2024;
  const currentYear = new Date().getFullYear(); // Année actuelle

  for (
    let anneeDebut = startYear;
    anneeDebut <= currentYear + 10;
    anneeDebut++
  ) {
    const anneeFin = anneeDebut + 1;
    anneesAcademiques.push(`${anneeDebut}-${anneeFin}`);
  }

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
            <h4 className="fw-bold">Droit & Ecolage</h4>
            <button
              className="payment-btn"
              onClick={() => navigate("/ecolagePayment")}
            >
              <GiReceiveMoney size={24} /> Paiement Ecolage
            </button>
          </div>

          <div className="hr mt-2"></div>

          <div className="niveau-container">
            <div className="niveau-form">
              <h5>Ajouter Droit & Écolage</h5>
              <div className="d-flex gap-2">
                <select
                  className="form-control mb-2"
                  value={niveau}
                  onChange={(e) => setNiveau(e.target.value)}
                >
                  <option value="">Niveau</option>
                  <option value="L1">L1</option>
                  <option value="L2">L2</option>
                  <option value="L3">L3</option>
                  <option value="M1">M1</option>
                  <option value="M2">M2</option>
                </select>
                <select
                  className="form-control mb-2"
                  value={specialite}
                  onChange={(e) => setSpecialite(e.target.value)}
                >
                  <option value="">Filière</option>
                  <option>Gestion</option>
                  <option>Commerce</option>
                  <option>Tourisme</option>
                </select>
              </div>
              <div className="d-flex gap-2 ">
                <input
                  type="number"
                  placeholder="Droit (Ex : 300000 Ar)"
                  className="form-control"
                  value={droit}
                  onChange={(e) => setDroit(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Écolage (Ex : 100000 Ar)"
                  className="form-control"
                  value={ecolage}
                  onChange={(e) => setEcolage(e.target.value)}
                />
              </div>
              <div className="d-flex gap-2 ">
                <input
                  type="text"
                  placeholder="Ex : 2024-2025"
                  className="form-control"
                  value={anneeUniv}
                  onChange={(e) => setAnneeUniv(e.target.value)}
                />
                <button className="btn btn-success" onClick={handleAddEcolage}>
                  Enregistrer
                </button>
              </div>
            </div>

            <div className="niveau-table">
              <div className="d-flex align-items-center justify-content-between">
                <h5>Liste des Droits & Écolages</h5>

                <div className="d-flex gap-2 mb-2">
                  <select
                    className="form-control"
                    value={niveau}
                    onChange={(e) => setNiveau(e.target.value)}
                  >
                    <option value="">Tous les niveaux</option>
                    <option value="L1">L1</option>
                    <option value="L2">L2</option>
                    <option value="L3">L3</option>
                    <option value="M1">M1</option>
                    <option value="M2">M2</option>
                  </select>

                  <select
                    className="form-control"
                    value={specialite}
                    onChange={(e) => setSpecialite(e.target.value)}
                  >
                    <option value="">Filière</option>
                    <option>Gestion</option>
                    <option>Commerce</option>
                    <option>Tourisme</option>
                  </select>
                </div>
              </div>
              <div className="tableau-note">
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", border: "none" }}>
                        Niveau
                      </th>
                      <th style={{ textAlign: "left", border: "none" }}>
                        Spécialité
                      </th>
                      <th style={{ textAlign: "left", border: "none" }}>
                        Droit d'inscription
                      </th>
                      <th style={{ textAlign: "left", border: "none" }}>
                        Écolage
                      </th>
                      <th style={{ textAlign: "left", border: "none" }}>
                        Année Universitaire
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          width: "100px",
                          border: "none",
                        }}
                      >
                        Action
                      </th>{" "}
                      {/* Réduit la largeur de la colonne */}
                    </tr>
                  </thead>
                  <tbody>
                    {ecolagesFiltres.map((item, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: "left", border: "none" }}>
                          {item.niveau}
                        </td>
                        <td style={{ textAlign: "left", border: "none" }}>
                          {item.specialite}
                        </td>
                        <td style={{ textAlign: "left", border: "none" }}>
                          {item.droit} Ar
                        </td>
                        <td style={{ textAlign: "left", border: "none" }}>
                          {item.ecolage} Ar
                        </td>
                        <td style={{ textAlign: "left", border: "none" }}>
                          {item.anneeUniv}
                        </td>
                        <td
                          className="action-buttons"
                          style={{
                            textAlign: "center",
                            padding: "5px",
                            border: "none",
                          }}
                        >
                          <div style={{ display: "inline-flex", gap: "5px" }}>
                            <button
                              className="btn-icon btn-edit"
                              onClick={() => openModalEdit(item)}
                              style={{
                                fontSize: "14px",
                                padding: "5px",
                                border: "none",
                              }}
                            >
                              <FaPen size={14} />
                            </button>
                            <button
                              className="btn-icon btn-delete"
                              onClick={() => openConfirmDeleteModal(item)}
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

          <ClasseTable />
        </section>
      </main>

      {/* Modal de Modification */}
      <Modal show={showModalEdit} onHide={closeModalEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Êtes-vous sûr de vouloir modifier cet écolage & droit ?</p>

          <div className="mb-3">
            <label htmlFor="niveau" className="form-label">
              Niveau :
            </label>
            <select
              className="form-control"
              id="niveau"
              value={selectedEcolage?.niveau || ""}
              onChange={(e) =>
                setSelectedEcolage({
                  ...selectedEcolage,
                  niveau: e.target.value,
                })
              }
            >
              <option value="">Niveau</option>
              <option value="L1">L1</option>
              <option value="L2">L2</option>
              <option value="L3">L3</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="droit" className="form-label">
              Droit d'inscription :
            </label>
            <input
              type="number"
              className="form-control"
              id="droit"
              value={selectedEcolage?.droit || ""}
              onChange={(e) =>
                setSelectedEcolage({
                  ...selectedEcolage,
                  droit: e.target.value,
                })
              }
            />
          </div>

          <div className="mb-3">
            <label htmlFor="specialite" className="form-label">
              Spécialité :
            </label>
            <select
              className="form-control"
              id="specialite"
              value={selectedEcolage?.specialite || ""}
              onChange={(e) =>
                setSelectedEcolage({
                  ...selectedEcolage,
                  specialite: e.target.value,
                })
              }
            >
              <option value="">Spécialité</option>
              <option value="Infirmier">Infirmier</option>
              <option value="Sage femme">Sage femme</option>
              <option value="Technicien Laboratoire">
                Technicien Laboratoire
              </option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModalEdit}>
            Annuler
          </Button>
          <Button variant="success" onClick={handleUpdate}>
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmation */}
      <Modal show={showConfirmModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Êtes-vous sûr de vouloir supprimer cet écolage & droit ?</p>
          <p className="fw-bold">Niveau : {selectedEcolageForDelete?.niveau}</p>
          <p className="fw-bold">
            Droit : {selectedEcolageForDelete?.droit} Ar
          </p>
          <p className="fw-bold">
            Spécialité : {selectedEcolageForDelete?.specialite}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>

      <footer></footer>
    </>
  );
}

export default Classe;
