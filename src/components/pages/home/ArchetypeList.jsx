import React from "react";
import { Link } from "react-router-dom";
import api_aw from "../../../api/api_aw";
import ArchetypeCard from "../../generic/ArchetypeCard";
import ErrorText from "../../generic/ErrorText";
import SubtitleDivider from "../../generic/SubtitleDivider";

const ArchetypeList = ({
  dataArray,
  errorText,
  errorTextCenter,
  subTitleDividerText,
  haveMedal,
}) => {
  // const increasePopularityPoll = (archetypeId) => {
  //   api_aw.put(`/archetypes/${archetypeId}/increaseArchetypePopularity`);
  // };

  return (
    <div className="w-full m-auto mb-5">
      {subTitleDividerText && (
          <SubtitleDivider displayDivider label={subTitleDividerText} />
      )}
      <div className="grid pb-5 grid-cols-12 gap-4 ">
        {dataArray?.length > 0 ? (
          dataArray?.map((archetype, index) => {
            return (
              <Link
                to={`/archetype/${archetype?.id}`}
                state={{ id: archetype?.id }}
                key={index}
                className={`col-span-6 sscreen:col-span-4 lscreen:col-span-3 bg-white p-3 rounded-lg aspect-square cardShadow`}
                // onClick={() => increasePopularityPoll(archetype?.id)}
              >
                <ArchetypeCard
                  archetype={archetype}
                  index={index}
                  haveAMedal={haveMedal}
                />
              </Link>
            );
          })
        ) : (
          <ErrorText errorText={errorText} errorTextCenter={errorTextCenter} />
        )}
      </div>
    </div>
  );
};

export default ArchetypeList;
