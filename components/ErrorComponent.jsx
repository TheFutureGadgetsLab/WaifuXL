export default function Error({ errorMessage }) {
  return (
    <div className="flex items-center justify-center w-screen h-screen absolute">
      <div className="h-full w-full z-50 bg-gray-100 opacity-75 absolute" />
      <div className="rounded-md bg-red-50 p-4 max-w-md absolute z-50 items-center">
        <div className="flex">
          <div className="flex-shrink-0 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="48"
              width="48"
              className="stroke-red-800"
            >
              <path d="M22.65 26.35H25.65V13.7H22.65ZM24 34Q24.7 34 25.175 33.525Q25.65 33.05 25.65 32.35Q25.65 31.65 25.175 31.175Q24.7 30.7 24 30.7Q23.3 30.7 22.825 31.175Q22.35 31.65 22.35 32.35Q22.35 33.05 22.825 33.525Q23.3 34 24 34ZM24 44Q19.75 44 16.1 42.475Q12.45 40.95 9.75 38.25Q7.05 35.55 5.525 31.9Q4 28.25 4 24Q4 19.8 5.525 16.15Q7.05 12.5 9.75 9.8Q12.45 7.1 16.1 5.55Q19.75 4 24 4Q28.2 4 31.85 5.55Q35.5 7.1 38.2 9.8Q40.9 12.5 42.45 16.15Q44 19.8 44 24Q44 28.25 42.45 31.9Q40.9 35.55 38.2 38.25Q35.5 40.95 31.85 42.475Q28.2 44 24 44ZM24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24Q24 24 24 24ZM24 41Q31 41 36 36Q41 31 41 24Q41 17 36 12Q31 7 24 7Q17 7 12 12Q7 17 7 24Q7 31 12 36Q17 41 24 41Z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              An unexpected error has occurred.<b> Please refresh the page.</b>{" "}
              If the problem persists, please submit an issue{" "}
              <a
                className="text-blue underline"
                href="https://github.com/TheFutureGadgetsLab/WaifuXL/issues"
              >
                here
              </a>
              .
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <ul role="list" className="list-disc pl-5 space-y-1">
                <li>{errorMessage}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
