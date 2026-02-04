import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Button, Form, Row, Col } from "react-bootstrap"; // Import de React Bootstrap
import "../Styles/ProfesseurModal.css"; // Import du CSS amélioré

const ProfesseurModal = () => {
  const [professeur, setProfesseur] = useState({
    matricule: "",
    nom: "",
    prenom: "",
    date_naissance: "",
    lieu_naissance: "",
    sexe: "Homme",
    email: "",
    telephone: "",
    adresse: "",
    departement: "",
    specialite: "",
    date_embauche: "",
    statut: "Actif",
  });

  const url = import.meta.env.VITE_API_URL;
  const [photo, setPhoto] = useState(null);
  const [cv, setCv] = useState(null);
  const [lm, setLm] = useState(null);
  const [diplome, setDiplome] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setProfesseur({ ...professeur, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      if (name === "photo_profil") {
        setPhoto(files[0]);
      } else if (name === "cv") {
        setCv(files[0]);
      } else if (name === "lm") {
        setLm(files[0]);
      } else if (name === "diplome") {
        setDiplome(files[0]);
      }
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(professeur).forEach((key) => {
        formData.append(key, professeur[key]);
      });

      if (photo) {
        formData.append("photo_profil", photo);
      }
      if (cv) {
        formData.append("cv", cv);
      }
      if (lm) {
        formData.append("lm", lm);
      }
      if (diplome) {
        formData.append("diplome", diplome);
      }

      const response = await axios.post(
        `${url}/api/prof/add`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Professeur ajouté avec succès !",
        });

        // Fermeture de la modale
        setShowModal(false);

        // Recharger la page après un court délai
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Erreur d'upload :", error);
      let errorMessage = "Une erreur est survenue lors de l'ajout.";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      Swal.fire({ icon: "error", title: "Erreur", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-end">
        <Button variant="success" onClick={() => setShowModal(true)}>
          Ajouter un professeur
        </Button>
      </div>

      {/* Modal de React Bootstrap */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Professeur</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Row className="g-3">
              {/* COLONNE 1 */}
              <Col md={4}>
                <Form.Group controlId="matricule" className="mb-3">
                  <Form.Control
                    type="text"
                    name="matricule"
                    value={professeur.matricule}
                    onChange={handleChange}
                    placeholder="Matricule"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="nom" className="mb-3">
                  <Form.Control
                    type="text"
                    name="nom"
                    value={professeur.nom}
                    onChange={handleChange}
                    placeholder="Nom"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="prenom" className="mb-3">
                  <Form.Control
                    type="text"
                    name="prenom"
                    value={professeur.prenom}
                    onChange={handleChange}
                    placeholder="Prénom"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Control
                    type="email"
                    name="email"
                    value={professeur.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="sexe" className="mb-3">
                  <Form.Control
                    as="select"
                    name="sexe"
                    value={professeur.sexe}
                    onChange={handleChange}
                    required
                  >
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="date_naissance" className="mb-3">
                  <Form.Label>Date de naissance</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_naissance"
                    value={professeur.date_naissance}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              {/* COLONNE 2 */}
              <Col md={4}>
                <Form.Group controlId="lieu_naissance" className="mb-3">
                  <Form.Control
                    type="text"
                    name="lieu_naissance"
                    value={professeur.lieu_naissance}
                    onChange={handleChange}
                    placeholder="Lieu de naissance"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="telephone" className="mb-3">
                  <Form.Control
                    type="tel"
                    name="telephone"
                    value={professeur.telephone}
                    onChange={handleChange}
                    placeholder="Téléphone"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="adresse" className="mb-3">
                  <Form.Control
                    type="text"
                    name="adresse"
                    value={professeur.adresse}
                    onChange={handleChange}
                    placeholder="Adresse"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="departement" className="mb-3">
                  <Form.Control
                    type="text"
                    name="departement"
                    value={professeur.departement}
                    onChange={handleChange}
                    placeholder="Département"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="specialite" className="mb-3">
                  <Form.Control
                    type="text"
                    name="specialite"
                    value={professeur.specialite}
                    onChange={handleChange}
                    placeholder="Spécialité"
                    required
                  />
                </Form.Group>
              </Col>

              {/* COLONNE 3 */}
              <Col md={4}>
                <Form.Group controlId="date_embauche" className="mb-3">
                  <Form.Label>Date d'embauche</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_embauche"
                    value={professeur.date_embauche}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="statut" className="mb-3">
                  <Form.Control
                    as="select"
                    name="statut"
                    value={professeur.statut}
                    onChange={handleChange}
                    required
                  >
                    <option value="Actif">Actif</option>
                    <option value="Inactif">Inactif</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="cv" className="mb-3">
                  <Form.Label>CV (PDF)*</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf"
                    name="cv"
                    onChange={handleFileChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="lm" className="mb-3">
                  <Form.Label>Lettre de Motivation (PDF)*</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf"
                    name="lm"
                    onChange={handleFileChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="diplome" className="mb-3">
                  <Form.Label>Diplôme (PDF)*</Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf"
                    name="diplome"
                    onChange={handleFileChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="photo_profil" className="mb-3">
                  <Form.Label>Photo de profil</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    name="photo_profil"
                    onChange={handleFileChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
          <Button variant="success" onClick={handleSubmit} disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfesseurModal;
