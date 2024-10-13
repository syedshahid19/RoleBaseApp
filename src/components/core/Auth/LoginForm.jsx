import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const BASE_URL = process.env.REACT_APP_BASE_URL;

function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { email, password } = formData;
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      const { token, accountType } = response.data.user;

      // Store token and role
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", accountType);
      localStorage.setItem("userId", response.data.user._id);

      toast.success("Logged In");

      // Redirect based on user role
      if (accountType === "Admin") {
        navigate("/admin-dashboard");
      } else if (accountType === "Vendor") {
        navigate("/vendor-dashboard");
      } else if (accountType === "User") {
        navigate("/user-dashboard");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again later.";
      toast.error(message);
      if (message.includes("User is not Registered")) {
        navigate("/signup");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleOnSubmit}
      className="mt-6 flex w-full max-w-md flex-col gap-y-4 mx-auto lg:px-0 px-2"
    >
      <h1 className="text-white text-3xl text-center">
        Welcome to dashboard login
      </h1>
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
          className="form-style w-full bg-richblack-800 h-12 pl-4 rounded-lg text-richblack-50 outline-none"
        />
      </label>
      <label className="relative">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Password <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
          className="form-style w-full !pr-10 bg-richblack-800 h-12 pl-4 rounded-lg text-richblack-50 outline-none"
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
      <button
        type="submit"
        className={`mt-6 rounded-[8px] bg-richblue-500 py-[8px] px-[12px] font-medium text-white ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>

      <div className="flex items-center justify-between mt-4">
        <span className="text-white">Don't have an account?</span>
        <NavLink
          to="/signup"
          className=" hover:text-richblue-500 hover:underline transition-all duration-300 ease-in-out  text-white"
        >
          Sign Up
        </NavLink>
      </div>
    </form>
  );
}

export default LoginForm;
