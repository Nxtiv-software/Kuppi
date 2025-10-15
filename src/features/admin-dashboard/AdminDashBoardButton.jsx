import { Link } from "react-router-dom";

function AdminDashBoardButton() {
    return (
        <Link 
            to="/admin-dashboard" 
            className="bg-blue-600 inline-flex justify-center items-center text-white px-2 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
            Admin Dashboard
        </Link>
    )
}

export default AdminDashBoardButton
