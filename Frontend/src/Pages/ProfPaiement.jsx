import React, { useState } from 'react';
import Navbar from '../Composants/Navbar';
import Sidebar from '../Composants/Sidebar';
import PaiementTable from '../Composants/PaiementProfTable';
import PaiementProfesseur from '../Composants/PaiementProf';
import '../Styles/PaiementProfesseurs.css'; 

function PaiementProfesseurs() {
    // États pour les filtres
    const [searchName, setSearchName] = useState('');
    const [searchMatricule, setSearchMatricule] = useState('');
    const [selectedStatut, setSelectedStatut] = useState('');
    const [selectedMois, setSelectedMois] = useState('');
    const [selectedAnnee, setSelectedAnnee] = useState('');

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
                    <h4 className='fw-bold'>Gestion des paiements des personnels</h4>

                    <div className="hr mt-5"></div>
                    
                    <div className="filtre mt-3">
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
                  
                      
                        <input
                            type="number"
                            className='form-control'
                            placeholder="Année"
                            value={selectedAnnee}
                            onChange={(e) => setSelectedAnnee(e.target.value)}
                        />
                    </div>

                    <PaiementTable 
                        searchName={searchName} 
                        searchMatricule={searchMatricule} 
                        selectedStatut={selectedStatut}
                        selectedMois={selectedMois} 
                        selectedAnnee={selectedAnnee} 
                    />
                </section>
                
                <article className='p-3'>
                    <PaiementProfesseur />
                </article>
            </main>
            <footer></footer>
        </>
    );
}

export default PaiementProfesseurs;
