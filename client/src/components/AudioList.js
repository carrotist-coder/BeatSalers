import React, {useState, useEffect, useContext} from 'react';
import {Form, Container, Row, Col, Card, Button} from 'react-bootstrap';
import AudioItem from './AudioItem';
import { getAllBeats } from '../api';
import { STYLES } from "../utils/consts";
import AudioFormModal from "../modals/AudioFormModal";
import {useLocation, useParams} from "react-router-dom";
import {Context} from "../index";

const AudioList = ({ beats: providedBeats }) => {
    const [beats, setBeats] = useState(providedBeats || []);
    const [searchQuery, setSearchQuery] = useState('');
    const [usernameQuery, setUsernameQuery] = useState('');
    const [bpmMin, setBpmMin] = useState('');
    const [bpmMax, setBpmMax] = useState('');
    const [styleQuery, setStyleQuery] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [currentAudio, setCurrentAudio] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { user } = useContext(Context);
    const location = useLocation();
    const { username } = useParams(); // если на /profiles/:username
    const isAdmin = user.isAuth && user.user.role === 'admin';
    const isOwnProfile = user.isAuth && username === user.user.username;
    const isOtherUserProfile = isAdmin && username && !isOwnProfile;
    const isMainPage = location.pathname === '/' || location.pathname === '/beats';
    const canAddBeat = isMainPage || isOwnProfile || isOtherUserProfile;

    const getTargetUsername = () => {
        if (isOtherUserProfile) {
            return username; // чужой профиль, админ может публиковать за него
        }
        return null; // во всех остальных случаях — публикуем от себя
    };

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

    const handleAudioPlay = (audioElement) => {
        if (currentAudio && currentAudio !== audioElement) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }
        setCurrentAudio(audioElement);
    };

    const filteredAndSortedBeats = beats
        .filter(beat =>
            beat.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            beat.seller_username.toLowerCase().includes(usernameQuery.toLowerCase()) &&
            (bpmMin === '' || beat.bpm >= parseInt(bpmMin)) &&
            (bpmMax === '' || beat.bpm <= parseInt(bpmMax)) &&
            (styleQuery === '' || beat.style.toLowerCase().includes(styleQuery.toLowerCase())) &&
            (priceMin === '' || beat.price >= parseFloat(priceMin)) &&
            (priceMax === '' || beat.price <= parseFloat(priceMax)) &&
            (sortOption !== 'freeOnly' || beat.price === 0)
        )
        .sort((a, b) => {
            if (sortOption === 'priceAsc') return a.price - b.price;
            if (sortOption === 'priceDesc') return b.price - a.price;
            if (sortOption === 'dateNew') return new Date(b.created_at) - new Date(a.created_at);
            if (sortOption === 'dateOld') return new Date(a.created_at) - new Date(b.created_at);
            if (sortOption === 'alphaAsc') return a.title.localeCompare(b.title);
            if (sortOption === 'alphaDesc') return b.title.localeCompare(a.title);
            return 0;
        });

    const handleBeatAdded = () => {
        window.location.reload();
    };

    return (
        <Container className="user-list">
            <div className="user-list__row">
                <h3 className="list__title">Аранжировки:</h3>
                {canAddBeat && (
                    <Button
                        variant="success"
                        className="user-list__btn"
                        onClick={() => setShowCreateModal(true)}
                    >
                        Добавить аранжировку
                    </Button>
                )}
            </div>
            <Card className="p-4 mb-4 search-bar">
                <Form>
                    <Row className="gy-3">
                        <Col md={4}>
                            <Form.Group controlId="searchQuery">
                            <Form.Label>Название</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Введите название..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="usernameQuery">
                                <Form.Label>Автор</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Введите имя автора..."
                                    value={usernameQuery}
                                    onChange={(e) => setUsernameQuery(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="styleQuery">
                                <Form.Label>Стиль</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={styleQuery}
                                    onChange={(e) => setStyleQuery(e.target.value)}
                                >
                                    <option value="">Любой стиль</option>
                                    {STYLES.map((style, index) => (
                                        <option key={index} value={style.toLowerCase()}>{style}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group controlId="bpmMin">
                                <Form.Label>Мин. BPM</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    max="400"
                                    placeholder="От"
                                    value={bpmMin}
                                    onChange={(e) => {
                                        if (e.target.value === '' || (Number(e.target.value) >= 1 && Number(e.target.value) <= 400)) {
                                            setBpmMin(e.target.value);
                                        }
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group controlId="bpmMax">
                                <Form.Label>Макс. BPM</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    max="400"
                                    placeholder="До"
                                    value={bpmMax}
                                    onChange={(e) => {
                                        if (e.target.value === '' || (Number(e.target.value) >= 1 && Number(e.target.value) <= 400)) {
                                            setBpmMax(e.target.value);
                                        }
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group controlId="priceMin">
                                <Form.Label>Мин. цена</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    max="5000"
                                    placeholder="От"
                                    value={priceMin}
                                    onChange={(e) => {
                                        if (e.target.value === '' || (Number(e.target.value) >= 0 && Number(e.target.value) <= 5000)) {
                                            setPriceMin(e.target.value);
                                        }
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group controlId="priceMax">
                                <Form.Label>Макс. цена</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="0"
                                    max="5000"
                                    placeholder="До"
                                    value={priceMax}
                                    onChange={(e) => {
                                        if (e.target.value === '' || (Number(e.target.value) >= 0 && Number(e.target.value) <= 5000)) {
                                            setPriceMax(e.target.value);
                                        }
                                    }}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group controlId="sortOption">
                                <Form.Label>Сортировка</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                >
                                    <option value="">Выберите...</option>
                                    <option value="priceAsc">Цена ↑</option>
                                    <option value="priceDesc">Цена ↓</option>
                                    <option value="dateNew">Сначала новые</option>
                                    <option value="dateOld">Сначала старые</option>
                                    <option value="alphaAsc">A-Z</option>
                                    <option value="alphaDesc">Z-A</option>
                                    <option value="freeOnly">Бесплатно!</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Card>

            {filteredAndSortedBeats.length === 0 ? (
                <p className="list__title" style={{color: 'red'}}>
                    <strong>Ничего не найдено</strong>
                </p>
            ) : (
                filteredAndSortedBeats.map(beat => (
                    <AudioItem
                        key={beat.id}
                        beat={beat}
                        onPlay={handleAudioPlay}
                    />
                ))
            )}
            <AudioFormModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onUpdated={() => {
                    if (!providedBeats) {
                        getAllBeats().then(setBeats);
                    }
                }}
                onAdded={handleBeatAdded}
                sellerUsername={getTargetUsername()}
            />
        </Container>
    );
};

export default AudioList;