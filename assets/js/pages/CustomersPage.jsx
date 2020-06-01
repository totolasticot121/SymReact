import React, { useEffect,useState } from 'react';
import axios from 'axios';

const CustomersPage = () => {

    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/customers")
        .then(response => response.data['hydra:member'])
        .then(data => setCustomers(data))
        .catch(error => console.log(error.response));
    }, []);

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
                    {customers.map(customer => (
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
                                <button className="btn btn-sm btn-danger">Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
 
export default CustomersPage;