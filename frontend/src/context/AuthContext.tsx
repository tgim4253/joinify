import React, { createContext, useEffect, useState } from "react";

// null!: null 허용
export const AuthContext = createContext<AuthContextType>({
    user: null,
    ready: false,
    login: () => { },
    logout: () => { },
});

/*
    AuthProvider: 여러 컴포넌트에서 사용자가 로그인 했는지 알고 싶음 
        => 로그인한 사용자 정보를 Context로 만듦 => 공유
    React.FC: React Functional Component => 함수형 컴포넌트를 ts로 정의할 때 타입을 명확하게 하기 위해
    <{ children: React.ReactNode }>: 컴포넌트가 받는 props의 타입을 지정
*/
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem("auth");
        return saved ? JSON.parse(saved).user : null;
    });
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("auth");
        if (saved) {
            setUser(JSON.parse(saved).user);
        }
        setReady(true);
    }, []);

    const login = (u: User, t: string) => {
        setUser(u);
        localStorage.setItem("auth", JSON.stringify({ user: u, token: t }));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("auth");
    };

    return (
        <AuthContext.Provider value={{ user, ready, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};