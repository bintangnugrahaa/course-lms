import React from "react";
import Proptypes from "prop-types";
import { toast } from "react-toastify";

export default function ContentText({ content, handleNext }) {
  const onComplete = () => {
    handleNext(content);
    toast.success("Content marked as completed");
  };

  return (
    <>
      <div className="flex flex-col gap-5 max-w-[800px] pb-[160px]">
        <h1 className="font-bold text-[32px] leading-[48px]">
          {content?.title}
        </h1>
        <article
          id="Content-wrapper"
          className="prose prose-lg max-w-full"
          dangerouslySetInnerHTML={{ __html: content?.text }}
        />
      </div>
      <div className="fixed bottom-0 w-[calc(100%-400px)] h-[151px] flex items-end justify-end pb-5 bg-[linear-gradient(0deg,#FFFFFF_49.67%,rgba(255,255,255,0)_84.11%)]">
        <button
          type="button"
          onClick={onComplete}
          className="w-fit rounded-full p-[14px_20px] font-semibold text-white bg-[#662FFF]"
        >
          Mark as Completed
        </button>
      </div>
    </>
  );
}

ContentText.propTypes = {
  content: Proptypes.object,
  handleNext: Proptypes.func,
};
