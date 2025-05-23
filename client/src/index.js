import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter  } from 'react-router-dom';
import UserStore from "./store/UserStore";

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Context.Provider value={{
            user: new UserStore()
        }}>
            <HashRouter >
                <App />
            </HashRouter >
        </Context.Provider>
    </React.StrictMode>
);
