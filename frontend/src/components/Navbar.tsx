import './Navbar.css'

import { Link } from 'react-router-dom';

export const Navbar: React.FC = () => {
    return (
        <div id='navbar'>
            <div id='navbar-menu'>
                <ul>
                    <li><Link to="/liquid">Liquidación</Link></li>
                    <li><Link to="/liquid/sheet">WIP...</Link></li> 
                </ul>
            </div>
        </div>
    );
}