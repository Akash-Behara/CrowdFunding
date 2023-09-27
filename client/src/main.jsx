import React from 'react'
import  { createRoot }  from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { StateContextProvider } from './context';
import App from './app';
import './global.css';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
    <ThirdwebProvider clientId={import.meta.env.VITE_THIRDWEB_CLIENT_ID} activeChain="goerli">
        <StateContextProvider>
            <Router>
                <App />
            </Router>
        </StateContextProvider>
    </ThirdwebProvider>
);