import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
import '../css/app.css';
import Navbar from './components/Navbar';
import CustomersPage from './pages/CustomersPage';
import HomePage from './pages/HomePage';
import InvoicesPage from './pages/InvoicesPage';
import LoginPage from './pages/LoginPage';


const App = () => {
    return ( 
        <HashRouter>
            <Navbar/>
            <main className="container pt-4">
                <Switch>
                    {/* Most specific on top */}
                    <Route path="/customers" component={CustomersPage}/>
                    <Route path="/invoices" component={InvoicesPage}/>
                    <Route path="/login" component={LoginPage}/>
                    <Route path="/" component={HomePage}/>
                </Switch>
            </main>
        </HashRouter>
    );
}
 
export default App;

const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);