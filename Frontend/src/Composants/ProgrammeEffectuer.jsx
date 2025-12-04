import React, { useState } from "react";
import "../Styles/Note.css";
import Swal from "sweetalert2";

function ProgrammeEffectuer() {
  const [filiere, setFiliere] = useState("");
  const [niveau, setNiveau] = useState("");
  const [semestre, setSemestre] = useState("");
  const [uniteEnseignement, setUniteEnseignement] = useState("");
  const [matiere, setMatiere] = useState("");
  const [professeur, setProfesseur] = useState("");
  const [volumeHoraireEffectue, setVolumeHoraireEffectue] = useState("");
  const [volumeHoraireTotal, setVolumeHoraireTotal] = useState("");

  // Données statiques
  const filieres = [
    "Gestion",
    "Commerce",
    "Tourisme"
  ];

  const niveaux = ["L1", "L2", "L3","M1","M2"];
  const niveauxSemestres = {
    L1: ["S1", "S2"],
    L2: ["S3", "S4"],
    L3: ["S5", "S6"]
  };

  const unitesEtMatieresSFIG = {
    "SCIENCES HUMAINES": ["Psychologie et psychiatrie", "Psychopathologie", "Sociologie"],
    "SANTÉ PUBLIQUE": ["Gestion d’un service", "Gestions de la ressource", "Formation des personnels", "Développement de l’esprit d’équipe", "Démarche qualité"],
    "MÉDECINE": ["Maladie cardio-vasculaire", "Maladie de l’appareil digestif"],
    "CHIRURGIE": ["Chirurgie", "Chirurgie dentaire"],
    "GYNÉCOLOGIQUE-OBSTÉTRIQUE": ["Santé de la reproduction", "Gynécologie et obstétrique"],
    "PÉDIATRIE": ["Pédiatrie", "Puériculture", "Santé infantile", "PCIME"],
    "PHARMACOLOGIE": ["Médicaments essentiels", "Différentes classes des médicaments"],
    "LÉGISLATION": ["Législation", "Déontologie"],
    "NURSING": ["Soins infirmiers en médecine", "Soins infirmiers en chirurgie"],
    "DÉMARCHE DE SOINS": ["SMN", "SONU", "Soins infirmiers en obstétrique", "Soins d’urgence"],
    "MÉTHODOLOGIE": ["Réalisation TFE"]
  };

  const unitesEtMatieresBTL = {
    "HÉMATOLOGIE": ["Hématologie", "Hémostase"],
    "BIOCHIMIE": ["Biochimie clinique", "PCA-PCG"],
    "ASSURANCE QUALITÉ": ["Assurance qualité", "Entretien"],
    "IMMUNOLOGIE": ["Immunologie", "Technique de Prélèvement"],
    "VIROLOGIE": ["Virologie", "Biologie moléculaire"],
    "PARASITOLOGIE": ["Parasitologie", "Transfusion sanguine"],
    "BACTÉRIOLOGIE": ["Bactériologie", "Pratique Bactériologie"],
    "MYCOLOGIE": ["Mycologie"],
    "ANGLAIS": ["Anglais"]
  };

  const professeurs = ["M. Dupont", "Mme Martin", "Dr. Laurent", "Pr. Simon"];

  // Sélection des unités et matières en fonction de la filière
  const getUnites = () => {
    if (filiere === "Gestion" || filiere === "Commerce") {
      return Object.keys(unitesEtMatieresSFIG);
    } else if (filiere === "Tourisme") {
      return Object.keys(unitesEtMatieresBTL);
    }
    return [];
  };

  const getMatieres = () => {
    if (filiere === "Gestion" || filiere === "Commerce") {
      return unitesEtMatieresSFIG[uniteEnseignement] || [];
    } else if (filiere === "Tourisme") {
      return unitesEtMatieresBTL[uniteEnseignement] || [];
    }
    return [];
  };

  // Réinitialisation du formulaire après validation
  const handleSubmit = (event) => {
    event.preventDefault();
    Swal.fire({
      icon: "success",
      title: "Programme enregistré",
      text: "Les informations ont été sauvegardées avec succès !",
    });

    setFiliere("");
    setNiveau("");
    setSemestre("");
    setUniteEnseignement("");
    setMatiere("");
    setProfesseur("");
    setVolumeHoraireEffectue("");
    setVolumeHoraireTotal("");
  };

  return (
    <div className="article p-3">
      <h5 className="title">Enregistrement du Programme Effectué</h5>
      <div className="hr mt-4"></div>

      <div className="form-container mt-3 p-4 border rounded shadow-sm">
        <form onSubmit={handleSubmit}>
          <select className="form-control mb-3" value={filiere} onChange={(e) => setFiliere(e.target.value)} required>
            <option value="">Sélectionner une filière</option>
            {filieres.map((f, index) => (
              <option key={index} value={f}>{f}</option>
            ))}
          </select>

          <select className="form-control mb-3" value={niveau} onChange={(e) => setNiveau(e.target.value)} required>
            <option value="">Sélectionner un niveau</option>
            {niveaux.map((n, index) => (
              <option key={index} value={n}>{n}</option>
            ))}
          </select>

          <select className="form-control mb-3" value={semestre} onChange={(e) => setSemestre(e.target.value)} required disabled={!niveau}>
            <option value="">Sélectionner un semestre</option>
            {niveau && niveauxSemestres[niveau]?.map((s, index) => (
              <option key={index} value={s}>{s}</option>
            ))}
          </select>

          <select className="form-control mb-3" value={uniteEnseignement} onChange={(e) => setUniteEnseignement(e.target.value)} required disabled={!filiere}>
            <option value="">Sélectionner une unité d'enseignement</option>
            {getUnites().map((u, index) => (
              <option key={index} value={u}>{u}</option>
            ))}
          </select>

          <select className="form-control mb-3" value={matiere} onChange={(e) => setMatiere(e.target.value)} required disabled={!uniteEnseignement}>
            <option value="">Sélectionner une matière</option>
            {getMatieres().map((m, index) => (
              <option key={index} value={m}>{m}</option>
            ))}
          </select>

          <select className="form-control mb-3" value={professeur} onChange={(e) => setProfesseur(e.target.value)} required>
            <option value="">Sélectionner un professeur</option>
            {professeurs.map((p, index) => (
              <option key={index} value={p}>{p}</option>
            ))}
          </select>
          <input type="text" placeholder="Année Académique"   className="form-control mb-3"  />

          <input type="number" className="form-control mb-3" placeholder="Volume horaire effectué" value={volumeHoraireEffectue} onChange={(e) => setVolumeHoraireEffectue(e.target.value)} required />

          <input type="number" className="form-control mb-3" placeholder="Volume horaire total" value={volumeHoraireTotal} onChange={(e) => setVolumeHoraireTotal(e.target.value)} required />

          <button type="submit" className="btn-submit">
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProgrammeEffectuer;
