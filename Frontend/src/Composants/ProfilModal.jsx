import React, { useState } from "react";
import Swal from "sweetalert2";
import { FaPlusCircle } from "react-icons/fa";

function ProfilModal({ onUserAdded }) {
  const url = import.meta.env.VITE_API_URL;
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    password: "",
    role: "",
    statut: "Actif",
    photo: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setFormData({ ...formData, photo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("nom", formData.nom);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("role", formData.role);
    formDataToSend.append("statut", formData.statut);
    if (formData.photo) {
      formDataToSend.append("photo", formData.photo);
    }

    try {
      const response = await fetch(`${url}/api/users/signup`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Succès !",
          text: "Utilisateur ajouté avec succès.",
          showConfirmButton: false,
          timer: 2000,
        });

        localStorage.setItem(
          "user",
          JSON.stringify({
            nom: formData.nom,
            email: formData.email,
            role: formData.role,
            statut: formData.statut,
            photo: data.photo,
          })
        );

        setFormData({
          nom: "",
          email: "",
          password: "",
          role: "",
          statut: "Actif",
          photo: null,
        });

        setTimeout(() => {
          document.getElementById("btn-close-modal").click();
          onUserAdded();
        }, 1000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: data.message || "Une erreur s'est produite !",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur serveur",
        text: "Impossible d'ajouter l'utilisateur.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className="payment-btn"
        data-bs-toggle="modal"
        data-bs-target="#profilModal"
      >
        + Ajouter un utilisateur
      </button>

      <div className="modal fade" id="profilModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Ajouter un utilisateur</h5>
              <button
                type="button"
                className="btn-close"
                id="btn-close-modal"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="form-floating mt-3 w-75 mx-auto">
                  <div
                    style={{
                      position: "relative",
                      width: "3cm",
                      height: "3cm",
                      borderRadius: "8px",
                      backgroundColor: "#ccc",
                      margin: "0 auto",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                    }}
                  >
                    {formData.photo ? (
                      <img
                        src={URL.createObjectURL(formData.photo)}
                        alt="Profil"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <span style={{ color: "#555" }}>Photo</span>
                    )}
                    <label
                      htmlFor="photo-input"
                      style={{
                        position: "absolute",
                        bottom: -2,
                        right: -1,
                        backgroundColor: "#fff",
                        borderRadius: "50%",
                        padding: "3px",
                        cursor: "pointer",
                      }}
                    >
                      <FaPlusCircle color="#3498db" size={24} />
                    </label>
                    <input
                      id="photo-input"
                      type="file"
                      accept="image/*"
                      name="photo"
                      onChange={handleChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom"
                  className="form-control mb-2 mt-3"
                  onChange={handleChange}
                  value={formData.nom}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-control mb-2"
                  onChange={handleChange}
                  value={formData.email}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Mot de passe"
                  className="form-control mb-2"
                  onChange={handleChange}
                  value={formData.password}
                  required
                />
                <select
                  name="role"
                  className="form-control mb-2"
                  onChange={handleChange}
                  value={formData.role}
                  required
                >
                  <option value="">Sélectionnez un rôle</option>
                  <option value="Admin">Admin</option>
                  <option value="Fondatrice">Fondatrice</option>
                  <option value="Monitrice_de_stage">Monitrice de stage</option>
                  <option value="Monitrice">Monitrice</option>
                  <option value="RAF">RAF</option>
                  <option value="Caissier">Caissier</option>
                  <option value="Responsable_de_suivi">
                    Responsable de suivi
                  </option>
                </select>
              </form>
            </div>

            <div className="modal-footer d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilModal;
