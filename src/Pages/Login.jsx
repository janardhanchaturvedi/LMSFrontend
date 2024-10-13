import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import HomeLayout from "../Layouts/HomeLayout";
import { login } from "../Redux/Slices/AuthSlice";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  console.log("🚀 ~ Signup ~ loginData:", loginData)
  function handleUserInput(e) {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  }

  async function onLogin(event) {
    event.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill all the details");
      return;
    }

    // dispatch create account action
    const response = await dispatch(login(loginData));
    if (response?.payload?.success) navigate("/");

    setLoginData({
      email: "",
      password: "",
    });
  }

  return (
    <HomeLayout>
      <div className="flex overflow-x-auto items-center justify-center h-[100vh]">
        <form
          noValidate
          onSubmit={onLogin}
          className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-bold">Login Page</h1>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">
              {" "}
              Email{" "}
            </label>
            <input
              type="email"
              required
              name="email"
              id="email"
              placeholder="Enter your email.."
              className="bg-transparent px-2 py-1 border rounded-lg"
              onChange={handleUserInput}
              value={loginData.email}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold">
              {" "}
              Password{" "}
            </label>
            <input
              type="password"
              required
              name="password"
              id="password"
              placeholder="Enter your password.."
              className="bg-transparent px-2 py-1 border rounded-lg"
              onChange={handleUserInput}
              value={loginData.password}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="block mb-0.5 text-sm font-medium text-gray-900 dark:text-white"
            >
              {" "}
              Role{" "}
            </label>
            <select
              id="role"
              name="role"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={handleUserInput}
            >
              <option selected>Choose a Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-2 bg-red-600 hover:bg-red-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer"
          >
            Login
          </button>

          <p className="text-center">
            Donot hanve an account ?{" "}
            <Link to="/signup" className="link text-accent cursor-pointer">
              {" "}
              Signup
            </Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
}

export default Signup;
