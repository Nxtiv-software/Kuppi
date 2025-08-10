import { Link } from "react-router-dom"

function StudentDashBoardButton() {
    return (
        <Link className="bg-blue-600 inline-flex justify-center items-center text-white px-2 py-2 rounded-md" to={"/student-dashboard"}>DashBoard</Link>
    )
}

export default StudentDashBoardButton
