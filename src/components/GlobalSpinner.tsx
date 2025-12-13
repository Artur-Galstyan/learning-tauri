function GlobalSpinner() {
  return (
    <div className="absolute top-0 left-0 z-50 w-full h-full bg-white">
      <div className="relative top-[50%] left-[50%]">
        <span className="loading loading-spinner loading-xl"></span>
      </div>
    </div>
  );
}

export default GlobalSpinner;
