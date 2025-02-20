import React, {useContext, useEffect, useState} from 'react';
import Auth from "./pages/Auth";
import {Spinner} from "react-bootstrap";
import {observer} from "mobx-react-lite";
import {check} from "./http/UserAPI";
import {Context} from "./index";

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
        <Auth />
    );
});

export default App;
