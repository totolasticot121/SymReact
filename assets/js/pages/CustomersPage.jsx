import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import CustomersAPI from "../services/CustomersAPI";
import { Link } from "react-router-dom";

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");

    // Fetch customers when loading the component
    useEffect(() => {
        CustomersAPI.findAll()
            .then((data) => setCustomers(data))
            .catch((error) => console.log(error.response));
    }, []);

    // Manage customer supression
    const handleDelete = async (id) => {
        const originalCustomers = [...customers]; // copy of customer's array

        setCustomers(customers.filter((customer) => customer.id !== id));

        try {
            await CustomersAPI.delete(id);
        } catch (error) {
            setCustomers(originalCustomers);
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
            (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
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
                <tbody>
                    {paginatedCustomers.map((customer) => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>
                                <a href="#">
                                    {customer.firstName} {customer.lastName}
                                </a>
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
                                    className="btn btn-sm btn-danger"
                                    disabled={customer.invoices.length > 0}
                                    onClick={() => handleDelete(customer.id)}
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
