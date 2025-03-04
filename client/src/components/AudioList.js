import React, { useState, useEffect } from 'react';
import AudioItem from './AudioItem';
import { getAllBeats } from '../api';

const AudioList = () => {
    const [beats, setBeats] = useState([]);
    useEffect(() => {
        const fetchBeats = async () => {
            try {
                const data = await getAllBeats();
                setBeats(data);
            } catch (error) {
                console.error('Ошибка при получении списка аранжировок:', error);
            }
        };
        fetchBeats();
    }, []);

    return (
        <div className="user-list">
            <h3 className="list__title">Аранжировки:</h3>
            {beats.map(beat => (
                <AudioItem key={beat.id} beat={beat} />
            ))}
        </div>
    );
};

export default AudioList;