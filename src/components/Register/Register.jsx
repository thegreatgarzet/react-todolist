import "./Register.css";

import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SiEnterprisedb } from "react-icons/si";
import { Link } from 'react-router-dom';
import { hasNumberRegex, hasSpecialRegex, minPassSize } from "../../utils/regexList";

const Register = () => {
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
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

        if (password != repeatPassword) {
            alert("As senhas não estão iguais!");
            return;
        }

        if (password.length < minPassSize) {
            alert("Sua senha possui menos que 8 caracteres!");
            return;
        }

        if (!hasNumberRegex.test(password)) {
            alert("Sua senha não possui nenhum número!");
            return;
        }

        if (!hasSpecialRegex.test(password)) {
            alert("Sua senha não possui nenhum caractere especial!");
            return;
        }

        try {

            const responseFetch = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userName, password: password }),
            });

            if (responseFetch.ok) {
                const response = await responseFetch.json();

                localStorage.setItem('token', response.token);

                navigate('/todos');
            } else {

                if (responseFetch.status === 400) {
                    alert("Este E-Mail ja esta cadastrado! Utilize outro.");
                    return;
                }

                if (responseFetch.status === 401) {
                    alert("Este E-Mail ja esta cadastrado! Utilize outro.");
                    return;
                }

                alert("Ocorreu um erro durante seu registro! Tente novamente");
            }
        } catch (error) {
            console.log(error);
            alert("Ocorreu um erro ao conectar com o servidor. Tente novamente mais tarde");
        }
    };

    const passwordMatches = () => {
        if (!repeatPassword && !password) return true;

        return password === repeatPassword;
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h1>Criar uma Conta</h1>
                <div className="input-field">
                    <input value={userName} type='email' placeholder='Digite seu E-Mail' onChange={(e) => setUserName(e.target.value)}></input>
                    <FaUser className="icon" />
                </div>
                <p className="text-align-center">Sua senha deve conter no minimo 8 letras, 1 número e 1 caractér especial.</p>
                <div className="input-field">
                    <input value={password} type='password' placeholder='Digite uma senha para sua conta' onChange={(e) => setPassword(e.target.value)}></input>
                    <FaLock className="icon" />
                </div>
                <div className="input-field">
                    <input value={repeatPassword} type='password' placeholder='Repita a senha' onChange={(e) => setRepeatPassword(e.target.value)}></input>
                    <FaLock className="icon" />
                </div>
                <div className="passwordValidator" style={{ color: passwordMatches() ? "#efefef" : "#be0000" }}>
                    <p>As Senhas não estão iguais. Verfique</p>
                </div>
                <button className="registerButton">Criar Conta</button>
                <div className="signup-link">
                    <p>Já possui uma conta? <Link to={"/"}>Clique aqui para entrar!</Link></p>
                </div>
            </form>
        </div>
    )
}

export default Register