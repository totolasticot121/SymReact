import React, { useState } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import axios from "axios";
import UsersAPI from "../services/UsersAPI";

const RegisterPage = ({history}) => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    // Manage inputs changes in form
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const apiErrors = {};
        if(user.password !== user.confirmPassword) {
            apiErrors.confirmPassword = "Votre confirmation de mot de passe n'est pas conforme à l'original";
            setErrors(apiErrors);
            return;
        }

        try {
            const response = await UsersAPI.register(user);
            setErrors({});
            history.replace('/login');
        } catch (error) {
            const {violations} = error.response.data;
            if (violations) {
                const apiErrors = {};
                violations.forEach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
            }
        }
    };

    return (
        <>
            <h1>S'inscrire</h1>

            <form onSubmit={handleSubmit}>
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Votre prénom"
                    error={errors.firstName}
                    value={user.firstName}
                    onChange={handleChange}
                />
                <Field
                    name="lastName"
                    label="Nom"
                    placeholder="Votre nom"
                    error={errors.lastName}
                    value={user.lastName}
                    onChange={handleChange}
                />
                <Field
                    name="email"
                    label="Email"
                    placeholder="Votre adresse email"
                    error={errors.email}
                    value={user.email}
                    onChange={handleChange}
                />
                <Field
                    name="password"
                    label="Mot de passe"
                    type="password"
                    placeholder="Votre mot de passe"
                    error={errors.password}
                    value={user.password}
                    onChange={handleChange}
                />
                <Field
                    name="confirmPassword"
                    label="Confirmation mot de passe"
                    type="password"
                    placeholder="Confirmer votre mot de passe"
                    error={errors.confirmPassword}
                    value={user.confirmPassword}
                    onChange={handleChange}
                />
                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/login" className="btn btn-link">J'ai déja un compte</Link>
                </div>
            </form>
        </>
    );
};

export default RegisterPage;
