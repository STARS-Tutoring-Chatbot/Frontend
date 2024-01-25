import React, { useEffect } from "react";

type Chip = {
  title: string;
  data: string;
  isSelected: boolean;
};

function Chip(chip: Chip) {
  useEffect(() => {
    // Add any side effect logic here
  }, [chip.isSelected]);

  if (chip.isSelected) {
    return (
      <div className="px-4 py-1 bg-lime-300 rounded-lg justify-start items-center gap-2.5 inline-flex mx-1 my-1">
        <div className="text-gray-800 text-xs font-medium leading-tight">
          {chip.title}
        </div>
      </div>
    );
  } else {
    return (
      <div className="px-4 py-1 bg-gray-100 rounded-lg justify-start items-center gap-2.5 inline-flex mx-1 my-1">
        <div className="text-gray-500 text-xs font-medium leading-tight">
          {chip.title}
        </div>
      </div>
    );
  }
}

export default Chip;
