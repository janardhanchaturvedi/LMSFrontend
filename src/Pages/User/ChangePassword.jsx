import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BsPersonCircle } from "react-icons/bs";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import HomeLayout from "../../Layouts/HomeLayout";
import { changePassword, getUserData } from "../../Redux/Slices/AuthSlice";

function ChangePassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState({
    previewImage: "",
    fullName: "",
    avatar: undefined,
    userId: useSelector((state) => state?.auth?.data?._id),
  });
  const [showPassword, setShowPassword] = useState({
    oldPasswordShow: false,
    newPassword: false,
  });


  function handleInputChange(e) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    console.log(data);
    if (!data.oldPassword || !data.newPassword) {
      toast.error("All fields are mandatory");
      return;
    }
    if (data.oldPassword.length < 5 && data.newPassword.length < 5) {
      toast.error("Password cannot be of less than 5 characters");
      return;
    }
    const body = {
      oldPassword: data?.oldPassword,
      newPassword: data?.newPassword,
    };
    await dispatch(changePassword(body));

    await dispatch(getUserData());

    navigate("/user/profile");
  }

  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[100vh]">
        <form
          onSubmit={onFormSubmit}
          className="flex flex-col justify-center gap-5 rounded-lg p-4 text-white w-80 min-h-[26rem] shadow-[0_0_10px_black]"
        >
          <h1 className="text-center text-2xl font-semibold mb-5">
            Change Password
          </h1>
          <div className="flex flex-col gap-1">
            <label htmlFor="fullName" className="text-lg font-semibold">
              Old Password
            </label>
            <div className="relative w-full">
              <input
               
                required
                type={showPassword.oldPasswordShow ? "text" : "password"}
                name="oldPassword"
                id="oldPassword"
                placeholder="Enter your Old Password"
                className="bg-transparent px-2 py-1 border w-full"
                value={data.oldPassword}
                onChange={handleInputChange}
              />
              {showPassword.oldPasswordShow ? (
                <FaEyeSlash
                  className="absolute top-2 right-3 hover:cursor-pointer"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      oldPasswordShow: !showPassword.oldPasswordShow,
                    })
                  }
                />
              ) : (
                <FaEye
                className="absolute top-2 right-3 hover:cursor-pointer"
                  onClick={() =>setShowPassword({
                    ...showPassword,
                    oldPasswordShow: !showPassword.oldPasswordShow,
                  })}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="fullName" className="text-lg font-semibold">
              New Password
            </label>
            <div className="relative w-full">
            <input
              required
              type={showPassword.newPassword ? "text" : "password"}
              name="newPassword"
              id="newPassword"
              placeholder="Enter your New Password"
              className="bg-transparent px-2 py-1 border w-full"
              value={data.newPassword}
              onChange={handleInputChange}
            />
              {showPassword.newPassword ? (
                <FaEyeSlash
                  className="absolute top-2 right-3 hover:cursor-pointer"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      newPassword: !showPassword.newPassword,
                    })
                  }
                />
              ) : (
                <FaEye
                className="absolute top-2 right-3 hover:cursor-pointer"
                  onClick={() =>setShowPassword({
                    ...showPassword,
                    newPassword: !showPassword.newPassword,
                  })}
                />
              )}
              </div>
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-500 transition-all ease-in-out duration-300 rounded-sm py-2 text-lg cursor-pointer"
          >
            Change Password
          </button>
          <Link to="/user/profile">
            <p className="link text-accent cursor-pointer flex items-center justify-center w-full gap-2">
              <AiOutlineArrowLeft /> Go back to profile
            </p>
          </Link>
        </form>
      </div>
    </HomeLayout>
  );
}

export default ChangePassword;
