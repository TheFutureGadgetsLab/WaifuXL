import { createRef, useState } from "react";

function Tooltip({ children, tooltipText, isHidden }) {
  const tipRef = createRef(null);
  return (
    <div
      className="relative flex items-center"
    >
      <div
        className={`${isHidden ? "opacity-0" : "opacity-100"} absolute z-40 ${tooltipText.length < 12 ? "whitespace-nowrap" : "whitespace-normal"} bg-gradient-to-r from-gray-300 to-blue text-white px-4 py-2 rounded flex border-2 border-gray-300 items-center transition-all duration-150`}
        style={{ left: "100%" }}
        ref={tipRef}
      >
        <div
          className="bg-gray-300 border-gray-300 bg-blend-exclusion border-2 h-3 w-3 absolute"
          style={{ left: "-6px", transform: "rotate(45deg)" }}
        />
        {tooltipText}
      </div>
      {children}
    </div>
  );
}
export default Tooltip;
