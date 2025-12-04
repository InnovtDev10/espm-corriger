import React, { useState, useEffect } from "react";
import { Table, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { FaFilePdf } from "react-icons/fa";

const DocumentTable = () => {
  const [documents, setDocuments] = useState([]);
  const [searchNom, setSearchNom] = useState("");
  const [searchDescription, setSearchDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Récupération des documents depuis l'API
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/document/all"
        );
        setDocuments(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des documents:", err);
        setError("Impossible de charger les documents.");
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Filtrer les documents en fonction des recherches
  const filteredDocuments = documents.filter(
    (doc) =>
      (doc.nom?.toLowerCase().includes(searchNom.toLowerCase()) ||
        searchNom === "") &&
      (doc.description
        ?.toLowerCase()
        .includes(searchDescription.toLowerCase()) ||
        searchDescription === "")
  );

  return (
    <div>
      <h2 className="mb-4">Liste des Documents</h2>

      {/* Message d'erreur */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Indicateur de chargement */}
      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
          <p>Chargement des documents...</p>
        </div>
      ) : (
        <>
          {/* Filtres */}
          <div className="d-flex mb-3">
            <Form.Control
              type="text"
              placeholder="Rechercher par nom"
              value={searchNom}
              onChange={(e) => setSearchNom(e.target.value)}
              className="me-2"
            />
            <Form.Control
              type="text"
              placeholder="Rechercher par description"
              value={searchDescription}
              onChange={(e) => setSearchDescription(e.target.value)}
            />
          </div>

          {/* Conteneur avec scroll si plus de 15 documents */}
          <div
            style={{
              maxHeight: filteredDocuments.length > 15 ? "400px" : "auto",
              overflowY: "auto",
            }}
          >
            <Table striped bordered hover className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nom du Document</th>
                  <th>Description</th>
                  <th>Fichier</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{doc.documentName || "N/A"}</td>
                      <td>{doc.description || "Aucune description"}</td>
                      <td>
                        {doc.filePath ? (
                          <FaFilePdf
                            className="pdf_icon"
                            onClick={() =>
                              window.open(
                                doc.filePath.startsWith("http")
                                  ? doc.filePath
                                  : `http://localhost:5000/${doc.filePath}`,
                                "_blank"
                              )
                            }
                            style={{ cursor: "pointer", color: "red" }}
                          />
                        ) : (
                          "Aucun fichier"
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Aucun document trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default DocumentTable;
