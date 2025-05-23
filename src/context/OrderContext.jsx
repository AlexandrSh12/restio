import { createContext, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage';

const OrderContext = createContext();

export function OrderProvider({ children }) {
    const [draft, setDraft] = useLocalStorage('restioOrder', {
        id: uuidv4(),
        items: {},
        status: 'draft',
        createdAt: new Date().toISOString()
    });

    // Reset to new draft after sending
    const clearOrder = () => {
        setDraft({
            id: uuidv4(),
            items: {},
            status: 'draft',
            createdAt: new Date().toISOString()
        });
    };

    const handleAdd = (dish, count) => {
        setDraft(prev => {
            const items = { ...prev.items };
            if (count === 0) {
                delete items[dish.id];
            } else {
                items[dish.id] = { ...dish, count };
            }
            return { ...prev, items };
        });
    };

    const total = Object.values(draft?.items || {}).reduce(
        (sum, item) => sum + item.count * item.price,
        0
    );

    return (
        <OrderContext.Provider
            value={{
                draft,
                setDraft,
                handleAdd,
                clearOrder,
                total
            }}
        >
            {children}
        </OrderContext.Provider>
    );
}

export const useOrder = () => useContext(OrderContext);