import ClipLoader from "react-spinners/ClipLoader";
const Loading = () => {

  return (
    <>
    <div className="flex justify-center w-screen h-screen items-center">
    <ClipLoader
        color={"black"}
        loading={true}
        cssOverride={""}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      </div>
    
    </>
  );
};

export default Loading;
