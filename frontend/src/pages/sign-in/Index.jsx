import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "../../utils/zodSchema.js";
import { useMutation } from "react-query";
import { postSignIn } from "../../services/authService.js";
import secureLocalStorage from "react-secure-storage";
import { STORAGE_KEY } from "../../utils/const.js";
import { toast } from "react-toastify";

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const navigate = useNavigate();

  const { isLoading, mutate } = useMutation({
    mutationFn: (data) => postSignIn(data),
    onSuccess: (response) => {
      secureLocalStorage.setItem(STORAGE_KEY, response.data);

      toast.success("Login berhasil");

      if (response.data.role === "manager") {
        navigate("/manager");
      } else {
        navigate("/student");
      }
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Email atau password salah"
      );
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div className="relative flex flex-col flex-1 p-[10px]">
      <div className="absolute w-[calc(100%-20px)] min-h-[calc(100vh-20px)] h-[calc(100%-20px)] bg-[#060A23] -z-10 rounded-[20px]">
        <img
          src="/assets/images/backgrounds/background-glow.png"
          className="absolute bottom-0 transform -translate-x-1/2 left-1/2"
          alt=""
        />
      </div>

      <nav className="flex items-center justify-between p-[30px]">
        <Navbar />
        <div className="flex items-center gap-3">
          <Link to="/manager/sign-in">
            <div className="flex items-center gap-3 w-fit rounded-full border p-[14px_20px] transition-all duration-300 hover:bg-[#662FFF] hover:border-[#8661EE] bg-[#070B24] border-[#24283E]">
              <span className="font-semibold text-white">My Dashboard</span>
            </div>
          </Link>
          <Link to="/manager/sign-up">
            <div className="flex items-center gap-3 w-fit rounded-full border p-[14px_20px] transition-all duration-300 hover:bg-[#662FFF] hover:border-[#8661EE] bg-[#662FFF] border-[#8661EE]">
              <span className="font-semibold text-white">Sign Up</span>
            </div>
          </Link>
        </div>
      </nav>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[400px] h-fit rounded-[20px] border border-[#262A56] p-[30px] gap-[30px] bg-[#080A2A] m-auto"
      >
        <div>
          <h1 className="font-bold text-[26px] leading-[39px] text-white">
            Welcome Back!
          </h1>
          <p className="text-[#6B6C7F]">Manage your employees easily</p>
        </div>

        <hr className="border-[#262A56]" />

        <div>
          <div className="flex items-center gap-3 w-full rounded-full border p-[14px_20px] bg-[#070B24] border-[#24283E]">
            <img
              src="/assets/images/icons/sms-white.svg"
              className="w-6 h-6"
              alt="icon"
            />
            <input
              type="email"
              className="appearance-none outline-none !bg-transparent w-full font-semibold text-white placeholder:text-[#6B6C7F]"
              placeholder="Write your email address"
              {...register("email")}
            />
          </div>
          {errors.email?.message && (
            <p className="text-red-500 text-xs mt-2">{errors.email?.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 w-full rounded-full border p-[14px_20px] bg-[#070B24] border-[#24283E]">
            <img
              src="/assets/images/icons/key-white.svg"
              className="w-6 h-6"
              alt="icon"
            />
            <input
              type="password"
              className="appearance-none outline-none !bg-transparent w-full font-semibold text-white placeholder:text-[#6B6C7F]"
              placeholder="Type your secure password"
              {...register("password")}
            />
          </div>
          <div className="flex justify-end mt-[10px]">
            <Link to="#" className="text-sm text-[#662FFF] hover:underline">
              Forgot Password
            </Link>
          </div>
          {errors.password?.message && (
            <p className="text-red-500 text-xs mt-2">
              {errors.password?.message}
            </p>
          )}
        </div>

        <hr className="border-[#262A56]" />

        <button
          disabled={isLoading}
          type="submit"
          className="w-full rounded-full border p-[14px_20px] font-semibold text-white bg-[#662FFF] border-[#8661EE]"
        >
          {isLoading ? "Signing In..." : "Sign In to Manage"}
        </button>
      </form>
    </div>
  );
}
