import React, {useContext, useEffect, useState} from 'react';
import AppRouter from './components/AppRouter';
import {Spinner} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import {check} from "./http/UserAPI";
import {Context} from "./index";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";

const App = observer(() => {
    const {user} = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initialize = async () => {
            try {
                const data = await check();
                user.setUser(data);
                user.setIsAuth(true);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.warn('Пользователь не авторизован');
                    user.setUser({});
                    user.setIsAuth(false);
                } else {
                    console.error('Ошибка при проверке пользователя:', error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, [user]);

    if (loading) {
        return <Spinner animation={"grow"}/>
    }

    return (
        <div className="app-wrapper">
            <NavBar />
            <div className="content">
                <AppRouter />
            </div>
            <Footer />
        </div>
    );
});

export default App;
