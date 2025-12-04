import React, { useState } from 'react';
import Navbar from '../Composants/Navbar';
import Sidebar from '../Composants/Sidebar';

import ProgrammeModal from '../Composants/ProgrammeModale';
import ProgrammeTable from '../Composants/programmeTable';

import { useNavigate } from 'react-router-dom'; 
function Programme() {
    // État pour stocker les filtres

    const navigate = useNavigate();  // Déclare la constante navigate pour rediriger

    const naviguerVersMatieres = () => {
        navigate("/matieres");  // Navigue vers la page /matieres
    };
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
                    <h4 className='fw-bold'>Gestion des programmes</h4>
                    <div className="d-flex justify-content-end align-items-center">
                    <button 
                        className="btn btn-primary mb-3 me-2"
                        onClick={naviguerVersMatieres}
                    >
                        Gérer les Matières
                    </button>
                    <p className='mb-0'><ProgrammeModal /></p>
                    </div>
                    <div className="hr mt-2"></div>
                
                    {/* Passer les filtres à StudentTable */}
                    <ProgrammeTable 
              
                    />
                </section>
       
            </main>
            <footer></footer>
        </>
    );
}

export default Programme;
