import{BrowserRouter,Routes,Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import './App.css';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Etudiant from './Pages/Etudiant';
import Professeur from './Pages/Professeur';
import '../src/Styles/Composants.css'
import Note from './Pages/Note';
import Resultat from './Pages/Resultat';
import Frais from './Pages/Frais';
import Fourniture from './Pages/Fourniture';
import Classe from './Pages/Classe';
import Stage from './Pages/Stage';
import NoteMaj from './Pages/NoteMaj';
import Profils from './Pages/Profil';
import EcolagePayment from './Composants/EcolagePayment';
import NoteStage from "./Composants/NoteStage"; 
import FinanceSortie from "./Composants/FinanceSortie"; 
import FinanceGenerale from "./Composants/FinanceGenerale"; 
import NoteStageLabo from "./Composants/NoteStageLabo"; 
import PaiementProfesseurs from './Pages/ProfPaiement';
import EcolageHistorique from './Pages/EcolageHistorique';
import ModifNote from './Composants/ModifNote';
import CaisseSortie from './Composants/CaisseSortie';
import Caisse from './Pages/Caisse';
import PrivateRoute from '../src/config/privateRoute';
import Programme from './Pages/Programme';
import AccessDenied from './Pages/AccessDenied';
import Documents from './Pages/Documents';
import Matieres from './Pages/Matieres'
import StudentTableDossier from './Composants/DossierEtudiant';
import Livret from './Pages/Livret';
import TableauMat from './Pages/TableauMat';
import RapportGenerale from './Pages/Rapport';
import Charts from './Pages/Charts';
import AutreFraisHistorique from './Pages/AutreFraisHistorique';

function App() {
  return ( 
    <BrowserRouter>
      <Routes> 
        <Route path='/' element={<Login/>}/>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "Monitrice", "Monitrice_de_stage", "Caissier", "RAF", "Responsable_de_suivi"]} />}>
          <Route path='/Dashboard' element={<Dashboard />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin"]} />}>
          <Route path='/rapport' element={<RapportGenerale />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "Monitrice", "Monitrice_de_stage", "Caissier", "RAF", "Responsable_de_suivi"]} />}>
          <Route path='/matliste' element={<TableauMat />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "Monitrice", "Monitrice_de_stage", "Caissier", "RAF", "Responsable_de_suivi"]} />}>
          <Route path='/dossier' element={<StudentTableDossier />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "Monitrice", "Monitrice_de_stage", "Caissier", "RAF", "Responsable_de_suivi"]} />}>
          <Route path='/livret' element={<Livret />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "Monitrice","Monitrice_de_stage", "Responsable_de_suivi","Caissier"]} />}>
          <Route path='/etudiant' element={<Etudiant />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "Caissier", "RAF"]} />}>
          <Route path='/classe' element={<Classe />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "Responsable_de_suivi", "Caissier", "Monitrice", "Monitrice_de_stage"]} />}>
          <Route path='/prof' element={<Professeur />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={[ "Responsable_de_suivi","Fondatrice", "Admin", "Monitrice", "Monitrice_de_stage"]} />}>
          <Route path='/note' element={<Note />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "Responsable_de_suivi", "Monitrice", "Monitrice_de_stage"]} />}>
          <Route path='/resultat' element={<Resultat />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "RAF", "Caissier"]} />}>
          <Route path='/fourniture' element={<Fourniture />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "RAF", "Caissier"]} />}>
          <Route path='/frais' element={<Frais />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "Monitrice_de_stage", "RAF","Monitrice"]} />}>
          <Route path='/stage' element={<Stage />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "Caissier", "RAF"]} />}>
          <Route path='/ecolagePayment' element={<EcolagePayment />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "Monitrice",, "Responsable_de_suivi", "Monitrice_de_stage", "Responsable_de_suivi"]} />}>
          <Route path='/notestage' element={<NoteStage />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "Responsable_de_suivi", "Monitrice_de_stage", "Monitrice"]} />}>
          <Route path='/notestagelabo' element={<NoteStageLabo />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={[ "Responsable_de_suivi","Fondatrice", "Admin", "Monitrice", "Monitrice_de_stage", "Monitrice_de_stage"]} />}>
          <Route path='/notemaj' element={<NoteMaj />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin"]} />}>
          <Route path='/profil' element={<Profils />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "RAF","Caissier"]} />}>
          <Route path="/paie" element={<PaiementProfesseurs />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "RAF"]} />}>
          <Route path="/sortie" element={<FinanceSortie />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "RAF"]} />}>
          <Route path="/financegenerale" element={<FinanceGenerale />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "RAF"]} />}>
          <Route path="/chart" element={<Charts />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "Responsable_de_suivi", "Monitrice", "Monitrice_de_stage"]} />}>
          <Route path="/programme" element={<Programme />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "RAF", "Caissier"]} />}>
          <Route path="/caissesortie" element={<CaisseSortie />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "RAF", "Caissier"]} />}>
          <Route path="/ecolagehistorique" element={<EcolageHistorique />} />
        </Route> 
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "RAF", "Caissier"]} />}>
          <Route path="/autrefraishistorique" element={<AutreFraisHistorique />} />
        </Route> 
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "RAF"]} />}>
          <Route path="/doc" element={<Documents />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "RAF","Caissier"]} />}>
          <Route path="/caisse" element={<Caisse />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "Responsable_de_suivi"]} />}>
          <Route path="/modifier-note" element={<ModifNote />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice"]} />}>
          <Route path="/profil" element={<Profils />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={["Fondatrice", "Admin", "Monitrice", "Monitrice_de_stage", "RAF", "Responsable_de_suivi"]} />}>
          <Route path="/matieres" element={<Matieres />} />
        </Route>
        <Route path="/access-denied" element={<AccessDenied />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
