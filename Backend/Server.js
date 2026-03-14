require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require("path");

const app = express();

// Middleware CORS manuel pour s'assurer que les headers sont toujours envoyés
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://espm-managment.innov-t-consulting.mg',
    'https://api-espm.innov-t-consulting.mg'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

// Désactivation cache (LiteSpeed)
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// Configuration CORS avec le package cors (en plus du manuel)
const corsOptions = {
  origin: function (origin, callback) {
    console.log('CORS origin:', origin);
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
const etudiantRoutes = require('./routes/etudiantRoutes');
const professeurRoutes = require('./routes/professeurRoutes');
const noteRoutes = require('./routes/noteRoutes');
const matiereRoutes = require("./routes/matiereRoutes");
const fraisRoutes = require('./routes/fraisRoutes');
const ecolageRoutes = require('./routes/ecolageRoutes');
const paiementDroit = require('./routes/paiementDroitRoutes');
const paiementFrais = require('./routes/paiementFraisRoutes');
const paiementEcolage = require('./routes/paiementEcolageRoutes');
const stageRoutes = require('./routes/stageRoutes');
const noteStageRoutes = require('./routes/noteStageRoutes');
const materielRoutes = require('./routes/materielRoutes');
const sortieMaterielRoutes = require('./routes/sortieMaterielRoutes');
const pointageEtudiantRoutes = require('./routes/pointageEtudiantRoutes');
const pointageProfesseurRoutes = require('./routes/pointageProfesseurRoutes');
const paiementSalaireRoutes = require('./routes/paiementSalaireRoutes');
const autreDepenseRoutes = require('./routes/autreDepenseRoutes');
const programmeRoutes = require("./routes/programmeRoutes");
const siteStageRoutes = require("./routes/siteStageRoutes");
const listeDocumentRoutes = require("./routes/listeDocumentRoutes");
const livretRoutes = require('./routes/livretRoutes');
const immobilisationRoutes = require('./routes/immobilisationRoutes');

app.use('/api/users', userRoutes); // Routes pour les utilisateurs
app.use('/api/etudiant', etudiantRoutes); // Routes pour les etudiants
app.use('/api/prof', professeurRoutes); // Routes pour les professeurs
app.use('/api/note', noteRoutes); // Routes pour les notes
app.use("/api/matiere", matiereRoutes); // Routes pour les matieres   
app.use('/api/frais', fraisRoutes); // Routes pour les frais    
app.use("/api/ecolage", ecolageRoutes); // Routes pour les ecolages
app.use("/api/paiement/droit", paiementDroit); // Routes pour les paiements droits
app.use("/api/paiement/frais", paiementFrais); // Routes pour les paiements frais
app.use("/api/paiement/ecolage", paiementEcolage); // Routes pour les paiements ecolages
app.use("/api/stage", stageRoutes); // Routes pour les stages
app.use("/api/notestage", noteStageRoutes); // Routes pour les notes de stages
app.use("/api/materiel", materielRoutes); // Routes pour les materiels
app.use("/api/sortiemateriel", sortieMaterielRoutes); // Routes pour les sorties materiels
app.use("/api/pointage/etudiant", pointageEtudiantRoutes); // Routes pour les pointages etudiants
app.use("/api/pointage/prof", pointageProfesseurRoutes); // Routes pour les pointages professeurs
app.use("/api/paiement/salaire", paiementSalaireRoutes); // Routes pour les paiement
app.use("/api/autre-depenses", autreDepenseRoutes); // Routes pour les autre depense
app.use("/api/programme", programmeRoutes); // Routes pour les programmes
app.use("/api/site-stage", siteStageRoutes); // Routes pour les sites de stages
app.use("/api/document", listeDocumentRoutes); // Routes pour les documments
app.use("/api/livret", livretRoutes); // Routes pour les livrets   
app.use("/api/immobilisation", immobilisationRoutes); // Routes pour les immobilisations 
app.post("/post-check", (req, res) => {
  res.json({ ok: true });
});
// Servir le dossier "uploads" statiquement
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get('/', (req, res) => {
  res.send('Bienvenue sur l’API de gestion d’université 🎓');                 
});

const PORT =process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
