import ReactDOM from "react-dom";
import React, { useState } from "react";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../css/app.css";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AuthContext from "./contexts/AuthContext";
import CustomerPage from "./pages/CustomerPage";
import CustomersPage from "./pages/CustomersPage";
import HomePage from "./pages/HomePage";
import InvoicePage from "./pages/InvoicePage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthAPI from "./services/AuthAPI";

AuthAPI.setUp();

const App = () => {

    const [isAuth, setIsAuth] = useState(AuthAPI.isAuth());

    const contextValue = {
        isAuth,
        setIsAuth,
    };

    // Give Route properties to Navbar component
    const NavbarWithRouter = withRouter(Navbar);

    return (
        <AuthContext.Provider value={contextValue}>
            <HashRouter>
                <NavbarWithRouter />
                <main className="container pt-4">
                    <Switch>
                        {/* Most specific on top */}
                        <PrivateRoute path="/customers/:id" component={CustomerPage}/>
                        <PrivateRoute path="/invoices/:id" component={InvoicePage}/>
                        <PrivateRoute path="/customers" component={CustomersPage}/>
                        <PrivateRoute path="/invoices" component={InvoicesPage}/>
                        <Route path="/login" component={LoginPage}/>
                        <Route path="/register" component={RegisterPage}/>
                        <Route path="/" component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
            <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
        </AuthContext.Provider>
    );
};

export default App;

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
