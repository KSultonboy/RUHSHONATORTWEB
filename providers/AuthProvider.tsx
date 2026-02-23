"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Customer = {
    id: string;
    name: string;
    phone: string;
    address?: string;
    points: number;
    birthday?: string | null;
};

type AuthContextValue = {
    customer: Customer | null;
    token: string | null;
    loading: boolean;
    login: (token: string, customer: Customer) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY_TOKEN = "ruxshona_customer_token";
const STORAGE_KEY_USER = "ruxshona_customer_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
        const savedUser = localStorage.getItem(STORAGE_KEY_USER);
        if (savedToken && savedUser) {
            setToken(savedToken);
            setCustomer(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    function login(newToken: string, newCustomer: Customer) {
        setToken(newToken);
        setCustomer(newCustomer);
        localStorage.setItem(STORAGE_KEY_TOKEN, newToken);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newCustomer));
    }

    function logout() {
        setToken(null);
        setCustomer(null);
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_USER);
    }

    return (
        <AuthContext.Provider value={{ customer, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
