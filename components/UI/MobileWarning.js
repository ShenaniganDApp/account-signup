// Show a user a warning modal that mobile devices are not supported

export const MobileWarning = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1>❌</h1>
      <h1>Mobile devices are not supported</h1>
      <p>Please use a desktop or laptop computer to view this site.</p>
    </div>
  );
};
