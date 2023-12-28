import {
    Navbar,
    NavbarBrand,
} from 'reactstrap';
import { Link } from 'react-router-dom';

const AdminTop = () => {
    return (
        <div className="t_wrapper" style={{ zIndex: 0 }}>
            <Navbar color='white' expand="md" className="navbar-expand-md">
                <NavbarBrand className="d-flex justify-content-between align-items-center w-100">
                    <Link to="/adminmain" style={{textDecoration:"none"}}>
                        <div style={{ display: "flex" }}>
                            <div className="logo">
                                DEALicious
                            </div>
                            <div style={{ color: "black", fontWeight: "bold", marginLeft: "-20px", fontSize:"12px" }}>
                                admin
                            </div>
                        </div>
                    </Link>
                </NavbarBrand>
            </Navbar>
        </div>
    );
}

export default AdminTop;
