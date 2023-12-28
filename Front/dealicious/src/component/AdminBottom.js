import { AiFillHome } from "react-icons/ai";
import { MdOutlineCalculate } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { CgNotes } from "react-icons/cg";
import {
    Nav,
    Navbar,
    NavbarBrand,
} from 'reactstrap';
import { Link } from 'react-router-dom';

const AdminBottom = () => {
  return (
    <Nav className="b_wrapper nav">
        <div>
          <Link to="/adminmain">
            <AiFillHome size='23' color='72DBBB' />
          </Link>
        </div>
        <div>
          <Link to={"/adminsettle"}>
            <MdOutlineCalculate size='25' color='72DBBB' />
          </Link>
        </div>
        <div>
          <Link to={"/adminsettlelist"}>
            <CgNotes size='23' color='72DBBB' />
          </Link>
        </div>
        <div>
          <Link to={"/adminmy"}>
            <IoPerson size='23' color='72DBBB' />
          </Link>
        </div>
    </Nav>
  );
}

export default AdminBottom;
