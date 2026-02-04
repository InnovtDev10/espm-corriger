import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "../Styles/ModalEtu.css";

const StudentEditModal = ({ student, show, onHide }) => {
  const [etudiant, setEtudiant] = useState(student || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setEtudiant(student);
    }
  }, [student]);

  const handleChange = (e) => {
    setEtudiant({ ...etudiant, [e.target.name]: e.target.value });
  };
  const url = import.meta.env.VITE_API_URL;

  const validateForm = () => {
    const requiredFields = [
      "matricule",
      "nom",
      "prenom",
      "date_naissance",
      "lieu_naissance",
      "email",
      "telephone",
      "adresse",
      "nationalite",
      "filiere",
      "niveau",
      "date_inscription",
    ];
    return requiredFields.every((field) => etudiant[field] !== "");
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `${url}/api/etudiant/update/${etudiant.id}`,
        etudiant
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Les informations de l'étudiant ont été modifiées avec succès !",
        });
        onHide();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur s'est produite lors de la modification de l'étudiant.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton className="bg-success text-white">
        <Modal.Title>Modifier les informations de l'étudiant</Modal.Title>
      </Modal.Header>
    
            <Modal.Body>
              <Form>
                <Row className="g-3">
                  {/* 🟢 COLONNE 1 - Infos personnelles */}
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="matricule"
                        placeholder="Numéro Matricule de l'étudiant"
                        value={etudiant.matricule}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="nom"
                        placeholder="Nom de l'étudiant"
                        value={etudiant.nom}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="prenom"
                        placeholder="Prénom de l'étudiant"
                        value={etudiant.prenom}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3 position-relative">
                      <Form.Label>Date de naissance</Form.Label>
                      <Form.Control
                        type="date"
                        name="date_naissance"
                        value={etudiant.date_naissance}
                        onChange={handleChange}
                      
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="lieu_naissance"
                        placeholder="Lieu de naissance"
                        value={etudiant.lieu_naissance}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Adresse Email"
                        value={etudiant.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
    
                  {/* 🔵 COLONNE 2 - Contact & Adresse */}
                  <Col md={4}>
              
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="tel"
                        name="telephone"
                        placeholder="Numéro de téléphone"
                        value={etudiant.telephone}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Select name="sexe" value={etudiant.sexe} onChange={handleChange}>
                        <option value="">Sexe</option>
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="nationalite"
                        placeholder="Nationalité"
                        value={etudiant.nationalite}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="numeroCIN"
                        placeholder="Numero CIN"
                        value={etudiant.numeroCIN}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                    <Form.Label>Délivrée le:</Form.Label>
                      <Form.Control
                        type="date"
                        name="dateDelivranceCIN"
                        placeholder="Date de délivrance"
                        value={etudiant.dateDelivranceCIN}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="adresse"
                        placeholder="Adresse actuelle de l'étudiant"
                        value={etudiant.adresse}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
    
                  {/* 🟠 COLONNE 3 - Éducation & Statut */}
                  <Col md={4}>
          
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="nomPrenomPere"
                        placeholder="Nom & Prénoms du père"
                        value={etudiant.nomPrenomPere}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="telPere"
                        placeholder="Numéro télephone du père"
                        value={etudiant.telPere}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="nomPrenomMere"
                        placeholder="Nom & Prénoms de la mère"
                        value={etudiant.nomPrenomMere}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        name="telMere"
                        placeholder="Numéro télephone de la mère"
                        value={etudiant.telMere}
                        onChange={handleChange}              
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Select name="filiere" value={etudiant.filiere} onChange={handleChange} required>
                        <option value="">Sélectionner une filière</option>
                        <option value="Technicien de laboratoire">Technicien de laboratoire</option>
                        <option value="Sciences infirmières">Sciences infirmières</option>
                        <option value="Maieutique">Maieutique</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Select name="niveau" value={etudiant.niveau} onChange={handleChange} required>
                        <option value="">Sélectionner un niveau</option>
                        <option value="L1">L1</option>
                        <option value="L2">L2</option>
                        <option value="L3">L3</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Date d'inscription</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        name="date_inscription"
                        value={etudiant.date_inscription}
                        onChange={handleChange}
                    
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
          Fermer
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StudentEditModal;
