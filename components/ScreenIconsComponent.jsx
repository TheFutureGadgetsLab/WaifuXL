import { GitHubSVG, HamSVG } from "./SVGComponents";

const ScreenIcons = ({ useAppStateStore }) => {
  const setShowSidebar = useAppStateStore((state) => state.setShowSidebar);
  return (
    <>
      <HamSVG onClick={() => setShowSidebar(false)} className="fixed left-5 top-4 cursor-pointer"/>
      <GitHubSVG className="fixed right-5 top-4" />
    </>
  );
};

export default ScreenIcons;
