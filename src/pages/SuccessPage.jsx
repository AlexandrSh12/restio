import { useLocation, Navigate } from 'react-router-dom';

export default function SuccessPage() {
    const location = useLocation();
    const orderNumber = location.state?.orderNumber;

    // Если нет номера заказа в state, значит страница открыта не после создания заказа
    if (!orderNumber) {
        return <Navigate to="/" replace />;
    }

    return (
        <div style={{ padding: '16px' }}>
            <h2>✅ Заказ #{orderNumber} отправлен</h2>
            <p>Ожидайте готовности. Когда заказ будет готов, вы получите уведомление.</p>
            <p style={{ fontWeight: 'bold', marginTop: '20px' }}>Примерное время ожидания: 15-20 минут</p>
            <button
                onClick={() => window.location.href = '/'}
                style={{
                    padding: '8px 16px',
                    marginTop: '20px',
                    background: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Вернуться к меню
            </button>
        </div>
    );
}