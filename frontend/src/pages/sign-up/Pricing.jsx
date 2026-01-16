import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useMutation } from "react-query";
import { postSignUp } from "../../services/authService";
import Proptypes from "prop-types";
import { toast } from "react-toastify";

export default function Pricing({ data }) {
  const { isLoading, mutate } = useMutation({
    mutationFn: () => postSignUp(data),
    onSuccess: (response) => {
      toast.success("Redirecting to payment");
      window.location.replace(response.data.midtrans_payment_url);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Gagal memproses pembayaran"
      );
    },
  });

  const submitData = () => {
    if (!data) {
      toast.warning("Data pendaftaran tidak ditemukan");
      return;
    }

    mutate();
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
            <div className="flex items-center gap-3 w-fit rounded-full border p-[14px_20px] bg-[#070B24] border-[#24283E]">
              <span className="font-semibold text-white">My Dashboard</span>
            </div>
          </Link>
          <Link to="/manager/sign-up">
            <div className="flex items-center gap-3 w-fit rounded-full border p-[14px_20px] bg-[#662FFF] border-[#8661EE]">
              <span className="font-semibold text-white">Sign Up</span>
            </div>
          </Link>
        </div>
      </nav>

      <header className="flex flex-col items-center gap-5 text-center mt-[50px]">
        <h1 className="font-extrabold text-[46px] leading-[69px] text-white">
          Best Pricing For Everyone
          <br />
          Who Wants to Grow Business
        </h1>
        <p className="text-lg leading-[27px] text-white">
          We delivery robust features to anyone unconditionally.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-[30px] max-w-[840px] mx-auto mt-[60px]">
        <div className="flex flex-col rounded-[20px] border border-[#262A56] p-[30px] gap-[30px] bg-[#080A2A]">
          <img
            src="/assets/images/icons/note-favorite-white.svg"
            className="w-[60px] h-[60px]"
            alt="icon"
          />
          <div>
            <p className="font-extrabold text-[46px] text-white">Rp 80.000</p>
            <p className="text-[#6B6C7F] mt-[6px]">Billed every single month</p>
          </div>
          <hr className="border-[#262A56]" />
          <div className="flex flex-col gap-5">
            <p className="font-semibold text-white">
              Access gigantic features company
            </p>
            <p className="font-semibold text-white">
              Students analytics and export
            </p>
          </div>
          <hr className="border-[#262A56]" />
          <p className="text-[#FF435A]">
            This plan is not available at this moment in your country.
          </p>
          <Link to="#">
            <div className="flex justify-center rounded-full border p-[14px_20px] bg-[#070B24] border-[#24283E]">
              <span className="font-semibold text-white">
                Contact Our Sales
              </span>
            </div>
          </Link>
        </div>

        <div className="flex flex-col rounded-[20px] border border-[#262A56] p-[30px] gap-[30px] bg-[#080A2A]">
          <img
            src="/assets/images/icons/note-favorite-white.svg"
            className="w-[60px] h-[60px]"
            alt="icon"
          />
          <div>
            <p className="font-extrabold text-[46px] text-white">Rp 280.000</p>
            <p className="text-[#6B6C7F] mt-[6px]">Billed every single month</p>
          </div>
          <hr className="border-[#262A56]" />
          <div className="flex flex-col gap-3">
            <p className="font-semibold text-white">
              Access gigantic features company
            </p>
            <p className="font-semibold text-white">
              Students analytics and export
            </p>
            <p className="font-semibold text-white">
              Life support 24/7 maintenances
            </p>
            <p className="font-semibold text-white">
              Export and analyze data real time
            </p>
            <p className="font-semibold text-white">
              More big features coming soon
            </p>
          </div>
          <hr className="border-[#262A56]" />
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={submitData}
              disabled={isLoading}
              className="flex justify-center rounded-full border p-[14px_20px] bg-[#662FFF] border-[#8661EE]"
            >
              <span className="font-semibold text-white">
                {isLoading ? "Processing..." : "Choose This Plan"}
              </span>
            </button>
            <Link to="https://api.whatsapp.com/send/?phone=6285155344998">
              <div className="flex justify-center rounded-full border p-[14px_20px] bg-[#070B24] border-[#24283E]">
                <span className="font-semibold text-white">
                  Contact Our Sales
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

Pricing.propTypes = {
  data: Proptypes.object,
};
