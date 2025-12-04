import React, { useState, useEffect } from "react";
import Navbar from "../Composants/Navbar";
import Sidebar from "../Composants/Sidebar";
import StageHistorique from "../Composants/Stagehistorique";
import { useNavigate } from "react-router-dom";
import "../Styles/Stage.css";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal, Button, Form, Table } from "react-bootstrap";

function Stage() {
  // États pour l'affectation
  const [matricule, setMatricule] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [niveau, setNiveau] = useState("");
  const [filiere, setFiliere] = useState("");
  const [etablissementAcceuil, setEtablissementAcceuil] = useState("");
  const [departement, setDepartement] = useState("");
  const [service, setService] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [anneeUniv, setAnneeUniv] = useState("");
  const [matriculeNote, setMatriculeNote] = useState("");
  const [nomNote, setNomNote] = useState("");
  const [prenomNote, setPrenomNote] = useState("");
  const [niveauNote, setNiveauNote] = useState("");
  const [filiereNote, setFiliereNote] = useState("");
  const [etablissementNote, setEtablissementNote] = useState("");
  const [departementNote, setDepartementNote] = useState("");
  const [serviceNote, setServiceNote] = useState("");
  const [anneeUnivNote, setAnneeUnivNote] = useState("");
  const [students, setStudents] = useState([]);
  const [stages, setStages] = useState([]);
  const navigate = useNavigate();
  const [searchMatricule, setSearchMatricule] = useState(""); // Pour la recherche
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filteredStages, setFilteredStages] = useState([]);

  // Historique des affectations
  const [showTableModal, setShowTableModal] = useState(false);
  const [historique, setHistorique] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nomEtablissement, setNomEtablissement] = useState("");
  const [naturesStages, setNaturesStages] = useState([]); // Liste des natures
  const [servicesStages, setServicesStages] = useState([]); // Liste des services

  const [newNature, setNewNature] = useState(""); // Nature en cours d'ajout
  const [newService, setNewService] = useState(""); // Service en cours d'ajout

  const [etablissements, setEtablissements] = useState([]);
  const handleTableModalClose = () => setShowTableModal(false);
  const handleTableModalShow = () => setShowTableModal(true);
  // Fermer le modal et réinitialiser les champs
  const handleModalClose = () => {
    setNomEtablissement("");
    setNewNature("");
    setNewService("");
    setNaturesStages([]);
    setServicesStages([]);
    setShowModal(false);
  };

  const handleModalShow = () => setShowModal(true);

  const handleNatureChange = (index, value) => {
    const updatedNaturesStages = [...naturesStages];
    updatedNaturesStages[index].nature = value;
    setNaturesStages(updatedNaturesStages);
  };

  const handleServiceChange = (index, value) => {
    const updatedNaturesStages = [...naturesStages];
    updatedNaturesStages[index].service = value;
    setServicesStages(updatedNaturesStages);
  };
  const handleAddNature = () => {
    if (newNature.trim() !== "") {
      setNaturesStages([...naturesStages, newNature]);
      setNewNature("");
    }
  };
  const handleAddService = () => {
    if (newService.trim() !== "") {
      setServicesStages([...servicesStages, newService]);
      setNewService("");
    }
  };

  const handleRemoveNature = (index) => {
    const updatedNatures = [...naturesStages];
    updatedNatures.splice(index, 1);
    setNaturesStages(updatedNatures);
  };

  const handleRemoveService = (index) => {
    setServicesStages(servicesStages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nom de l'établissement:", nomEtablissement);
    console.log("Natures des stages et services:", naturesStages);
    setShowModal(false);
  };

  const handleAffectation = async () => {
    if (
      matricule &&
      nom &&
      prenom &&
      niveau &&
      filiere &&
      etablissementAcceuil &&
      departement &&
      service &&
      anneeUniv &&
      dateDebut &&
      dateFin
    ) {
      // Vérifier si l'étudiant a déjà été affecté dans ce département de cet établissement
      const dejaAffecte = stages.some(
        (stage) =>
          stage.matricule === matricule &&
          stage.etablissementAcceuil === etablissementAcceuil &&
          stage.departement === departement &&
          stage.service === service
      );

      if (dejaAffecte) {
        Swal.fire({
          icon: "warning",
          title: "Affectation refusée",
          text: "Cet étudiant a déjà été affecté dans ce département de cet établissement.",
        });
        return;
      }

      const nouvelleAffectation = {
        matricule,
        nom,
        prenom,
        niveau,
        filiere,
        etablissementAcceuil,
        departement,
        service,
        anneeUniv,
        dateDebut,
        dateFin,
        observation: "",
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/api/stage/add",
          nouvelleAffectation
        );
        console.log("Stage ajouté:", response.data);

        setHistorique([...historique, response.data.stage]);

        // Reset form fields
        setMatricule("");
        setNom("");
        setPrenom("");
        setNiveau("");
        setFiliere("");
        setEtablissementAcceuil("");
        setDepartement("");
        setService("");
        setAnneeUniv("");
        setDateDebut("");
        setDateFin("");

        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Stage ajouté avec succès !",
        });

        // Reload the page
        window.location.reload();
      } catch (error) {
        console.error("Erreur lors de l'ajout du stage :", error);
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Une erreur est survenue lors de l'ajout du stage.",
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "Champs manquants",
        text: "Veuillez remplir tous les champs !",
      });
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/etudiant/tous"
        );
        setStudents(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des étudiants :", error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/stage/all");
        setStages(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des étudiants en stages:",
          error
        );
      }
    };

    fetchStages();
  }, []);

  useEffect(() => {
    if (matricule) {
      const student = students.find(
        (student) => student.matricule === matricule
      );
      if (student) {
        setNom(student.nom);
        setPrenom(student.prenom);
        setNiveau(student.niveau);
        setFiliere(student.filiere);
      }
    }
  }, [matricule, students]);

  useEffect(() => {
    if (matriculeNote) {
      const stage = stages.find((stage) => stage.matricule === matriculeNote);
      if (stage) {
        setNomNote(stage.nom);
        setPrenomNote(stage.prenom);
        setNiveauNote(stage.niveau);
        setFiliereNote(stage.filiere);
        setEtablissementNote(stage.etablissementAcceuil);
        setDepartementNote(stage.departement);
        setServiceNote(stage.service);
        setAnneeUnivNote(stage.anneeUniv);
      }
    }
  }, [matriculeNote, stages]);

  const handleAddSiteStage = async (e) => {
    e.preventDefault();

    // Ajouter immédiatement la nature et le service si l'utilisateur les a entrés
    if (newNature.trim() !== "") {
      setNaturesStages([...naturesStages, newNature]);
      setNewNature(""); // Réinitialiser l'input
    }

    if (newService.trim() !== "") {
      setServicesStages([...servicesStages, newService]);
      setNewService("");
    }

    // Vérifier si les champs sont bien remplis
    {
      /*if (!nomEtablissement || naturesStages.length === 0 || servicesStages.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Champs manquants",
        text: `Veuillez remplir tous les champs avant de soumettre.\n\n
        📌 Nom de l'Établissement: ${nomEtablissement || "Non renseigné"}\n
        📌 Natures de Stage: ${naturesStages.length > 0 ? naturesStages.join(", ") : "Aucune"}\n
        📌 Services de Stage: ${servicesStages.length > 0 ? servicesStages.join(", ") : "Aucun"}\n`,
      });
      return;
    }*/
    }

    // Préparer les données à envoyer
    const siteStageData = {
      nomEtablissement,
      natureStage: naturesStages,
      serviceStage: servicesStages,
    };

    try {
      // Envoyer la requête POST
      const response = await axios.post(
        "http://localhost:5000/api/site-stage/add",
        siteStageData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Vérifier la réponse
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Site de Stage ajouté avec succès!",
          text: "Le site de stage a été ajouté à la base de données.",
        });
        window.location.reload();
        // Réinitialiser le formulaire et fermer le modal
        handleModalClose();
      }
    } catch (error) {
      console.error("Erreur :", error);
      Swal.fire({
        icon: "error",
        title: "Une erreur est survenue",
        text: "Impossible d'ajouter le site de stage, veuillez réessayer.",
      });
    }
  };

  // Utilisation de useEffect pour récupérer les données au montage
  useEffect(() => {
    const fetchEtablissements = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/site-stage/all"
        );
        {
          /*console.log("Données récupérées :", response.data);*/
        }
        setEtablissements(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des établissements",
          error
        );
      }
    };

    fetchEtablissements(); // Récupérer les données chaque fois que le modal est ouvert
  }, []);

  // Filtrer les natures de stage en fonction de l'établissement choisi
  const selectedEtablissement = etablissements.find(
    (etablissement) => etablissement.nomEtablissement === etablissementAcceuil
  );

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
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="fw-bold">Gestion de STAGE</h4>
            <Button variant="primary" onClick={handleModalShow}>
              Site de stage
            </Button>
          </div>
          <div className="hr mt-2"></div>

          {/* Conteneur des formulaires */}
          <div className="form-section mt-2">
            {/* Formulaire d'affectation */}
            <div className="affectation-form">
              <h5>Affectation d'un étudiant </h5>
              <div className="affectation-content">
                <div className="affectation-left">
                  <div className="position-relative w-100">
                    <input
                      type="text"
                      className="form-control mb-0"
                      placeholder="Matricule..."
                      value={searchMatricule}
                      onChange={(e) => {
                        setSearchMatricule(e.target.value);
                        setFilteredStudents(
                          students.filter((student) =>
                            student.matricule
                              .toLowerCase()
                              .includes(e.target.value.toLowerCase())
                          )
                        );
                      }}
                      onFocus={() => setFilteredStudents(students)}
                    />
                    {filteredStudents.length > 0 && (
                      <ul
                        className="list-group position-absolute w-100"
                        style={{
                          zIndex: 1000,
                          maxHeight: "120px",
                          overflowY: "auto",
                        }}
                      >
                        {filteredStudents.slice(0, 5).map((student) => (
                          <li
                            key={student.matricule}
                            className="list-group-item list-group-item-action"
                            onClick={() => {
                              setMatricule(student.matricule);
                              setSearchMatricule(student.matricule);
                              setNom(student.nom);
                              setPrenom(student.prenom);
                              setNiveau(student.niveau);
                              setFiliere(student.filiere);
                              setFilteredStudents([]); // Fermer la liste après sélection
                            }}
                          >
                            {student.matricule} - {student.nom} {student.prenom}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Nom"
                    className="form-control mb-0"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Prénom"
                    className="form-control mb-0"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Niveau"
                    className="form-control mb-0"
                    value={niveau}
                    onChange={(e) => setNiveau(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Année Academique"
                    className="form-control mb-0"
                    value={anneeUniv}
                    onChange={(e) => setAnneeUniv(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Filière"
                    className="form-control mb-0"
                    value={filiere}
                    onChange={(e) => setFiliere(e.target.value)}
                  />
                </div>
                <div className="affectation-right">
                  <div className="form-group">
                    <select
                      id="etablissementAcceuil"
                      className="form-control mt-0 mb-0"
                      value={etablissementAcceuil}
                      onChange={(e) => setEtablissementAcceuil(e.target.value)}
                    >
                      <option value="">Sélectionner un établissement</option>
                      {etablissements.map((etablissement, index) => (
                        <option
                          key={index}
                          value={etablissement.nomEtablissement}
                        >
                          {etablissement.nomEtablissement}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group ">
                    <select
                      id="departement"
                      className="form-control mb-2"
                      value={departement}
                      onChange={(e) => setDepartement(e.target.value)}
                      disabled={!etablissementAcceuil}
                    >
                      <option value="">Sélectionner une nature de stage</option>
                      {selectedEtablissement?.natureStage?.map(
                        (nature, index) => (
                          <option key={index} value={nature}>
                            {nature}
                          </option>
                        )
                      )}
                    </select>

                    <select
                      id="etablissementAcceuil"
                      className="form-control mb-0"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                    >
                      <option value="">Sélectionner un service</option>
                      {selectedEtablissement?.serviceStage?.map(
                        (service, index) => (
                          <option key={index} value={service}>
                            {service}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                  <input
                    type="date"
                    className="form-control mb-0"
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                  />
                  <input
                    type="date"
                    className="form-control mb-0"
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                  />
                </div>
              </div>
              <div className="button-container">
                <button className="btn btn-success" onClick={handleAffectation}>
                  Affecter Étudiant
                </button>
              </div>
            </div>

            {/* Formulaire d'ajout de note */}
            <div className="note-form">
              <h5>Note pratique</h5>
              <div className="note-content">
                <div className="note-left">
                  <div className="position-relative w-100">
                    <input
                      type="text"
                      className="form-control mb-0"
                      placeholder="Rechercher un matricule..."
                      value={matriculeNote}
                      onChange={(e) => {
                        setMatriculeNote(e.target.value);
                        setFilteredStages(
                          stages.filter((stage) =>
                            stage.matricule
                              .toLowerCase()
                              .includes(e.target.value.toLowerCase())
                          )
                        );
                      }}
                      onFocus={() => setFilteredStages(stages)}
                    />
                    {filteredStages.length > 0 && (
                      <ul
                        className="list-group position-absolute w-100"
                        style={{
                          zIndex: 1000,
                          maxHeight: "150px",
                          overflowY: "auto",
                        }}
                      >
                        {filteredStages.slice(0, 5).map((stage) => (
                          <li
                            key={stage.matricule}
                            className="list-group-item list-group-item-action"
                            onClick={() => {
                              setMatriculeNote(stage.matricule);
                              setFilteredStages([]); // Masquer la liste après la sélection
                            }}
                          >
                            {stage.matricule}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Nom"
                    className="form-control mb-0"
                    value={nomNote}
                    onChange={(e) => setNomNote(e.target.value)}
                    readOnly
                  />
                  <input
                    type="text"
                    placeholder="Prénom"
                    className="form-control mb-0"
                    value={prenomNote}
                    onChange={(e) => setPrenomNote(e.target.value)}
                    readOnly
                  />
                  <input
                    type="text"
                    placeholder="Année Academique"
                    className="form-control mb-0"
                    value={anneeUnivNote}
                    onChange={(e) => setAnneeUnivNote(e.target.value)}
                    readOnly
                  />
                </div>
                <div className="note-right">
                  <input
                    type="text"
                    placeholder="Niveau"
                    className="form-control mb-0"
                    value={niveauNote}
                    onChange={(e) => setNiveauNote(e.target.value)}
                    readOnly
                  />
                  <input
                    type="text"
                    placeholder="Filière"
                    className="form-control mb-0"
                    value={filiereNote}
                    onChange={(e) => setFiliereNote(e.target.value)}
                    readOnly
                  />
                  <input
                    type="text"
                    placeholder="Établissement d'Accueil"
                    className="form-control mb-0"
                    value={etablissementNote}
                    onChange={(e) => setEtablissementNote(e.target.value)}
                    readOnly
                  />
                  <input
                    type="text"
                    placeholder="Nature"
                    value={departementNote}
                    onChange={(e) => setDepartementNote(e.target.value)}
                    className="form-control mb-0"
                    readOnly
                  />
                  <input
                    type="text"
                    placeholder="Service"
                    value={serviceNote}
                    onChange={(e) => setServiceNote(e.target.value)}
                    className="form-control mb-5"
                    readOnly
                  />
                </div>
              </div>
              <div className="button-container mt-2 ">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (filiereNote === "Tourisme") {
                      navigate("/notestagelabo", {
                        state: {
                          matriculeNote,
                          nomNote,
                          prenomNote,
                          niveauNote,
                          filiereNote,
                          etablissementNote,
                          departementNote,
                          serviceNote,
                          anneeUnivNote,
                        },
                      });
                    } else if (
                      filiereNote === "Commerce" ||
                      filiereNote === "Gestion"
                    ) {
                      navigate("/notestage", {
                        state: {
                          matriculeNote,
                          nomNote,
                          prenomNote,
                          niveauNote,
                          filiereNote,
                          etablissementNote,
                          departementNote,
                          serviceNote,
                          anneeUnivNote,
                        },
                      });
                    } else {
                      // Ajoutez une alerte ou un message d'erreur si la filière n'est pas définie
                      Swal.fire({
                        icon: "warning",
                        title: "Filière non prise en charge",
                        text: "Veuillez sélectionner une filière valide.",
                      });
                    }
                  }}
                >
                  Ajouter les Notes
                </button>
              </div>
            </div>
          </div>

          <Modal show={showModal} onHide={handleModalClose} backdrop="static">
            <Modal.Header closeButton>
              <Modal.Title>Ajouter un Site de Stage</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-scroll">
              <Form>
                {/* Nom de l'établissement */}
                <Form.Group className="mb-3" controlId="formNomEtablissement">
                  <Form.Label>Nom de l'Établissement</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Entrez le nom de l'établissement"
                    value={nomEtablissement}
                    onChange={(e) => setNomEtablissement(e.target.value)}
                    required
                    autoFocus
                  />
                </Form.Group>

                <hr />

                {/* Ajouter une Nature de Stage */}
                <Form.Group className="mb-3">
                  <Form.Label>Ajouter une Nature de Stage</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      placeholder="Entrez la nature de stage"
                      value={newNature}
                      onChange={(e) => setNewNature(e.target.value)}
                    />
                    <Button
                      variant="success"
                      onClick={handleAddNature}
                      className="ms-2"
                    >
                      Ajouter
                    </Button>
                  </div>
                </Form.Group>

                {/* Liste des Natures ajoutées */}
                {naturesStages.map((nature, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between mb-2 border p-2"
                  >
                    <span>{nature}</span>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveNature(index)}
                    >
                      x
                    </Button>
                  </div>
                ))}

                <hr />

                {/* Ajouter un Service */}
                <Form.Group className="mb-3">
                  <Form.Label>Ajouter un Service</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      placeholder="Entrez un service"
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                    />
                    <Button
                      variant="success"
                      onClick={handleAddService}
                      className="ms-2"
                    >
                      Ajouter
                    </Button>
                  </div>
                </Form.Group>

                {/* Liste des Services ajoutés */}
                {servicesStages.map((service, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between mb-2 border p-2"
                  >
                    <span>{service}</span>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveService(index)}
                    >
                      x
                    </Button>
                  </div>
                ))}

                <hr />

                {/* Boutons de soumission */}
                <div className="mt-3 d-flex justify-content-end">
                  <Button
                    variant="info"
                    onClick={handleTableModalShow}
                    className="mt-5 me-5"
                  >
                    Voir les établissements et leurs natures
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleModalClose}
                    className="me-2 mt-5"
                  >
                    Fermer
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleAddSiteStage}
                    type="submit"
                    className="mt-5"
                  >
                    Enregistrer
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>

          <Modal show={showTableModal} onHide={handleTableModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Liste des Établissements et Natures</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: "600px", overflowY: "auto" }}>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Nom de l'Établissement</th>
                    <th>Natures de Stage</th>
                    <th>Service</th>
                  </tr>
                </thead>
                <tbody>
                  {etablissements.map((etablissement, index) => (
                    <tr key={index}>
                      <td>{etablissement.nomEtablissement}</td>
                      <td>{etablissement.natureStage.join(", ")}</td>
                      <td>{etablissement.serviceStage.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleTableModalClose}>
                Fermer
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Tableau d'historique */}

          <StageHistorique historique={historique} />
        </section>
      </main>
    </>
  );
}

export default Stage;
