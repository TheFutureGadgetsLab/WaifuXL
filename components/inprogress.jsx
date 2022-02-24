import Router from "next/router";

const InProgress = () => {
  return (
    <div className="bg-pink">
      <header>
        <nav className="">
          <div className="container mx-auto py-4 flex justify-between items-center">
            <div className="flex px-10 gap-4 text-white">
            Note: Final AI upscaler is training. Expect significant improvements.
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default InProgress;
