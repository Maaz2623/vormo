import React from "react";

interface PagesHeader {
  title: string;
  description: string;
  children: React.ReactNode;
}

const PagesHeader = ({ title, description, children }: PagesHeader) => {
  return (
    <div className="w-full h-24 border px-4 bg-white rounded-lg py-1 flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-neutral-700 text-base">{description}</p>
      </div>
      {children}
    </div>
  );
};

export default PagesHeader;
