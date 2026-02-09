interface ErrorProps {
  error?: string;
}

const Error: React.FC<ErrorProps> = () => {
  return (
    <>
      {/* {error && (
        <p className="bg-red-100 text-red-500 p-2 my-2 text-center border-2 border-red-500">
          <span className="font-bold">Erreur:</span> {error}
        </p>
      )} */}
    </>
  );
};

export default Error;
