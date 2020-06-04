import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import CustomersAPI from "../services/CustomersAPI";
import { toast } from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";

const CustomerPage = ({ match, history }) => {
    const { id = "new" } = match.params;

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: "",
    });

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: "",
    });

    // Fetch one customer depending on the id
    const fetchCustomer = async (id) => {
        try {
            const {
                firstName,
                lastName,
                email,
                company,
            } = await CustomersAPI.findOne(id);
            setCustomer({ firstName, lastName, email, company });
            setLoading(false);
        } catch (error) {
            toast.error("Le client n'a pas pu être chargé.");
            history.replace("/customers");
        }
    };

    // Load customer if needed on first component load or on id change (create/update)
    useEffect(() => {
        if (id !== "new") {
            setLoading(true);
            setEditing(true);
            fetchCustomer(id);
        } else {
            setEditing(false);
        }
    }, [id]);

    // Manage inputs changes in form
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setCustomer({ ...customer, [name]: value });
    };

    // Manage form submition
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setErrors({});
            if (editing) {
                await CustomersAPI.update(id, customer);
                toast.success("Le client a bien été modifié");
                history.replace("/customers");
            } else {
                await CustomersAPI.create(customer);
                toast.success("Le client a bien été enregistré.");
                history.replace("/customers");
            }
        } catch (error) {
            let violations = error.response.data.violations;
            if (violations) {
                const apiErrors = {};
                violations.forEach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
                toast.error("Une erreur est survenue");
            }
        }
    };

    return (
        <>
            <h1 className="mb-5">
                {!editing ? "Créer un client" : "Modifier un client"}
            </h1>

            {loading && <FormContentLoader />}

            {!loading && (
                <form onSubmit={handleSubmit}>
                    <Field
                        name="lastName"
                        label="Nom"
                        placeholder="Nom de famille du client"
                        value={customer.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                    />
                    <Field
                        name="firstName"
                        label="Prénom"
                        placeholder="Prénom du client"
                        value={customer.firstName}
                        onChange={handleChange}
                        error={errors.firstName}
                    />
                    <Field
                        name="email"
                        label="Email"
                        placeholder="Adresse email du client"
                        type="email"
                        value={customer.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                    <Field
                        name="company"
                        label="Entreprise"
                        placeholder="Entreprise du client"
                        value={customer.company}
                        onChange={handleChange}
                        error={errors.company}
                    />
                    <div className="form-group">
                        <button type="submit" className="btn btn-success">
                            Enregistrer
                        </button>
                        <Link to="/customers" className="btn btn-link">
                            Retour à la liste
                        </Link>
                    </div>
                </form>
            )}
        </>
    );
};

export default CustomerPage;
