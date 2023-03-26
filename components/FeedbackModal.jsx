import { CloseSVG, ErrorSVG } from '@/components/SVGComponents'

import { useAppStateStore } from '@/services/useState'

export default function Feedback() {
  const feedbackMessage = useAppStateStore((state) => state.feedbackMessage)
  const setFeedbackMessage = useAppStateStore((state) => state.setFeedbackMessage)

  return (
    <>
      {feedbackMessage && (
        <div className="flex items-center justify-center w-screen h-screen absolute">
          <div
            className="h-full w-full z-50 bg-gray-100 opacity-75 absolute"
            tabIndex={-1}
            onKeyDown={(e) => {
              if (e.code === 'Escape') {
                setFeedbackMessage(null)
              }
            }}
            onClick={(e) => {
              if (setFeedbackMessage !== null) {
                setFeedbackMessage(null)
              }
            }}
          />
          <div className="rounded-md bg-stockblue-50 p-4 max-w-md absolute z-50 items-center pt-8">
            <div className="float-right -mt-5">
              <CloseSVG
                onClick={() => {
                  setFeedbackMessage(null)
                }}
              />
            </div>
            <div className="flex">
              <div className="flex-shrink-0 ">
                <ErrorSVG color="stockblue" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-stockblue-800">
                  An unexpected error has occurred. If the problem persists, please submit an issue{' '}
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
                <div className="mt-2 text-sm text-stockblue-700">
                  <ul role="list" className="list-disc pl-5 space-y-1">
                    <li>{feedbackMessage}</li>
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
