import React, { useState, useEffect } from 'react';
import AudioItem from './AudioItem';
import { getAllBeats } from '../api';

const AudioList = ({ beats: providedBeats }) => {
    const [beats, setBeats] = useState(providedBeats || []);
    useEffect(() => {
        if (!providedBeats) {
            const fetchBeats = async () => {
                try {
                    const data = await getAllBeats();
                    setBeats(data);
                } catch (error) {
                    console.error('Ошибка при получении списка аранжировок:', error);
                }
            };
            fetchBeats();
        }
    }, [providedBeats]);

    return (
        <div className="user-list">
            <h3 className="list__title">Аранжировки:</h3>
            {beats.length === 0 ? (
                <p className="list__title" style={{ color: 'red' }}><strong>Ничего не найдено</strong></p>
            ) : (
                beats.map(beat => <AudioItem key={beat.id} beat={beat} />)
            )}
        </div>
    );
};

export default AudioList;