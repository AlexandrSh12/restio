import { Link } from 'react-router-dom';

export default function SuccessPage() {
    return (
        <div style={{ padding: '16px' }}>
            <h2>✅ Заказ отправлен</h2>
            <p>Ожидайте готовности. Когда заказ будет готов, вы получите уведомление.</p>
            <Link to="/">← Вернуться к меню</Link>
        </div>
    );
}
