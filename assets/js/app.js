import React, { useState } from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, withRouter } from "react-router-dom";
import "../css/app.css";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AuthContext from "./contexts/AuthContext";
import CustomersPage from "./pages/CustomersPage";
import HomePage from "./pages/HomePage";
import InvoicesPage from "./pages/InvoicesPage";
import LoginPage from "./pages/LoginPage";
import AuthAPI from "./services/AuthAPI";

AuthAPI.setUp();

const App = () => {
    const [isAuth, setIsAuth] = useState(AuthAPI.isAuth());

    // Give Route properties to Navbar component
    const NavbarWithRouter = withRouter(Navbar);

    const contextValue = {
        isAuth,
        setIsAuth,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            <HashRouter>
                <NavbarWithRouter />
                <main className="container pt-4">
                    <Switch>
                        {/* Most specific on top */}
                        <PrivateRoute path="/customers" component={CustomersPage}/>
                        <PrivateRoute path="/invoices" component={InvoicesPage}/>
                        <Route path="/login" component={LoginPage}/>
                        <Route path="/" component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    );
};

export default App;

const rootElement = document.querySelector("#app");
ReactDOM.render(<App />, rootElement);
