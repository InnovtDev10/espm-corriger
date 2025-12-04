import React, { useState } from 'react';
import Navbar from '../Composants/Navbar';
import Sidebar from '../Composants/Sidebar';
import ProfilModal from '../Composants/ProfilModal';
import ProfilTable from '../Composants/ProfilTable';
import '../Styles/Profil.css';

function Profils() { 
    // États pour les filtres
    const [searchName, setSearchName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedStatut, setSelectedStatut] = useState('');
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
                <section className='contenu2 mt-3 p-4'>
                    <h4 className='fw-bold'>Gestion des profils utilisateurs</h4>
                    <div className="hr mt-2"></div>
                    <div className="btnAjout mt-4">
                    <ProfilModal onUserAdded={() => setRefresh(prev => !prev)} />
                    </div>

                
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
                            placeholder='Recherche par email'
                            className='form-control'
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                        />
                        <select
                            className='form-control'
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <option value="">Tous les rôles</option>
                            <option value="Admin">Fondatrice</option>
                                    <option value="Monitrice_de_stage">Monitrice de stage</option>
                                    <option value="Monitrice">Monitrice</option>
                                    <option value="RAF">RAF</option>
                                    <option value="Caissier">Caissier</option>
                                    <option value="Responsable_de_suivi">Responsable de suivi</option>
                        </select>
                        <select
                            className='form-control'
                            value={selectedStatut}
                            onChange={(e) => setSelectedStatut(e.target.value)}
                        >
                            <option value="">Tous les statuts</option>
                            <option value="Actif">Actif</option>
                            <option value="Inactif">Inactif</option>
                        </select>
                    </div>

                    <ProfilTable 
                        refresh={refresh}
                        searchName={searchName} 
                        searchEmail={searchEmail} 
                        selectedRole={selectedRole} 
                        selectedStatut={selectedStatut} 
                    />
                </section>
            </main>
            <footer></footer>
        </>
    );
}

export default Profils;
