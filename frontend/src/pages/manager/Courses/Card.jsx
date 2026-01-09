import React, { useState } from "react";
import { Link, useRevalidator } from "react-router-dom";
import PropTypes from "prop-types";
import { useMutation } from "react-query";
import { deleteCourse } from "../../../services/courseService";

export default function CardCourse({
  id,
  imageUrl = "/assets/images/thumbnails/th-1.png",
  name,
  totalStudents = 0,
  category = "Programming",
}) {
  const revalidator = useRevalidator();
  const [showConfirm, setShowConfirm] = useState(false);

  const { isLoading, mutateAsync } = useMutation({
    mutationFn: () => deleteCourse(id),
  });

  const handleDelete = async () => {
    try {
      await mutateAsync();
      setShowConfirm(false);
      revalidator.revalidate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="card flex items-center gap-5">
        <div className="flex shrink-0 w-[140px] h-[110px] rounded-[20px] bg-[#D9D9D9] overflow-hidden">
          <img
            src={imageUrl}
            className="w-full h-full object-cover"
            alt={name}
          />
        </div>

        <div className="w-full">
          <h3 className="font-bold text-xl leading-[30px] line-clamp-1">
            {name}
          </h3>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-[6px] mt-[6px]">
              <img
                src="/assets/images/icons/profile-2user-purple.svg"
                className="w-5 h-5"
                alt="students"
              />
              <p className="text-[#838C9D]">{totalStudents} Students</p>
            </div>

            <div className="flex items-center gap-[6px] mt-[6px]">
              <img
                src="/assets/images/icons/crown-purple.svg"
                className="w-5 h-5"
                alt="category"
              />
              <p className="text-[#838C9D]">{category}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-3">
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="w-fit rounded-full bg-red-500 text-white p-[14px_20px] font-semibold"
          >
            Delete
          </button>

          <Link
            to={`/manager/courses/${id}`}
            className="w-fit rounded-full border border-[#060A23] p-[14px_20px] font-semibold"
          >
            Manage
          </Link>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-[400px]">
            <h3 className="text-lg font-bold mb-2">Delete Course</h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete <b>{name}</b>? This action cannot
              be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-full border font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="px-4 py-2 rounded-full bg-red-500 text-white font-semibold"
              >
                {isLoading ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

CardCourse.propTypes = {
  id: PropTypes.number.isRequired,
  imageUrl: PropTypes.string,
  name: PropTypes.string.isRequired,
  totalStudents: PropTypes.number,
  category: PropTypes.string,
};
