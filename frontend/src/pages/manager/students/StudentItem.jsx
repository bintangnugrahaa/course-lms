import React from "react";
import { Link, useRevalidator } from "react-router-dom";
import PropTypes from "prop-types";
import { useMutation } from "react-query";
import { deleteStudent } from "../../../services/studentService";
import { toast } from "react-toastify";

export default function StudentItem({
  id = "1",
  imageUrl = "/assets/images/photos/photo-3.png",
  name = "Michelle Alexandra",
  totalCourse = 0,
}) {
  const revalidator = useRevalidator();

  const { isLoading, mutate } = useMutation({
    mutationFn: () => deleteStudent(id),
    onSuccess: () => {
      toast.success("Student berhasil dihapus");
      revalidator.revalidate();
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Gagal menghapus student"
      );
    },
  });

  const handleDeleteConfirm = () => {
    toast(
      ({ closeToast }) => (
        <div>
          <p className="font-semibold mb-3">
            Yakin ingin menghapus student ini?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                mutate();
                closeToast();
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
              Yes, Delete
            </button>
            <button
              onClick={closeToast}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
  };

  return (
    <div className="card flex items-center gap-5">
      <div className="relative flex shrink-0 w-20 h-20">
        <div className="rounded-[20px] bg-[#D9D9D9] overflow-hidden">
          <img
            src={imageUrl}
            className="w-full h-full object-cover"
            alt="photo"
          />
        </div>
      </div>

      <div className="w-full">
        <h3 className="font-bold text-xl leading-[30px] line-clamp-1">
          {name}
        </h3>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-[6px] mt-[6px]">
            <img
              src="/assets/images/icons/note-favorite-purple.svg"
              className="w-5 h-5"
              alt="icon"
            />
            <p className="text-[#838C9D]">
              {totalCourse} Course Joined
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center gap-3">
        <Link
          to={`/manager/students/edit/${id}`}
          className="w-fit rounded-full border border-[#060A23] p-[14px_20px] font-semibold text-nowrap"
        >
          Edit Profile
        </Link>
        <button
          onClick={handleDeleteConfirm}
          disabled={isLoading}
          type="button"
          className="w-fit rounded-full p-[14px_20px] bg-[#FF435A] font-semibold text-white text-nowrap"
        >
          {isLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}

StudentItem.propTypes = {
  id: PropTypes.string,
  imageUrl: PropTypes.string,
  name: PropTypes.string,
  totalCourse: PropTypes.number,
};
