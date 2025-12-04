import React, { useState } from 'react';
import Navbar from '../Composants/Navbar';
import Sidebar from '../Composants/Sidebar';
import { Button } from "react-bootstrap";
import '../Styles/Profil.css';
import UploadDocumentModal from "../Composants/UploadDocumentModal";
import DocumentTable from "../Composants/DocumentTable";

function Documents() { 
    const [showModal, setShowModal] = useState(false);
    const [documents, setDocuments] = useState([]);

    const handleSave = (formData) => {
        console.log("Données soumises :", formData);
        setDocuments([...documents, { 
          nom: formData.nom, 
          description: formData.description, 
          fichier: formData.fichier 
        }]);
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
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className='fw-bold'>Documents Administratifs</h4>
                        <Button 
                          onClick={() => setShowModal(true)} 
                          className="ms-auto"
                        >
                          Ajouter un Document
                        </Button>
                    </div>
                    <div className="hr mt-2"></div>

                    <UploadDocumentModal
                        show={showModal}
                        handleClose={() => setShowModal(false)}
                        handleSave={handleSave}
                    />

                    <div className='mt-4'>
                        <DocumentTable documents={documents} />
                    </div> 
                </section>
            </main>
            <footer></footer>
        </>
    );
}

export default Documents;
