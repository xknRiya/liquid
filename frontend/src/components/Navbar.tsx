import './Navbar.css'

import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
    return (
        <div id='navbar'>
            <div id='navbar-menu'>
                <ul>
                    <li><Link to="/">Liquidación</Link></li>
                    <li><Link to="/sheet">{"En proceso..."}</Link></li>
                </ul>
            </div>
        </div>
    );
}