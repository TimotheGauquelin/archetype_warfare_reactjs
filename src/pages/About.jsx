import React from "react";
import Header from "../components/generic/header/Header";

const About = () => {
  return (
    <div>
      <Header />
      <div className="relative imageBackground">
        <div
          className="flex flex-col justify-center text-center"
          style={{ height: "520px" }}
        >
          <p style={{ fontWeight: "700", fontSize: "72px" }}>
            Faîtes attention aux cartes interdites !
          </p>
          <p style={{ fontWeight: "500", fontSize: "18px" }}>
            {" "}
            Archetype Warfare propose une toute nouvelle banlist de cartes
            génériques, en plus de celles des archétypes
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
