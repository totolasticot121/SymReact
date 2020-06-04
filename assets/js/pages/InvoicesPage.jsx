import moment from "moment";
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import InvoicesAPI from "../services/InvoicesAPI";
import { Link } from "react-router-dom";

const STATUS_CLASSES = {
    Paid: "success",
    Sent: "primary",
    Cancel: "danger",
};

const STATUS_LABELS = {
    Paid: "Payée",
    Sent: "Envoyée",
    Cancel: "Annulée",
};

const InvoicesPage = (props) => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const itemsPerPage = 10;

    // Fetch invoices when loading the component
    useEffect(() => {
        InvoicesAPI.findAll()
            .then((data) => setInvoices(data))
            .catch((error) => console.log(error.response));
    }, []);

    // Manage page change
    const handlePageChange = (page) => setCurrentPage(page);

    // Manage cutomer search
    const handleSearch = (event) => {
        setSearch(event.currentTarget.value);
        setCurrentPage(1);
    };

    const handleDelete = async (id) => {
        const originalInvoices = [...invoices];

        setInvoices(invoices.filter((invoice) => invoice.id !== id));

        try {
            await InvoicesAPI.delete(id);
        } catch (error) {
            console.log(error.response);
            setInvoices(originalInvoices);
        }
    };
    
    // Manage date format
    const formatDate = (str) => moment(str).format("DD/MM/YYYY");

    const filteredInvoices = invoices.filter(
        (i) =>
            i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
            i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
            i.amount.toString().startsWith(search.toLowerCase()) ||
            STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );

    // Data pagination
    const paginatedInvoices = Pagination.getData(
        filteredInvoices,
        itemsPerPage,
        currentPage
    );


    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1 className="mb-3">Liste des factures</h1>
                <Link to="/invoices/new" className="btn btn-primary">Nouvelle facture</Link>
            </div>

            <div className="form-group">
                <input
                    onChange={handleSearch}
                    value={search}
                    type="text"
                    className="form-control"
                    placeholder="Rechercher..."
                />
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th className="text-center">Numéro</th>
                        <th>Client</th>
                        <th>Date d'envoi</th>
                        <th className="text-center">Statut</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedInvoices.map((invoice) => (
                        <tr key={invoice.id}>
                            <td className="text-center">{invoice.chrono}</td>
                            <td>
                                <a href="#">
                                    {invoice.customer.firstName}{" "}
                                    {invoice.customer.lastName}
                                </a>
                            </td>
                            <td>{formatDate(invoice.sentAt)}</td>
                            <td className="text-center">
                                <span
                                    className={
                                        "badge badge-" +
                                        STATUS_CLASSES[invoice.status]
                                    }
                                >
                                    {STATUS_LABELS[invoice.status]}
                                </span>
                            </td>
                            <td className="text-center">
                                {invoice.amount.toLocaleString()} $
                            </td>
                            <td>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>
                                    Supprimer
                                </button>
                                &nbsp;
                                <Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-primary">Editer</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={filteredInvoices.length}
                onPageChange={handlePageChange}
            />
        </>
    );
};

export default InvoicesPage;
