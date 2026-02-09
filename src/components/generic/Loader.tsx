const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-blue-500">Chargement...</p>
    </div>
  );
};

export default Loader;
