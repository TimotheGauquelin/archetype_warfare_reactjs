import React from "react";

const DiscordLoginSuccesful = () => {
  // const { setAuthUser } = useContext(AuthContext);

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const token = urlParams.get("token");

  //   const decodedToken = jwtDecode(token);

  //   console.log(decodedToken);
  //   setAuthUser((prev) => ({
  //     ...prev,
  //     isAuthenticated: true,
  //     id: decodedToken.id,
  //     username: decodedToken.username,
  //     email: decodedToken.email,
  //     roles: decodedToken.roles,
  //     token: token,
  //   }));
  //   // navigate(URL_FRONT_HOME);
  // }, []);

  return (
    <div className="bg-graybackground w-screen h-screen fixed left-0 top-0 flex justify-center items-center">
      {/* <div
        className={`bg-white w-[400px] max-w-[400px] cardShadow rounded-xl flex flex-col p-6`}
      >
        <h3 className="text-2xl text-center mb-4">Connexion réussie !</h3>
        <div>
          Vous vous êtes connecté avec succès ! Vous allez retourner sur la page
          d'accueil dans moins de 5 secondes.
        </div>
      </div> */}
    </div>
  );
};

export default DiscordLoginSuccesful;
