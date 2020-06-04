import axios from "axios";

function findAll() {
    return axios
        .get("http://localhost:8000/api/customers")
        .then((response) => response.data["hydra:member"]);
}

function findOne(id) {
    return axios
        .get("http://localhost:8000/api/customers/" + id)
        .then((response) => response.data);
}

function create(customer) {
    axios.post("http://localhost:8000/api/customers", customer);
}

function update(id, customer) {
    axios.put("http://localhost:8000/api/customers/" + id, customer);
}

function deleteCustomer(id) {
    return axios.delete("http://localhost:8000/api/customers/" + id);
}

export default {
    findAll,
    findOne,
    create,
    update,
    delete: deleteCustomer
};
