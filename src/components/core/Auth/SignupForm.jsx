import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import Tab from "../../common/Tab";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import Cookies from "js-cookie";

const BASE_URL = process.env.REACT_APP_BASE_URL;

function SignupForm() {
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.ADMIN);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const { firstName, lastName, email, phoneNumber, password, confirmPassword } =
    formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords Do Not Match");
      return;
    }

    const signupData = {
      ...formData,
      accountType,
    };

    try {
      const response = await axios.post(`${BASE_URL}/signup`, signupData);
      const { token } = response.data;

      // Set token in cookie instead of local storage
      Cookies.set("authToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        expires: 1,
      }); // Expires in 1 day

      toast.success("Account created successfully! Please log in.");
      navigate("/login");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
        navigate("/login");
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    });
    setAccountType(ACCOUNT_TYPE.ADMIN);
  };

  const tabData = [
    { id: 1, tabName: "Admin", type: ACCOUNT_TYPE.ADMIN },
    { id: 2, tabName: "Vendor", type: ACCOUNT_TYPE.VENDOR },
    { id: 3, tabName: "User", type: ACCOUNT_TYPE.USER },
  ];

  const handleGoogleSignup = async () => {
    try {
      await axios.post(
        `http://localhost:4000/set-account-type`,
        { accountType },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      window.location.href = `http://localhost:4000/auth/google`;
    } catch (error) {
      toast.error("Error while setting account type");
      console.error(error);
    }
  };

  return (
    <div>
      <Tab tabData={tabData} field={accountType} setField={setAccountType} />
      <form className="flex w-full flex-col gap-y-4" onSubmit={handleOnSubmit}>
        <div className="flex gap-x-4">
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              First Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleOnChange}
              placeholder="Enter first name"
              className="form-style w-full bg-richblack-800 h-12 pl-4 rounded-lg text-richblack-50"
            />
          </label>
          <label>
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Last Name <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type="text"
              name="lastName"
              value={lastName}
              onChange={handleOnChange}
              placeholder="Enter last name"
              className="form-style w-full bg-richblack-800 h-12 pl-4 rounded-lg text-richblack-50"
            />
          </label>
        </div>
        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Email Address <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="email"
            name="email"
            value={email}
            onChange={handleOnChange}
            placeholder="Enter email address"
            className="form-style w-full bg-richblack-800 h-12 pl-4 rounded-lg text-richblack-50"
          />
        </label>
        <label className="w-full">
          <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
            Phone Number <sup className="text-pink-200">*</sup>
          </p>
          <input
            required
            type="tel"
            name="phoneNumber"
            value={phoneNumber}
            onChange={handleOnChange}
            placeholder="Enter Phone Number"
            className="form-style w-full bg-richblack-800 h-12 pl-4 rounded-lg text-richblack-50"
          />
        </label>
        <div className="flex gap-x-4">
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Create Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleOnChange}
              placeholder="Enter Password"
              className="form-style w-full !pr-10 bg-richblack-800 h-12 pl-4 rounded-lg text-richblack-50"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
          <label className="relative">
            <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
              Confirm Password <sup className="text-pink-200">*</sup>
            </p>
            <input
              required
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleOnChange}
              placeholder="Confirm Password"
              className="form-style w-full !pr-10 bg-richblack-800 h-12 pl-4 rounded-lg text-richblack-50"
            />
            <span
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] z-[10] cursor-pointer"
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiOutlineEye fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
        </div>
        <button
          type="submit"
          className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-medium text-richblack-900"
        >
          Create Account
        </button>

        <div className="flex items-center justify-between mt-4 border-b border-richblue-100 pb-6">
          <span className="text-white">Already have an account?</span>
          <NavLink to="/login" className="text-yellow-200 hover:underline">
            Login
          </NavLink>
        </div>
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="mt-4 flex items-center justify-center rounded-lg bg-white py-2 px-4 text-gray-900 font-medium hover:bg-royalblue-600 hover:text-white transition duration-300 border"
        >
          <FcGoogle className="mr-2" size={24} />
          Sign Up with Google
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
