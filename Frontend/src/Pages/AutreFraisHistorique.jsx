import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // ✅ Import ajouté
import Navbar from '../Composants/Navbar';
import Sidebar from '../Composants/Sidebar';
import { GiReceiveMoney } from "react-icons/gi"; 
import AutreFraisHistoriqueTable from '../Composants/AutreFraisHistoriqueTable';

function AutreFraisHistorique() {
    const navigate = useNavigate();  // ✅ Utilisation correcte de useNavigate

    // État pour stocker les paiements (exemple, remplace avec des données réelles)
    const [paiements, setPaiements] = useState([]);  

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
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h4 className='fw-bold'>Historique Détaillée</h4>
                    <button className="payment-btn2" onClick={() => navigate("/frais")}>
                        <GiReceiveMoney size={24} /> Paiement Autre Frais
                    </button>
                </div>
                   
                    <div className="hr mt-2"></div>
                
                    {/* Passer les paiements à la table */}
                    <AutreFraisHistoriqueTable paiements={paiements} />
                </section>
            </main>
            <footer></footer>
        </>
    );
}

export default AutreFraisHistorique;
