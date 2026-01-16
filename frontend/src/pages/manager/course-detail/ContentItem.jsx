import React, { useState } from "react";
import Proptypes from "prop-types";
import { Link, useRevalidator } from "react-router-dom";
import { useMutation } from "react-query";
import { deleteDetailContent } from "../../../services/courseService";

export default function ContentItem({
  id = "1",
  index = 1,
  type = "video",
  title = "Install VSCode di Windows",
  courseId = "2",
}) {
  const revalidator = useRevalidator();
  const [showConfirm, setShowConfirm] = useState(false);

  const { isLoading, mutateAsync } = useMutation({
    mutationFn: () => deleteDetailContent(id),
  });

  const handleDelete = async () => {
    try {
      await mutateAsync();
      setShowConfirm(false);
      revalidator.revalidate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="card flex items-center gap-5">
        <div className="relative flex shrink-0 w-[140px] h-[110px]">
          <p className="absolute -top-[10px] -left-[10px] flex w-[30px] h-[30px] rounded-full items-center justify-center bg-[#662FFF] text-white">
            <span className="font-bold text-sm leading-[21px]">{index}</span>
          </p>
          <div className="rounded-[20px] bg-[#D9D9D9] overflow-hidden">
            <img
              src={`/assets/images/thumbnails/cover-${type}.png`}
              className="w-full h-full object-cover"
              alt="thumbnail"
            />
          </div>
        </div>

        <div className="w-full">
          <h3 className="font-bold text-xl leading-[30px] line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-[6px] mt-[6px]">
              <img
                src={`/assets/images/icons/${
                  type === "text"
                    ? "note-favorite-purple.svg"
                    : "video-play-purple.svg"
                }`}
                className="w-5 h-5"
                alt="icon"
              />
              <p className="text-[#838C9D]">{type} Content</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-3">
          <Link
            to={`/manager/courses/${courseId}/edit/${id}`}
            className="w-fit rounded-full border border-[#060A23] p-[14px_20px] font-semibold text-nowrap"
          >
            Edit Content
          </Link>

          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="w-fit rounded-full p-[14px_20px] bg-[#FF435A] font-semibold text-white text-nowrap"
          >
            Delete
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-6 w-[400px]">
            <h3 className="text-lg font-bold mb-2">Delete Content</h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete <b>{title}</b>? This action cannot
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

ContentItem.propTypes = {
  id: Proptypes.string,
  index: Proptypes.number,
  type: Proptypes.string,
  title: Proptypes.string,
  courseId: Proptypes.string,
};
