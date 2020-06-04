import React, { useState, useContext } from "react";
import AuthAPI from "../services/AuthAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";
import { toast } from "react-toastify";

const LoginPage = ({ history }) => {
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");
    const { setIsAuth } = useContext(AuthContext);

    // Manage inputs
    const handleChange = (event) => {
        const name = event.currentTarget.name;
        const value = event.currentTarget.value;

        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await AuthAPI.authenticate(credentials);
            setError("");
            setIsAuth(true);
            toast.success("Vous êtes connnecté.")
            history.replace("/");
        } catch (error) {
            setError("Les informations fournies sont invalides.");
            toast.error("Une erreur est survenue.")
        }
    };

    return (
        <>
            <h1>Connexion</h1>

            <form onSubmit={handleSubmit}>
                <Field
                    name="username"
                    label="Adresse email"
                    value={credentials.username}
                    onChange={handleChange}
                    placeholder="email de connexion"
                    type="email"
                />
                <Field
                    name="password"
                    label="Mot de passe"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Mot de passe"
                    type="password"
                    error={error}
                />
                <div className="form-group">
                    <button className="btn btn-success">Je me connecte</button>
                </div>
            </form>
        </>
    );
};

export default LoginPage;
