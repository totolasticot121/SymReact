import React, { useState, useContext } from "react";
import AuthAPI from "../services/AuthAPI";
import AuthContext from "../contexts/AuthContext";

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
            history.replace("/");
        } catch (error) {
            setError("Les informations fournies sont invalides.");
        }
    };

    return (
        <>
            <h1>Connexion</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Adresse email</label>
                    <input
                        value={credentials.username}
                        onChange={handleChange}
                        type="email"
                        placeholder="email de connexion"
                        name="username"
                        id="username"
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Mot de passe</label>
                    <input
                        value={credentials.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="mot de passe"
                        name="password"
                        id="password"
                        className={"form-control" + (error && " is-invalid")}
                    />
                    {error && <p className="invalid-feedback">{error}</p>}
                </div>
                <div className="form-group">
                    <button className="btn btn-success">Je me connecte</button>
                </div>
            </form>
        </>
    );
};

export default LoginPage;
