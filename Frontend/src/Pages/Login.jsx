import { useState } from "react";
import "../Styles/Login.css";
import Logo from "../assets/SARY.jpeg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // 🔹 Ajout d'un état de chargement
  const navigate = useNavigate();
  const url = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 🔹 Active le chargement
    const userData = { email, password };

    try {
      const response = await axios.post(
        `${url}/api/users/login`,
        userData
      );
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.user.role);
        localStorage.setItem("photo", response.data.user.photo);
        localStorage.setItem("nom", response.data.user.nom);
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Connexion Réussie!",
        });
        navigate("/Dashboard");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Échec de la connexion. Vérifiez vos informations.";
      Swal.fire({ icon: "error", title: "Erreur", text: errorMessage });
    } finally {
      setLoading(false); // 🔹 Désactive le chargement
    }
  };

  return (
    <main className="mainLogin center">
      <section className="login glass-effect p-3 center">
        <div className="leftLogin p-5">
          <div className="container p-5">
            <h1 className="mt-5 mb-4 center">E.S.P.M</h1>
            <p className="def">Transformation digitale des processus internes</p>
            {/* <p className="slogan">CREATIVITE - INTEGRITE - PROSPERITE</p> */}
            <p className="footer ">
              <i className="fa fa-check-circle"></i> Développé par{" "}
              <b>INNOV-T Consulting</b> (+261 38  10  788 60)
            </p>
          </div>
        </div>
        <div className="rightLogin p-5">
          {/* <img src={Logo} alt="Logo" width={20} /> */}
          <div className="exeption">
            <h2 className="fw-bold mb-5 center">
              <i className="fa fa-users"></i> Connexion
            </h2>
            <p>Veuillez entrer vos identifiants pour accéder à votre page.</p>
            <form className="mt-3" onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control input-field"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label>Adresse e-mail</label>
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control input-field"
                  placeholder="Mot de passe"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label>Mot de passe</label>
              </div>
              <button
                type="submit"
                className="btn btn-primary p-3 mt-3"
                disabled={loading}
              >
                {loading ? (
                  <i className="fa fa-spinner fa-spin"></i>
                ) : (
                  <i className="fa fa-sign-in-alt"></i>
                )}{" "}
                Se connecter
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
