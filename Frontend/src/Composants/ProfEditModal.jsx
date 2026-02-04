import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";

const ProfEdit = ({ professeur, showModal, handleClose }) => {
  const url = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    if (professeur) {
      setFormData((prev) => ({
        ...prev,
        ...professeur,
      }));
    }
  }, [professeur]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `${url}/api/prof/update/${formData.id}`,
        formData
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Professeur modifié avec succès !",
        });
        handleClose();
      }
    } catch (error) {
      console.error("Erreur :", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Impossible de modifier le professeur.",
      });
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} size="lg">
      {/* En-tête en vert */}
      <Modal.Header closeButton className="bg-success text-white">
        <Modal.Title>Modifier Professeur</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            {/* Première colonne */}
            <Col md={4}>
              <Form.Group>
                <Form.Label>Matricule</Form.Label>
                <Form.Control
                  type="text"
                  name="matricule"
                  value={formData.matricule}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Prénom</Form.Label>
                <Form.Control
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Lieu de naissance</Form.Label>
                <Form.Control
                  type="text"
                  name="lieu_naissance"
                  value={formData.lieu_naissance}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            {/* Deuxième colonne */}
            <Col md={4}>
              <Form.Group>
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Date de naissance</Form.Label>
                <Form.Control
                  type="date"
                  name="date_naissance"
                  value={formData.date_naissance || ""}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Sexe</Form.Label>
                <Form.Control
                  as="select"
                  name="sexe"
                  value={formData.sexe}
                  onChange={handleChange}
                >
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Téléphone</Form.Label>
                <Form.Control
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </Form.Group>
              <div className="d-flex justify-content-end mt-5">
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  className="me-5"
                >
                  Fermer
                </Button>
                <Button variant="primary" type="submit">
                  Enregistrer
                </Button>
              </div>
            </Col>

            {/* Troisième colonne */}
            <Col md={4}>
              <Form.Group>
                <Form.Label>Adresse</Form.Label>
                <Form.Control
                  type="text"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Département</Form.Label>
                <Form.Control
                  type="text"
                  name="departement"
                  value={formData.departement}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Spécialité</Form.Label>
                <Form.Control
                  type="text"
                  name="specialite"
                  value={formData.specialite}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Date d'embauche</Form.Label>
                <Form.Control
                  type="date"
                  name="date_embauche"
                  value={formData.date_embauche || ""}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Statut</Form.Label>
                <Form.Control
                  as="select"
                  name="statut"
                  value={formData.statut}
                  onChange={handleChange}
                >
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          {/* Footer à l'intérieur du Modal.Body */}
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ProfEdit;
