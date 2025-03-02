import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';

function UserItem() {
    return (
        <CardGroup style={{ display: 'inline-flex', gap: '16px' }}>
            <Card>
                <Card.Img variant="top" src="https://dummyimage.com/300x300"/>
                <Card.Body>
                    <Card.Title>Имя музыканта</Card.Title>
                    <Card.Text>
                        Тут находится биография или описание музыканта.
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <small className="text-muted">Аранжировок: 2</small>
                </Card.Footer>
            </Card>
        </CardGroup>
    );
}

export default UserItem;