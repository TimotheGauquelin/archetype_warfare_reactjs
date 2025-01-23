import React from "react";

const Progress = ({ label, mark }) => {
  return (
    <div className="flex flex-col lscreen:flex-row lscreen:items-center lscreen:grid lscreen:grid-cols-12 lscreen:gap-4 ">
      <label className="col-span-2 text-sm font-bold" htmlFor="">
        {label}
      </label>
      <div className="col-span-10 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-red-400 h-2.5 rounded-full dark:bg-gray-300"
          style={{ width: `${mark}0%` }}
        ></div>
      </div>
    </div>
  );
};

export default Progress;
