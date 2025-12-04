import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "../Styles/ModalEtu.css";

const StudentModal = () => {
  const [etudiant, setEtudiant] = useState({
    matricule: "",
    nom: "",
    prenom: "",
    date_naissance: "",
    lieu_naissance: "",
    sexe: "",
    email: "",
    telephone: "",
    adresse: "",
    nationalite: "",
    filiere: "",
    niveau: "",
    date_inscription: "",
    statut: "Actif",
    nomPrenomPere: "",
    telPere: "",
    nomPrenomMere: "",
    telMere: "",
    numeroCIN: "",
    dateDelivranceCIN: "",
    photo:null
  });

  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setEtudiant({ ...etudiant, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setEtudiant({ ...etudiant, photo: e.target.files[0] });
  };

  const validateForm = () => {
    const requiredFields = [
      "matricule", "nom", "prenom", "date_naissance", "lieu_naissance",
      "email", "telephone", "adresse", "nationalite", "filiere", "niveau",
      "date_inscription", "nomPrenomPere", "telPere", "nomPrenomMere",
      "telMere", "numeroCIN", "dateDelivranceCIN"
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
      const formData = new FormData();
      for (const key in etudiant) {
        formData.append(key, etudiant[key]);
      }

      const response = await axios.post(
        "http://localhost:5000/api/etudiant/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Étudiant ajouté avec succès !",
        }).then(() => window.location.reload());
        setShow(false);
        setEtudiant({});
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur s'est produite lors de l'ajout de l'étudiant.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-end">
        <Button className="btn-success" onClick={() => setShow(true)}>
          Nouveau étudiant
        </Button>
      </div>

      <Modal show={show} onHide={() => setShow(false)} size="xl">
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Ajouter un nouveau étudiant</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Row className="g-3">
              {/* Colonne 1 */}
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Control type="text" name="matricule" placeholder="Matricule" value={etudiant.matricule} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="text" name="nom" placeholder="Nom" value={etudiant.nom} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="text" name="prenom" placeholder="Prénom" value={etudiant.prenom} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Date de naissance</Form.Label>
                  <Form.Control type="date" name="date_naissance" value={etudiant.date_naissance} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="text" name="lieu_naissance" placeholder="Lieu de naissance" value={etudiant.lieu_naissance} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="email" name="email" placeholder="Email" value={etudiant.email} onChange={handleChange} required />
                </Form.Group>
              </Col>

              {/* Colonne 2 */}
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Control type="tel" name="telephone" placeholder="Téléphone" value={etudiant.telephone} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Select name="sexe" value={etudiant.sexe} onChange={handleChange}>
                    <option value="">Sexe</option>
                    <option value="Masculin">Masculin</option>
                    <option value="Féminin">Féminin</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="text" name="nationalite" placeholder="Nationalité" value={etudiant.nationalite} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="text" name="numeroCIN" placeholder="Numéro CIN" value={etudiant.numeroCIN} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date de délivrance CIN</Form.Label>
                  <Form.Control type="date" name="dateDelivranceCIN" value={etudiant.dateDelivranceCIN} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="text" name="adresse" placeholder="Adresse" value={etudiant.adresse} onChange={handleChange} required />
                </Form.Group>
              </Col>

              {/* Colonne 3 */}
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Control type="text" name="nomPrenomPere" placeholder="Nom & Prénoms du père" value={etudiant.nomPrenomPere} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="text" name="telPere" placeholder="Téléphone du père" value={etudiant.telPere} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="text" name="nomPrenomMere" placeholder="Nom & Prénoms de la mère" value={etudiant.nomPrenomMere} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control type="text" name="telMere" placeholder="Téléphone de la mère" value={etudiant.telMere} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Select name="filiere" value={etudiant.filiere} onChange={handleChange} required>
                    <option value="">Filière</option>
                    <option value="Gestion">Gestion</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Tourisme">Tourisme</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Select name="niveau" value={etudiant.niveau} onChange={handleChange} required>
                    <option value="">Niveau</option>
                    <option value="L1">L1</option>
                    <option value="L2">L2</option>
                    <option value="L3">L3</option>
                    <option value="M1">M1</option>
                    <option value="M2">M2</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date d'inscription</Form.Label>
                  <Form.Control type="datetime-local" name="date_inscription" value={etudiant.date_inscription} onChange={handleChange} required />
                </Form.Group>

                {/* Photo Upload */}
                {/*<Form.Group className="mb-3">
                  <Form.Label>Photo</Form.Label>
                  <Form.Control type="file" name="photo" accept="image/*" onChange={handleFileChange} />
                  {etudiant.photo && typeof etudiant.photo === "object" && (
                    <img
                      src={URL.createObjectURL(etudiant.photo)}
                      alt="aperçu"
                      width="100"
                      className="mt-2 rounded border"
                    />
                  )}
                </Form.Group> */}
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={() => setShow(false)}>Fermer</Button>
          <Button variant="success" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StudentModal;
