import { useEffect, useMemo, useState } from "react";
import Button from "../../../../components/generic/buttons/classicButton/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import usePopup from "../../../../hooks/usePopup";
import PopUp from "../../../../components/generic/PopUp";
import { deleteUser, getUserById } from "../../../../services/user";
import { getMyTournaments } from "@/services/tournament";
import type { RootState, Tournament, User } from "../../../../types";
import UserProfilLayout from "../../layout";
import { updateUser } from "@/redux/slice/userSlice";
import MyProfileRankingTab from "@/components/pages/user/profile/MyProfileRankingTab";
import MyProfileMedalsTab from "@/components/pages/user/profile/MyProfileMedalsTab";
import ProfileSection from "@/components/pages/userProfil/ProfileSection";
import TournamentDeckRequiredReminder from "@/components/pages/userProfil/TournamentDeckRequiredReminder";
import TournamentPenaltyReminder from "@/components/pages/userProfil/TournamentPenaltyReminder";
import { tournamentsNeedingDeckSelection } from "@/utils/tournament/tournamentsNeedingDeck";
import { tournamentsWithPlayerPenalties } from "@/utils/tournament/tournamentsWithPenalties";

const MyProfile = () => {
  const { t } = useTranslation();
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id, biography, token } = useSelector((state: RootState) => state.user);
  const [profileBio, setProfileBio] = useState(biography || "");
  const [myTournaments, setMyTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    if (!id) return;
    getUserById(id, (userData) => {
      const user = userData as User;
      setProfileBio(user.biography || "");
      dispatch(
        updateUser({
          biography: user.biography ?? null,
          country: user.country ?? null,
          loved_archetype_id: user.loved_archetype_id ?? null,
          loved_archetype: user.loved_archetype ?? null,
          quiz_points: user.quiz_points ?? 0,
        })
      );
    });
  }, [id, dispatch]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    getMyTournaments(token)
      .then((list) => {
        if (!cancelled) setMyTournaments(list);
      })
      .catch(() => {
        if (!cancelled) setMyTournaments([]);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const deckReminders = useMemo(
    () => tournamentsNeedingDeckSelection(myTournaments, id),
    [myTournaments, id]
  );

  const penaltyReminders = useMemo(
    () => tournamentsWithPlayerPenalties(myTournaments, id),
    [myTournaments, id]
  );

  const handleDeleteUser = () => {
    if (!id) return;
    showConfirmDialog({
      title: t("profile.deleteAccountTitle"),
      message: t("profile.deleteAccountConfirm"),
      onConfirm: () => {
        deleteUser(id, dispatch, navigate);
      },
    });
  };

  return (
    <UserProfilLayout>
      <div className="grid grid-cols-1 lscreen:grid-cols-12 gap-3">
        <div className="lscreen:col-span-8 space-y-3">
          {(deckReminders.length > 0 || penaltyReminders.length > 0) && (
            <div className="space-y-2">
              {deckReminders.map((tournament) => (
                <TournamentDeckRequiredReminder
                  key={`deck-${tournament.id}`}
                  tournamentId={tournament.id}
                  tournamentName={tournament.name}
                />
              ))}
              {penaltyReminders.map(
                ({ tournament, penaltiesCount, lateDeck }) => (
                  <TournamentPenaltyReminder
                    key={`penalty-${tournament.id}`}
                    tournamentId={tournament.id}
                    tournamentName={tournament.name}
                    penaltiesCount={penaltiesCount}
                    lateDeck={lateDeck}
                  />
                )
              )}
            </div>
          )}

          <ProfileSection title={t("profile.presentationTitle")} collapsible>
            <p className="text-sm text-slate-800 whitespace-pre-wrap min-h-[3rem]">
              {profileBio || t("profile.noBiography")}
            </p>
          </ProfileSection>

          <ProfileSection title={t("profile.tabRanking")} collapsible>
            <MyProfileRankingTab embedded />
          </ProfileSection>
        </div>

        <aside className="lscreen:col-span-4 space-y-3">
          <ProfileSection title={t("profile.tabMedals")} collapsible>
            <MyProfileMedalsTab embedded />
          </ProfileSection>

          <ProfileSection title={t("profile.dangerZone")}>
            <p className="text-sm text-slate-700 mb-3">
              {t("profile.dangerZoneDesc")}
            </p>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded font-semibold text-sm shadow-sm"
              buttonText={t("profile.deleteAccount")}
              action={handleDeleteUser}
            />
          </ProfileSection>
        </aside>
      </div>

      <PopUp
        isOpen={isOpen}
        onClose={closePopup}
        title={popupConfig.title}
        className={popupConfig.className}
        showCloseButton={popupConfig.showCloseButton}
        closeOnBackdropClick={popupConfig.closeOnBackdropClick}
      >
        {popupConfig.content}
      </PopUp>
    </UserProfilLayout>
  );
};

export default MyProfile;
