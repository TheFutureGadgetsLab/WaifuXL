import { ErrorSVG } from '@/components/SVGComponents'
import { useAppStateStore } from '@/services/useState'

export default function Error() {
  const errorMessage = useAppStateStore((state) => state.errorMessage)

  return (
    <>
      {errorMessage && (
        <div className="flex items-center justify-center w-screen h-screen absolute">
          <div className="h-full w-full z-50 bg-gray-100 opacity-75 absolute" />
          <div className="rounded-md bg-red-50 p-4 max-w-md absolute z-50 items-center">
            <div className="flex">
              <div className="flex-shrink-0 ">
                <ErrorSVG color="red" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  An unexpected error has occurred.<b> Please refresh the page.</b> If the problem persists, please
                  submit an issue{' '}
                  <a
                    className="text-blue underline"
                    href="https://github.com/TheFutureGadgetsLab/WaifuXL/issues"
                    target="_blank"
                    rel="noreferrer"
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
      )}
    </>
  )
}
