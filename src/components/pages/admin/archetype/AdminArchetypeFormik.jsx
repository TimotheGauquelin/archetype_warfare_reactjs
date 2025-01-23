import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api_aw from "../../../../api/api_aw";
import AdminArchetypeFormikCardData from "./AdminArchetypeFormikCardData";
import AdminArchetypeFormikData from "./AdminArchetypeFormikData";

const AdminArchetypeFormik = ({
  dataIsLoaded,
  displayInformation,
  requestPut,
  archetype,
  setArchetype,
  archetypeCards,
  orderedCardTypes,
  location,
  setDataIsLoaded,
  cardTypes,
  setCardTypes,
  setCardTypeLoad,
  setRefresh,
  setArchetypeCards,
}) => {
  const [eras, setEras] = useState([]);
  const [types, setTypes] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [summonMechanics, setSummonMechanics] = useState([]);
  const [jumbotronsOfArchetypes, setJumbotronsOfArchetypes] = useState([]);
  const [headersOfArchetypes, setHeadersOfArchetypes] = useState([]);

  const history = useNavigate();

  const getAllGenericData = () => {
    axios
      .all([
        api_aw.get(`/public/eras`),
        api_aw.get(`/public/attributes`),
        api_aw.get(`/public/types`),
        api_aw.get(`/public/summonMechanics`),
        api_aw.get(`/public/cardTypes`),
        api_aw.get(`/public/profiles`),
      ])
      .then((respArr) => {
        if (respArr[0].status === 200) {
          setEras(
            respArr[0].data.map((era) => {
              return {
                label: era.label,
                value: era.id,
              };
            })
          );
        }
        if (respArr[1].status === 200) {
          setAttributes(
            respArr[1].data.map((attribute) => {
              return {
                label: attribute.label,
              };
            })
          );
        }
        if (respArr[2].status === 200) {
          setTypes(
            respArr[2].data.map((type) => {
              return {
                label: type.label,
              };
            })
          );
        }
        if (respArr[3].status === 200) {
          setSummonMechanics(
            respArr[3].data.map((summonMechanic) => {
              return {
                label: summonMechanic.label,
              };
            })
          );
        }
        if (respArr[4].status === 200) {
          setCardTypes(
            respArr[4].data.map((cardType) => {
              return {
                label: cardType.label,
              };
            })
          );
        }
        if (respArr[5].status === 200) {
          setJumbotronsOfArchetypes(
            respArr[5].data.filter(
              (jumbotron) => jumbotron.filetype === "ARCHETYPE_JUMBOTRON"
            )
          );
          setHeadersOfArchetypes(
            respArr[5].data.filter(
              (header) => header.filetype === "ARCHETYPE_PRESENTATION"
            )
          );
        }
        location?.state?.request !== "put" && setDataIsLoaded(true);
      });
  };

  const onSubmit = (values) => {
    const archetypeSchema = {
      id: values?.id,
      name: values?.name,
      mainInfo: values?.mainInfo,
      sliderInfo: values?.sliderInfo,
      comment: values?.comment,
      highlighted: values?.highlighted,
      isActive: values?.isActive,
      headerImg: values?.headerImg,
      jumbotronImg: values?.jumbotronImg,
      popularityPoll: values?.popularityPoll,
      era: values?.era,
      inGameDate: values?.inGameDate,
      types: values?.types,
      attributes: values?.attributes,
      summonMechanics: values?.summonMechanics,
      cards: values.cards,
      performances: values.performances,
    };

    requestPut
      ? api_aw.put(`/public/archetypes`, archetypeSchema).then((response) => {
          if (response.status === 201) {
            history(-1);
          }
        })
      : api_aw.post(`/public/archetypes`, archetypeSchema).then((response) => {
          if (response.status === 201) {
            history(-1);
          }
        });
  };

  useEffect(() => {
    getAllGenericData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {" "}
      {dataIsLoaded && displayInformation === "mainInfo" && (
        <Formik
          initialValues={{
            id: requestPut ? archetype.id : null,
            name: requestPut ? archetype.name : "",
            mainInfo: requestPut ? archetype.mainInfo : "",
            sliderInfo: requestPut ? archetype.sliderInfo : "",
            comment: requestPut ? archetype.comment : null,
            inGameDate: requestPut ? archetype.inGameDate : "",
            highlighted: requestPut ? archetype.highlighted : false,
            isActive: requestPut ? archetype.isActive : false,
            popularityPoll: requestPut ? archetype.popularityPoll : 0,
            headerImg: requestPut ? archetype.headerImg : null,
            jumbotronImg: requestPut ? archetype.jumbotronImg : null,
            era: requestPut ? archetype.era : "",
            types: requestPut ? archetype.types : [],
            attributes: requestPut ? archetype.attributes : [],
            summonMechanics: requestPut ? archetype.summonMechanics : [],
            cards: requestPut ? archetype.cards : [],
            performances: requestPut ? archetype.performances : [],
          }}
          onSubmit={(values) => onSubmit(values)}
        >
          <Form id="form" className="">
            <AdminArchetypeFormikData
              eras={eras}
              attributes={attributes}
              types={types}
              summonMechanics={summonMechanics}
              jumbotronsOfArchetypes={jumbotronsOfArchetypes}
              headersOfArchetypes={headersOfArchetypes}
              requestPut={requestPut}
            />

            <AdminArchetypeFormikCardData
              archetypeCards={archetypeCards}
              orderedCardTypes={orderedCardTypes}
              archetype={archetype}
              setArchetype={setArchetype}
              cardTypes={cardTypes}
              setCardTypeLoad={setCardTypeLoad}
              setRefresh={setRefresh}
              setArchetypeCards={setArchetypeCards}
            />

            <button
              id="form"
              type="submit"
              className="bg-gray-800 hover:bg-gray-900 text-white mt-2 p-2 px-4 rounded"
            >{`${
              location?.state?.request === "put" ? `Modifier` : "Créer"
            } la banlist`}</button>
          </Form>
        </Formik>
      )}
    </>
  );
};

export default AdminArchetypeFormik;
