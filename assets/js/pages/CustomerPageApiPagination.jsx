import React, { useEffect,useState } from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';

const CustomersPageApiPagination = () => {

    const [loading, setLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        axios.get(`http://localhost:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
        .then(response => {
            setCustomers(response.data['hydra:member']);
            setTotalItems(response.data['hydra:totalItems']);
            setLoading(false);
        })
        .catch(error => console.log(error.response));
    }, [currentPage]); // will execute useEffect() on each currentPage change.


    const handleDelete = (id) => {

        const originalCustomers = [...customers]; // copy of customer's array

        setCustomers(customers.filter(customer => customer.id !== id))

        axios.delete("http://localhost:8000/api/customers/" + id)
        .then(response => console.log('ok'))
        .catch(error => setCustomers(originalCustomers));
    }


    const handlePageChange = (page) => {
        setCurrentPage(page);
        setLoading(true);
    }

    return (
        <>
            <h1>Liste des clients (Api pagination)</h1>

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
                    {loading && (
                        <tr>
                            <td>Chargement...</td>
                        </tr>
                    )}
                    {!loading && customers.map(customer => (
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

            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={totalItems}
                        onPageChange={handlePageChange}/>
        </>
    );
}

export default CustomersPageApiPagination;