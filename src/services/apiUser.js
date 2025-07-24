import axios from "axios";

export async function addUser(userData) {
  try {
    console.log("Sending to backend:", userData);
    const response = await axios.post("http://localhost:8000/auth", userData);

    const { user, token } = response.data;
    console.log(user);
    localStorage.setItem("token", token);
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || error.message || "Something went wrong";
    console.error("Signup failed:", errorMessage);
    throw new Error(errorMessage);
  }
}

export async function loginUser(userData) {
  try {
    const response = await axios.post("http://localhost:8000/login", userData);

    const { user, token } = response.data;
    console.log(user);
    localStorage.setItem("token", token);
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || error.message || "Something went wrong";
    console.log("Login failed" + errorMessage);
    throw new Error(errorMessage);
  }
}
