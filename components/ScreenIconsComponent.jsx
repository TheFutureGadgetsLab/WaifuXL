import { GitHubSVG, HamSVG } from "./SVGComponents";

const ScreenIcons = ({ setShowSidebar, showSidebar }) => {
  return (
    <>
      <HamSVG onClick={() => setShowSidebar(!showSidebar)} className="fixed left-5 top-4 cursor-pointer"/>
      <GitHubSVG className="fixed right-5 top-4" />
    </>
  );
};

export default ScreenIcons;
