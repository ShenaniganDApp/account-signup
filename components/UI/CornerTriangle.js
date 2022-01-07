const CornerTriangle = ({ origin, corner }) => (
  <div className={`${corner} w-52  overflow-hidden inline-block absolute`}>
    <div className={`h-80  bg-she-pink rotate-45 transform ${origin}`}></div>
  </div>
);

export default CornerTriangle;
