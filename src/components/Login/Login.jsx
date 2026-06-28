import "./Login.css";

import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(null);

    useEffect(() => {

        const saved = localStorage.getItem('rememberMeValue');

        setRememberMe(saved !== null ? saved === 'true' : false);

    }, []);

    useEffect(() => {
        if (rememberMe === null) return;
        localStorage.setItem('rememberMeValue', rememberMe);
    }, [rememberMe]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!userName) {
            alert("Preencha seu Email!");
            return;
        }

        if (!password) {
            alert("Preencha sua senha!");
            return;
        }

        try {

            const responseFetch = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userName, password: password }),
            });

            if (responseFetch.ok) {
                const response = await responseFetch.json();

                localStorage.setItem('token', response.token);

                navigate('/todos');
            } else {

                if (responseFetch.status === 401) {
                    alert("Informações de Login incorretas, verifique seu E-Mail e Senha.");
                    return;
                }

                alert("Ocorreu um erro durante seu Login! Tente novamente");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div className="input-field">
                    <input value={userName} type='email' placeholder='Digite seu E-Mail' onChange={(e) => setUserName(e.target.value)}></input>
                    <FaUser className="icon" />
                </div>
                <div className="input-field">
                    <input value={password} type='password' placeholder='Senha' onChange={(e) => setPassword(e.target.value)}></input>
                    <FaLock className="icon" />
                </div>
                <div className="recall-forget">
                    <label>
                        <input checked={rememberMe || false} type="checkbox" onChange={(e) => setRememberMe(e.target.checked)} />
                        Lembre de mim
                    </label>
                    <a href="#">Esqueceu a senha?</a>
                </div>
                <button className="loginButton">Entrar</button>
                <div className="signup-link">
                    <p>Não tem uma conta? <Link to={"/register"}>Clique aqui para se registar!</Link></p>
                </div>
            </form>
        </div>
    )
}

export default Login