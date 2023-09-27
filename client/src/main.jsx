import React from 'react'
import  { createRoot }  from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import App from './app';
import './global.css';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
    <ThirdwebProvider desiredChainId={ChainId.Goerli}>
        <Router>
            <App />
        </Router>
    </ThirdwebProvider>
);