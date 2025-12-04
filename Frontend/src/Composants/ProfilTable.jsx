import React, { useState, useEffect } from "react";
import "../Styles/Profil.css"; // Importer le fichier CSS
import Swal from "sweetalert2";
import { Modal, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importer les icônes

function ProfilTable({
  searchName,
  searchEmail,
  selectedRole,
  selectedStatut,
  refresh,
}) {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) =>
        console.error("Erreur lors du chargement des utilisateurs :", error)
      );
  }, [refresh]);

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(
    (user) =>
      user.nom.toLowerCase().includes(searchName.toLowerCase()) &&
      user.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
      (selectedRole === "" || user.role === selectedRole) &&
      (selectedStatut === "" || user.statut === selectedStatut)
  );

  // Fonction de modification
  const handleEdit = (userId) => {
    const userToEdit = users.find((user) => user.id === userId);
    setEditingUser(userToEdit);
  };

  // Fonction pour mettre à jour un utilisateur
  const handleUpdate = async (updatedUser) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${updatedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          )
        );
        Swal.fire("Succès", data.message, "success");
        setEditingUser(null);
      } else {
        Swal.fire("Erreur", data.message, "error");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      Swal.fire(
        "Erreur",
        "Une erreur est survenue lors de la mise à jour",
        "error"
      );
    }
  };

  // Fonction de suppression
  const handleDelete = async (userId) => {
    const confirmDelete = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/${userId}`,
          {
            method: "DELETE",
          }
        );
        const data = await response.json();
        if (response.ok) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== userId)
          );
          Swal.fire("Succès", data.message, "success");
        } else {
          Swal.fire("Erreur", data.message, "error");
        }
      } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        Swal.fire(
          "Erreur",
          "Une erreur est survenue lors de la suppression",
          "error"
        );
      }
    }
  };

  return (
    <div className="table-container mt-4">
      {/* Modal de modification */}
      <Modal
        show={editingUser !== null}
        onHide={() => setEditingUser(null)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Modifier l'utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate(editingUser);
            }}
          >
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                value={editingUser?.nom || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, nom: e.target.value })
                }
                placeholder="Nom"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                value={editingUser?.email || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, email: e.target.value })
                }
                placeholder="Email"
                required
              />
            </div>
            <div className="form-group">
              <select
                className="form-control"
                value={editingUser?.role || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, role: e.target.value })
                }
                required
              >
                <option value="Admin">Admin</option>
                <option value="Monitrice de stage">Monitrice de stage</option>
                <option value="Monitrice">Monitrice</option>
                <option value="RAF">RAF</option>
                <option value="Caissier">Caissier</option>
                <option value="Responsable de suivi">
                  Responsable de suivi
                </option>
              </select>
            </div>
            <div className="form-group">
              <select
                className="form-control"
                value={editingUser?.statut || ""}
                onChange={(e) =>
                  setEditingUser({ ...editingUser, statut: e.target.value })
                }
                required
              >
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
              </select>
            </div>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setEditingUser(null)}>
                Annuler
              </Button>
              <Button type="submit" variant="primary">
                Enregistrer
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>

      {/* Tableau des utilisateurs */}
      <table className="custom-table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Nom Complet</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>
                {user.photo ? (
                  <img
                    src={`http://localhost:5000/uploads/${user.photo}`}
                    alt="Profil"
                    className="user-photo"
                  />
                ) : (
                  <span>Pas de photo</span>
                )}
              </td>
              <td>{user.nom}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <span
                  className={`status ${
                    user.statut === "Actif" ? "active" : "inactive"
                  }`}
                >
                  {user.statut}
                </span>
              </td>
              <td className="action-buttons">
                <button
                  className="btn-icon btn-edit"
                  onClick={() => handleEdit(user.id)}
                >
                  <FaEdit size={18} />
                </button>
                <button
                  className="btn-icon btn-delete"
                  onClick={() => handleDelete(user.id)}
                >
                  <FaTrash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProfilTable;
