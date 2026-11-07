import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { FaMedal, FaLock } from "react-icons/fa";
import {
  getMyMedals,
  getUserMedals,
  syncMyMedals,
  type UserMedalView,
} from "@/services/medal";
import NoItemMessage from "@/components/generic/NoItemMessage";

const categoryOrder = ["archetype", "tournament", "deck", "quiz", "loyalty"];

type MyProfileMedalsTabProps = {
  /** Sans bordure/onglet externe (carte profil). */
  embedded?: boolean;
  /** Profil public d’un autre joueur (`/users/:id`). */
  userId?: string | null;
};

const MedalIcon = ({
  medal,
  locked = false,
}: {
  medal: UserMedalView;
  locked?: boolean;
}) => {
  if (medal.iconUrl) {
    return (
      <img
        src={medal.iconUrl}
        alt=""
        className={`w-10 h-10 object-contain ${locked ? "opacity-50 grayscale" : ""}`}
      />
    );
  }
  if (locked) {
    return <FaLock className="w-7 h-7 text-gray-400" aria-hidden />;
  }
  return <FaMedal className="w-8 h-8 text-amber-500" aria-hidden />;
};

const MedalTile = ({
  medal,
  locked = false,
}: {
  medal: UserMedalView;
  locked?: boolean;
}) => {
  const { t } = useTranslation();
  const tileRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null
  );
  const earnedLabel =
    !locked && medal.earnedAt
      ? t("profile.medalsEarnedAt", {
          date: new Date(medal.earnedAt).toLocaleDateString(),
        })
      : null;

  const updateCoords = () => {
    const el = tileRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setCoords({
      top: rect.top - 6,
      left: rect.left + rect.width / 2,
    });
  };

  useEffect(() => {
    if (!open) return;
    updateCoords();
    const onReposition = () => updateCoords();
    window.addEventListener("scroll", onReposition, true);
    window.addEventListener("resize", onReposition);
    return () => {
      window.removeEventListener("scroll", onReposition, true);
      window.removeEventListener("resize", onReposition);
    };
  }, [open]);

  return (
    <div
      ref={tileRef}
      className="relative flex flex-col items-center gap-1.5 rounded border border-gray-200 bg-gray-50 p-2 text-center hover:border-amber-300 hover:bg-amber-50 transition-colors"
      onMouseEnter={() => {
        updateCoords();
        setOpen(true);
      }}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => {
        updateCoords();
        setOpen(true);
      }}
      onBlur={() => setOpen(false)}
    >
      <MedalIcon medal={medal} locked={locked} />
      <p
        className={`text-xs font-semibold leading-tight line-clamp-2 w-full ${
          locked ? "text-gray-500" : "text-gray-900"
        }`}
      >
        {medal.title}
      </p>

      {open &&
        coords &&
        createPortal(
          <div
            role="tooltip"
            className="pointer-events-none fixed z-[100] w-max max-w-[14rem] -translate-x-1/2 -translate-y-full rounded bg-gray-900 px-2.5 py-1.5 text-left shadow-lg"
            style={{ top: coords.top, left: coords.left }}
          >
            <p className="text-[11px] text-gray-100 leading-snug">
              {medal.description}
            </p>
            {earnedLabel && (
              <p className="text-[10px] text-amber-300 mt-1">{earnedLabel}</p>
            )}
            <span
              className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900"
              aria-hidden
            />
          </div>,
          document.body
        )}
    </div>
  );
};

const MyProfileMedalsTab = ({
  embedded = false,
  userId = null,
}: MyProfileMedalsTabProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [earned, setEarned] = useState<UserMedalView[]>([]);
  const [locked, setLocked] = useState<UserMedalView[]>([]);
  const isPublicProfile = Boolean(userId);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    if (userId) {
      getUserMedals(userId)
        .then((data) => {
          if (cancelled) return;
          setEarned(data.earned);
          setLocked([]);
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }

    syncMyMedals()
      .then((data) => {
        if (cancelled) return;
        setEarned(data.earned);
        setLocked(data.locked);
      })
      .catch(() => {
        if (cancelled) return;
        return getMyMedals().then((data) => {
          if (cancelled) return;
          setEarned(data.earned);
          setLocked(data.locked);
        });
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const earnedByCategory = useMemo(() => {
    const map = new Map<string, UserMedalView[]>();
    for (const medal of earned) {
      const list = map.get(medal.category) ?? [];
      list.push(medal);
      map.set(medal.category, list);
    }
    return categoryOrder
      .filter((c) => map.has(c))
      .map((c) => ({ category: c, medals: map.get(c)! }));
  }, [earned]);

  if (isLoading) {
    return (
      <div className={`${embedded ? "py-2" : "p-4"} text-sm text-gray-500`}>
        {t("common.loading")}
      </div>
    );
  }

  return (
    <div
      className={
        embedded
          ? "space-y-3"
          : "border border-gray-200 rounded-b-lg rounded-tr-lg p-4 space-y-4"
      }
    >

      {earned.length === 0 ? (
        <NoItemMessage message={t("profile.medalsEmpty")} textPosition="left" />
      ) : (
        earnedByCategory.map(({ category, medals }) => (
          <section key={category} className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-800">
              {t(`profile.medalCategory.${category}`, { defaultValue: category })}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {medals.map((medal) => (
                <MedalTile
                  key={`${medal.code}-${medal.contextId ?? ""}`}
                  medal={medal}
                />
              ))}
            </div>
          </section>
        ))
      )}

      {!isPublicProfile && locked.length > 0 && (
        <section className="space-y-2 pt-2 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800">
            {t("profile.medalsLockedTitle")}
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {locked.map((medal) => (
              <MedalTile
                key={`locked-${medal.code}`}
                medal={medal}
                locked
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MyProfileMedalsTab;
