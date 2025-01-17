import React from "react";

interface PagesHeader {
  title: string;
}

const PagesHeader = ({ title }: PagesHeader) => {
  return (
    <div className="w-full h-10 border px-2 py-1">
      <h1>{title}</h1>
    </div>
  );
};

export default PagesHeader;
