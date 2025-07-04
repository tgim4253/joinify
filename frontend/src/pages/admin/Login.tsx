import { useState, useContext } from "react";
import type { FormEvent } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
    // login 함수
    const { login } = useContext(AuthContext);
    // 이메일 입력값을 담는 State, 초기값은 빈 문자열
    const [email, setEmail] = useState("");
    // 비밀번호 입력값을 담는 State
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await fetch(import.meta.env.VITE_API_BASE as String + "/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (res.ok) {
            const { token, user } = await res.json();
            login(user, token);
        } else {
            setError("Login failed");
        }
    };


    return (
        <div className="w-full h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="w-80 space-y-3">
                <h1 className="text-xl font-bold text-center">Admin Login</h1>
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email"
                    className="border w-full p-2 rounded"
                />
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="password"
                    className="border w-full p-2 rounded"
                />
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <button className="border w-full p-2 rounded bg-black text-white">Login</button>
            </form>
        </div>
    );
}