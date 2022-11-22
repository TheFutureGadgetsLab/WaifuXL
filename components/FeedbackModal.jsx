import { ErrorSVG } from '@/components/SVGComponents'
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
              if(setFeedbackMessage !== null) {
                setFeedbackMessage(null)
              }
            }}
          />
          <div className="rounded-md bg-stockblue-50 p-4 max-w-md absolute z-50 items-center pt-8">
            <span
              className="float-right h-4 w-4 -mt-5 hover:cursor-pointer"
              onClick={() => {
                setFeedbackMessage(null)
              }}
            >
              <svg viewBox="0 0 512 512">
                <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z" />
              </svg>
            </span>
            <div className="flex">
              <div className="flex-shrink-0 ">
                <ErrorSVG color="stockblue" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-stockblue-800">
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
