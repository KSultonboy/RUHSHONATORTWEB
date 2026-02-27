"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Customer } from "@/lib/types";
import { getCustomerMe } from "@/lib/api";

type AuthContextValue = {
    customer: Customer | null;
    token: string | null;
    loading: boolean;
    login: (token: string, customer: Customer) => void;
    setCustomer: (customer: Customer) => void;
    refreshCustomer: () => Promise<void>;
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
            try {
                setToken(savedToken);
                setCustomer(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem(STORAGE_KEY_TOKEN);
                localStorage.removeItem(STORAGE_KEY_USER);
            }
        }
        setLoading(false);
    }, []);

    async function refreshCustomer() {
        if (!token) return;
        const latest = await getCustomerMe(token);
        setCustomer(latest);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(latest));
    }

    useEffect(() => {
        if (!token) return;
        void refreshCustomer().catch(() => {
            // keep cached user if backend is temporarily unreachable
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    function login(newToken: string, newCustomer: Customer) {
        setToken(newToken);
        setCustomer(newCustomer);
        localStorage.setItem(STORAGE_KEY_TOKEN, newToken);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newCustomer));
    }

    function setCustomerState(nextCustomer: Customer) {
        setCustomer(nextCustomer);
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(nextCustomer));
    }

    function logout() {
        setToken(null);
        setCustomer(null);
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_USER);
    }

    return (
        <AuthContext.Provider value={{ customer, token, loading, login, setCustomer: setCustomerState, refreshCustomer, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
