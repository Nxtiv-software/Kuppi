import { Link } from "react-router-dom";

function TuttorDashBoardButton() {
    return (
        <Link to={"/tutor-dashboard"} className="bg-blue-600 inline-flex justify-center items-center text-white px-2 py-2 rounded-md" >DashBoard</Link>
    )
}

export default TuttorDashBoardButton
