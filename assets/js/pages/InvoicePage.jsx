import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import FormContentLoader from "../components/loaders/FormContentLoader";
import CustomersAPI from "../services/CustomersAPI";
import InvoicesAPI from "../services/InvoicesAPI";

const InvoicePage = ({ history, match }) => {
    const { id = "new" } = match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        customer: "",
        status: "Sent",
    });

    const [errors, setErrors] = useState({
        amount: "",
        customer: "",
        status: "",
    });

    const [customers, setCustomers] = useState([]);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    const FetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll();
            setCustomers(data);
            setLoading(false);

            if (!invoice.customer) {
                setInvoice({ ...invoice, customer: data[0].id });
            }
        } catch (error) {
            toast.error("Erreur lors du chargement des clients.");
            history.replace("/invoices");
        }
    };

    const FetchInvoice = async (id) => {
        try {
            const { amount, status, customer } = await InvoicesAPI.findOne(id);
            setInvoice({ amount, status, customer: customer.id });
            setLoading(false);
        } catch (error) {
            toast.error(
                "Une erreur est survenue lors du chargement de la facture."
            );
            history.replace("/invoices");
        }
    };

    useEffect(() => {
        FetchCustomers();
    }, []);

    useEffect(() => {
        if (id !== "new") {
            setEditing(true);
            FetchInvoice(id);
        }
    }, [id]);

    // Manage inputs changes in form
    const handleChange = ({ currentTarget }) => {
        const { name, value } = currentTarget;
        setInvoice({ ...invoice, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (editing) {
                await InvoicesAPI.update(id, invoice);
                toast.success("La facture a bien été modifiée.");
            } else {
                await InvoicesAPI.create(invoice);
                toast.success("La facture a bien été enregistré.");
                history.replace("/invoices");
            }
        } catch (error) {
            let violations = error.response.data.violations;
            if (violations) {
                const apiErrors = {};
                violations.forEach(({ propertyPath, message }) => {
                    apiErrors[propertyPath] = message;
                });
                setErrors(apiErrors);
                toast.error("Il y a des erreurs dans votre formulaire.");
            }
        }
    };

    return (
        <>
            <h1>{editing ? "Modifier une facture" : "Créer une facture"}</h1>

            {loading && <FormContentLoader />}

            {!loading && (
                <form onSubmit={handleSubmit}>
                    <Field
                        name="amount"
                        type="number"
                        placeholder="Montant de la facture"
                        label="montant"
                        onChange={handleChange}
                        value={invoice.amount}
                        error={errors.amount}
                    />

                    <Select
                        name="customer"
                        label="Clients"
                        value={invoice.customer}
                        error={errors.customer}
                        onChange={handleChange}
                    >
                        {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                                {customer.firstName} {customer.lastName}
                            </option>
                        ))}
                    </Select>
                    <Select
                        name="status"
                        label="Statut"
                        value={invoice.status}
                        error={errors.status}
                        onChange={handleChange}
                    >
                        <option value="Send">Envoyée</option>
                        <option value="Paid">Payée</option>
                        <option value="Cancelled">Annulée</option>
                    </Select>

                    <div className="form-group">
                        <button type="submit" className="btn btn-success">
                            Enregistrer
                        </button>
                        <Link to="/invoices" className="btn btn-link">
                            Retour à la liste
                        </Link>
                    </div>
                </form>
            )}
        </>
    );
};

export default InvoicePage;
