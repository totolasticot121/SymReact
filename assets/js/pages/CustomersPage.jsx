import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/CustomersAPI";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch customers when loading the component
    useEffect(() => {
        CustomersAPI.findAll()
            .then((data) => {
                setCustomers(data);
                setLoading(false);
            })
            .catch((error) =>
                toast.error("Une erreur est survenue lors du chargmenet des clients.")
            );
    }, []);

    // Manage customer supression
    const handleDelete = async (id) => {
        const originalCustomers = [...customers]; // copy of customer's array

        setCustomers(customers.filter((customer) => customer.id !== id));

        try {
            await CustomersAPI.delete(id);
            toast.success("Le client a bien été supprimé.");
        } catch (error) {
            setCustomers(originalCustomers);
            toast.error("Une erreur est survenue.");
        }
    };

    // Manage page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Manage cutomer search
    const handleSearch = (event) => {
        setSearch(event.currentTarget.value);
        setCurrentPage(1);
    };

    const itemsPerPage = 10;

    // Filtering customers based on search
    const filteredCustomers = customers.filter(
        (c) =>
            c.firstName.toLowerCase().includes(search.toLowerCase()) ||
            c.lastName.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.company &&
                c.company.toLowerCase().includes(search.toLowerCase()))
    );

    // Data pagination
    const paginatedCustomers = Pagination.getData(
        filteredCustomers,
        itemsPerPage,
        currentPage
    );

    return (
        <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h1 className="mb-3">Liste des clients</h1>
                <Link to="/customers/new" className="btn btn-primary">
                    Nouveau client
                </Link>
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
                        <th>id</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Factures</th>
                        <th className="text-center">Montant total</th>
                        <th></th>
                    </tr>
                </thead>
                {!loading && (
                    <tbody>
                        {paginatedCustomers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.id}</td>
                                <td>
                                    <Link to={"/customers/" + customer.id}>
                                        {customer.firstName} {customer.lastName}
                                    </Link>
                                </td>
                                <td>{customer.email}</td>
                                <td>{customer.company}</td>
                                <td className="text-center">
                                    <span className="badge badge-success">
                                        {customer.invoices.length}
                                    </span>
                                </td>
                                <td className="text-center">
                                    {customer.totalAmount.toLocaleString()} $
                                </td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-danger mr-2"
                                        disabled={customer.invoices.length > 0}
                                        onClick={() =>
                                            handleDelete(customer.id)
                                        }
                                    >
                                        Supprimer
                                    </button>
                                    <Link
                                        to={"/customers/" + customer.id}
                                        className="btn btn-sm btn-primary"
                                    >
                                        Editer
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                )}
            </table>
            {loading && <TableLoader />}

            {itemsPerPage < filteredCustomers.length && (
                <Pagination
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    length={filteredCustomers.length}
                    onPageChange={handlePageChange}
                />
            )}
        </>
    );
};

export default CustomersPage;
