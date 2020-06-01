import '../css/app.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Navbar from './components/navbar';
import HomePage from './pages/HomePage';
import CustomersPage from './pages/CustomersPage';
import { HashRouter, Switch, Route } from 'react-router-dom';


const App = () => {
    return ( 
        <HashRouter>
            <Navbar/>
            <main className="container pt-4">
                <Switch>
                    {/* Most specific on top */}
                    <Route path="/customers" component={CustomersPage}/>
                    <Route path="/" component={HomePage}/>
                </Switch>
            </main>
        </HashRouter>
    );
}
 
export default App;

const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);