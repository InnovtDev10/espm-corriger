import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap";

const UploadDocumentModal = ({ show, handleClose }) => {
  const [documentName, setDocumentName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };
  const url = import.meta.env.VITE_API_URL;

  const handleSubmit = async () => {
    if (!documentName || !file) {
      Swal.fire({
        icon: "warning",
        title: "Champs obligatoires",
        text: "Veuillez remplir tous les champs obligatoires !",
      });
      return;
    }

    // Création d'un objet FormData pour envoyer les données
    const formData = new FormData();
    formData.append("documentName", documentName);
    formData.append("description", description);
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${url}/api/document/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Afficher une alerte de succès
      Swal.fire({
        icon: "success",
        title: "Document ajouté",
        text: "Le document a été ajouté avec succès !",
      });

      // Réinitialisation des champs
      setDocumentName("");
      setDescription("");
      setFile(null);
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de l'envoi du document :", error);

      // Afficher une alerte d'erreur
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de l'ajout du document.",
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un Document</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nom du document *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Entrez le nom du document"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ajoutez une description (optionnel)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fichier (PDF, Word, etc.) *</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} required />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fermer
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Enregistrer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UploadDocumentModal;
