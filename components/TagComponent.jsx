import { useEffect } from 'react';
const TagComponent = ({ tags }) => {
  useEffect(async () => {
    console.log(tags);
  }, []);

  return (
    <>
      <div
        className="text-xl font-bold"
        style={{ textShadow: "white 0px 2px 4px" }}
      >
        Tags
      </div>
      {tags.topDesc.map(x => <div key={x}>{x}</div>)}
      <br />
      <div
        className="text-xl font-bold"
        style={{ textShadow: "white 0px 2px 4px" }}
      >
        Character
      </div>
      {tags.topChars.map(x => <div key={x}>{x}</div>)}
      <br />
      <div
        className="text-xl font-bold"
        style={{ textShadow: "white 0px 2px 4px" }}
      >
        Explicitness
      </div>
      {tags.rating.map(x => <div key={x}>{x}</div>)}
    </>
  );
};
export default TagComponent;
