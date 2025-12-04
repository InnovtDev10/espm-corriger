import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Navbar from '../Composants/Navbar';
import Sidebar from '../Composants/Sidebar';
import LivretAdd from '../Composants/LivretAdd';

import LivretTable from '../Composants/LivretTable';
import '../Styles/Etudiant.css';

function Livret() {
    const navigate = useNavigate(); // Définition de navigate

    const naviguerVersMatieres = () => {
        navigate("/etudiant"); 
    };

    // États pour stocker les filtres
    const [searchName, setSearchName] = useState('');
    const [searchMatricule, setSearchMatricule] = useState('');
    const [selectedFiliere, setSelectedFiliere] = useState('');
    const [selectedNiveau, setSelectedNiveau] = useState('');
    const [selectedAnnee, setSelectedAnnee] = useState('');
    const [selectedMois, setSelectedMois] = useState('');
    const [refresh, setRefresh] = useState(false);

    return (
        <>
            <header className='pt-3'>
                <Navbar />
            </header>
            <main className='center p-3'>
                <aside className='p-3'>
                    <Sidebar />
                </aside>
                <section className='contenu mt-3 p-4'>
    <h4 className='fw-bold'>Livrets</h4>
    
    <div className="d-flex justify-content-end align-items-center">
        <button 
            className="btn btn-primary mt-0 me-2" // "me-2" pour un petit espace à droite
            onClick={naviguerVersMatieres}
        >
            Retour
        </button>

    </div>
    
    <div className="hr mt-2"></div>
    <div className="filtre center mb-3 mt-3">
        <input
            type="text"
            placeholder='Recherche par nom'
            className='form-control'
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
        />
        <input
            type="text"
            placeholder='Matricule'
            className='form-control'
            value={searchMatricule}
            onChange={(e) => setSearchMatricule(e.target.value)}
        />
        <select
            className='form-control'
            value={selectedFiliere}
            onChange={(e) => setSelectedFiliere(e.target.value)}
        >
            <option value="">Toutes les filières</option>
            <option>Gestion</option>
            <option>Commerce</option>
            <option>Tourisme</option>
        </select>
        <select
            className='form-control'
            value={selectedNiveau}
            onChange={(e) => setSelectedNiveau(e.target.value)}
        >
            <option value="">Tous les niveaux</option>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
            <option value="M1">M1</option>
            <option value="M2">M2</option>
        </select>
        <input
    type="text"
    className="form-control"
    value={selectedAnnee}
    onChange={(e) => setSelectedAnnee(e.target.value)}
    placeholder="(ex: 2024-2025)"
 />

    </div>
    {/* Passer les filtres à StudentTable */}
    <LivretTable 
        refresh={refresh}
        searchName={searchName}  
        searchMatricule={searchMatricule} 
        selectedFiliere={selectedFiliere} 
        selectedNiveau={selectedNiveau} 
        selectedMois={selectedMois} 
        selectedAnnee={selectedAnnee} 
    />
</section>

                <article className='p-3'>
                    <LivretAdd/>
                </article>
            </main>
            <footer></footer>
        </>
    );
}

export default Livret;
