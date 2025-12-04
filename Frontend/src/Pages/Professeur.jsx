import React, { useState } from 'react';
import Navbar from '../Composants/Navbar';
import Sidebar from '../Composants/Sidebar';
import AbsenceProf from '../Composants/AbsenceProf';
import ProfesseurModal from '../Composants/ProfesseurModal';
import ProfesseurTable from '../Composants/ProfesseurTable';

import '../Styles/Professeur.css'; 

function Professeur() {
    // États pour les filtres
    const [searchName, setSearchName] = useState('');
    const [searchMatricule, setSearchMatricule] = useState('');
    const [selectedDepartement, setSelectedDepartement] = useState('');
    const [selectedSpecialite, setSelectedSpecialite] = useState('');
    const [selectedStatut, setSelectedStatut] = useState('');
    const [selectedMoisEmbauche, setSelectedMoisEmbauche] = useState('');
    const [selectedAnneeEmbauche, setSelectedAnneeEmbauche] = useState('');

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
                    <h4 className='fw-bold'>Gestion des professeurs</h4>
                           <p className=''><ProfesseurModal /></p>

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
                            value={selectedStatut}
                            onChange={(e) => setSelectedStatut(e.target.value)}
                        >
                            <option value="">Tous les statuts</option>
                            <option value="Actif">Actif</option>
                            <option value="Inactif">Inactif</option>
                        </select>
                    
                       <input
                        type='Date'
                            className='form-control'
                            value={selectedAnneeEmbauche}
                            onChange={(e) => setSelectedAnneeEmbauche(e.target.value)}
                       />
                       
                    </div>

                    {/* Passer les filtres à ProfesseurTable */}
                    <ProfesseurTable 
                        searchName={searchName} 
                        searchMatricule={searchMatricule} 
                        selectedDepartement={selectedDepartement} 
                        selectedSpecialite={selectedSpecialite} 
                        selectedStatut={selectedStatut}
                        selectedMoisEmbauche={selectedMoisEmbauche} 
                        selectedAnneeEmbauche={selectedAnneeEmbauche} 
                    />
                </section>
                <article className='p-3'>
                    <AbsenceProf/>
                </article>
               
            </main>
            <footer></footer>
        </>
    );
}

export default Professeur;
