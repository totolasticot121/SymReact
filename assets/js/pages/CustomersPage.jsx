import React, { useEffect,useState } from 'react';
import axios from 'axios';
import Pagination from '../components/pagination';

const CustomersPage = () => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        axios.get("http://localhost:8000/api/customers")
        .then(response => response.data['hydra:member'])
        .then(data => setCustomers(data))
        .catch(error => console.log(error.response));
    }, []);

    const handleDelete = (id) => {

        const originalCustomers = [...customers]; // copy of customer's array

        setCustomers(customers.filter(customer => customer.id !== id))

        axios.delete("http://localhost:8000/api/customers/" + id)
        .then(response => console.log('ok'))
        .catch(error => setCustomers(originalCustomers));
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    const itemsPerPage = 10;
    const paginatedCustomers = Pagination.getData(customers, itemsPerPage, currentPage);

    return (
        <>
            <h1>Liste des clients</h1>

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
                    {paginatedCustomers.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>
                                <a href="#">{customer.firstName} {customer.lastName}</a>
                            </td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className="text-center">
                                <span className="badge badge-success">{customer.invoices.length}</span>
                            </td>
                            <td className="text-center">{customer.totalAmount.toLocaleString()} $</td>
                            <td>
                                <button className="btn btn-sm btn-danger"
                                        disabled={customer.invoices.length > 0}
                                        onClick={() => handleDelete(customer.id)}>
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={customers.length}
                        onPageChange={handlePageChange}/>
        </>
    );
}
 
export default CustomersPage;