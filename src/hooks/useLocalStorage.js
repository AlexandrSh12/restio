import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        const stored = localStorage.getItem(key);
        try {
            const parsed = stored ? JSON.parse(stored) : initialValue;
            // Если items нет или не объект — сбросить
            if (!parsed || typeof parsed !== 'object' || typeof parsed.items !== 'object') {
                return initialValue;
            }
            return parsed;
        } catch {
            return initialValue;
        }

    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}