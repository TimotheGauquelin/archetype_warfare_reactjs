import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import UserBasicLayout from "../layout";
import CountryFlagLabel from "@/components/generic/CountryFlagLabel";
import Loader from "@/components/generic/Loader";
import ProfileSection from "@/components/pages/userProfil/ProfileSection";
import MyProfileRankingTab from "@/components/pages/user/profile/MyProfileRankingTab";
import MyProfileMedalsTab from "@/components/pages/user/profile/MyProfileMedalsTab";
import { getPublicUserProfile } from "@/services/user";
import {
  getArchetypePublicPath,
  URL_FRONT_HOME,
  URL_FRONT_MY_PROFILE,
} from "@/constant/urlsFront";
import type { RootState, User } from "@/types";
import { optimizeImageUrl } from "@/utils/image/optimizeImageUrl";

const PublicUserProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const currentUserId = useSelector((state: RootState) => state.user.id);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userId) return;
    if (String(userId) === String(currentUserId)) {
      navigate(URL_FRONT_MY_PROFILE, { replace: true });
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(false);
    setUser(null);
    getPublicUserProfile(userId)
      .then((data) => {
        if (!cancelled) setUser(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, currentUserId, navigate]);

  const memberSinceLabel = useMemo(() => {
    if (!user?.created_at) return null;
    try {
      return new Date(user.created_at).toLocaleDateString(i18n.language, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return null;
    }
  }, [user?.created_at, i18n.language]);

  const favoriteArchetype = user?.loved_archetype ?? null;
  const favoriteArchetypePath = favoriteArchetype
    ? getArchetypePublicPath(favoriteArchetype)
    : null;

  const initials = (user?.username || "?").trim().slice(0, 1).toUpperCase();

  return (
    <UserBasicLayout
      mainTitle={user?.username ?? t("profile.publicTitle")}
      subTitle={t("profile.publicSubtitle")}
      showHero={false}
    >
      <div className="bg-slate-100 h-full min-h-0 overflow-y-auto p-2 tablet:p-3 space-y-3">
        {loading && (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        )}
        {!loading && (error || !user) && (
          <div className="space-y-3 text-center">
            <p className="text-red-600">{t("profile.publicNotFound")}</p>
            <Link to={URL_FRONT_HOME} className="text-blue-700 hover:underline">
              {t("profile.publicBackHome")}
            </Link>
          </div>
        )}
        {!loading && user && userId && (
          <div className="space-y-3">
            <header className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="relative h-24 tablet:h-32 bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#94a3b8,transparent_45%),radial-gradient(circle_at_80%_0%,#60a5fa,transparent_40%)]" />
                <div className="absolute -bottom-8 left-4 tablet:left-6 flex items-end gap-3">
                  <div className="w-16 h-16 tablet:w-20 tablet:h-20 rounded-full border-4 border-white bg-slate-200 text-slate-700 flex items-center justify-center text-2xl tablet:text-3xl font-bold shadow-md shrink-0 overflow-hidden">
                    {user.profile_picture_url ? (
                      <img
                        src={optimizeImageUrl(user.profile_picture_url, "thumb")}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-10 pb-4 px-4 tablet:px-6 space-y-2">
                <h2 className="text-xl tablet:text-2xl font-bold text-gray-900 truncate">
                  {user.username}
                </h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-700">
                  <CountryFlagLabel countryCode={user.country} />
                  {memberSinceLabel && (
                    <span className="text-gray-500">
                      {t("profile.memberSince", { date: memberSinceLabel })}
                    </span>
                  )}
                </div>
                {favoriteArchetype && (
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">
                      {t("profile.favoriteArchetypeShort")}
                      {": "}
                    </span>
                    {favoriteArchetypePath ? (
                      <Link
                        to={favoriteArchetypePath}
                        className="text-blue-700 hover:underline font-medium"
                      >
                        {favoriteArchetype.name}
                      </Link>
                    ) : (
                      favoriteArchetype.name
                    )}
                  </p>
                )}
              </div>
            </header>

            <div className="grid grid-cols-1 lscreen:grid-cols-12 gap-3">
              <div className="lscreen:col-span-8 space-y-3">
                <ProfileSection title={t("profile.presentationTitle")} collapsible>
                  <p className="text-sm text-slate-800 whitespace-pre-wrap min-h-[3rem]">
                    {user.biography?.trim()
                      ? user.biography
                      : t("profile.noBiography")}
                  </p>
                </ProfileSection>

                <ProfileSection
                  title={t("profile.tabRankingPublic")}
                  collapsible
                >
                  <MyProfileRankingTab embedded userId={userId} />
                </ProfileSection>
              </div>

              <aside className="lscreen:col-span-4 space-y-3">
                <ProfileSection
                  title={t("profile.tabMedalsPublic")}
                  collapsible
                >
                  <MyProfileMedalsTab embedded userId={userId} />
                </ProfileSection>
              </aside>
            </div>
          </div>
        )}
      </div>
    </UserBasicLayout>
  );
};

export default PublicUserProfilePage;
