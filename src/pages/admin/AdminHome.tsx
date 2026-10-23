import { useState, useEffect } from "react";
import AdminBodyHeader from "../../components/pages/admin/AdminBodyHeader";

import AdminStructure from "./adminLayout";
import api_aw from "../../api/api_aw";
import { URL_BACK_GET_NEW_USERS } from "../../constant/urlsBack";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "../../redux/store";
import type { User } from "../../types";
import {
  listAdminQuizQuestions,
  listAdminQuizSeasons,
  type AdminQuizSeason,
} from "../../services/quiz";
import { getAdminQuizSeasonUpdatePath } from "../../constant/urlsFront";

const LOOKAHEAD_DAYS = 7;

const formatLocalIso = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const todayIso = (): string => formatLocalIso(new Date());

const addDaysIso = (iso: string, days: number): string => {
  const date = new Date(`${iso}T12:00:00`);
  date.setDate(date.getDate() + days);
  return formatLocalIso(date);
};

const formatDateFr = (iso: string): string => {
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  } catch {
    return iso;
  }
};

/** Jours de la saison dans les 7 prochains jours (incl. aujourd'hui) sans question planifiée. */
const getUnscheduledDaysAhead = (
  season: AdminQuizSeason,
  scheduledDates: Set<string>,
  today: string
): string[] => {
  const windowEnd = addDaysIso(today, LOOKAHEAD_DAYS - 1);
  const from =
    season.startDate > today ? season.startDate : today;
  const to =
    season.endDate < windowEnd ? season.endDate : windowEnd;
  if (from > to) return [];

  const missing: string[] = [];
  let cursor = from;
  while (cursor <= to) {
    if (!scheduledDates.has(cursor)) {
      missing.push(cursor);
    }
    cursor = addDaysIso(cursor, 1);
  }
  return missing;
};

type QuizScheduleAlert = {
  season: AdminQuizSeason;
  missingDates: string[];
};

const AdminHome = () => {
  const [newUsers, setNewUsers] = useState<User[]>([]);
  const [quizScheduleAlert, setQuizScheduleAlert] =
    useState<QuizScheduleAlert | null>(null);
  const { username } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    api_aw.get(URL_BACK_GET_NEW_USERS)
      .then((response) => {
        setNewUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const seasons = await listAdminQuizSeasons();
        const current = seasons.find((s) => s.status === "current");
        if (!current) {
          setQuizScheduleAlert(null);
          return;
        }

        const pool = await listAdminQuizQuestions({
          season_id: current.id,
        });
        const scheduledDates = new Set(
          pool
            .map((q) =>
              q.scheduled_date
                ? String(q.scheduled_date).slice(0, 10)
                : null
            )
            .filter((d): d is string => Boolean(d))
        );

        const missingDates = getUnscheduledDaysAhead(
          current,
          scheduledDates,
          todayIso()
        );
        setQuizScheduleAlert(
          missingDates.length > 0
            ? { season: current, missingDates }
            : null
        );
      } catch (error) {
        console.log(error);
        setQuizScheduleAlert(null);
      }
    })();
  }, []);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Tableau de Bord"
        catchphrase={`Bonjour ${username}, comment allez-vous aujourd'hui ?`}
      />
      <h2 className="text-2xl font-semibold mb-2">Alertes:</h2>
      <div className="space-y-3">
        {newUsers.length > 0 && (
          <div className="flex flex-col bg-red-100 p-2 rounded-lg">
            <p className="font-semibold mb-2">
              <span>Nouveaux utilisateurs à valider</span>
              <span className=" text-red-500"> ({newUsers.length})</span>
            </p>
            <div className="rounded-lg">
              <ul>
                {newUsers.slice(0, 3).map((user) => (
                  <li
                    key={user.id}
                    className="cursor-pointer bg-white rounded-sm"
                  >
                    <Link
                      className="block p-2 rounded-sm"
                      to={`/admin/users/update/${user.id}`}
                    >
                      {user.username}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {quizScheduleAlert && (
          <div className="flex flex-col bg-amber-100 border border-amber-300 p-2 rounded-lg">
            <p className="font-semibold mb-2">
              <span>Daily Quizz — jours sans question planifiée</span>
              <span className="text-amber-700">
                {" "}
                ({quizScheduleAlert.missingDates.length} dans les{" "}
                {LOOKAHEAD_DAYS} prochains jours)
              </span>
            </p>
            <p className="text-sm text-amber-900 mb-2">
              Saison « {quizScheduleAlert.season.name} » : planifiez une
              question au moins 7 jours avant chaque jour du défi.
            </p>
            <ul className="rounded-lg space-y-1 mb-2">
              {quizScheduleAlert.missingDates.slice(0, 5).map((date) => (
                <li key={date} className="bg-white rounded-sm">
                  <Link
                    className="block p-2 text-sm"
                    to={getAdminQuizSeasonUpdatePath(
                      quizScheduleAlert.season.id
                    )}
                  >
                    {formatDateFr(date)}
                  </Link>
                </li>
              ))}
              {quizScheduleAlert.missingDates.length > 5 && (
                <li className="text-sm text-amber-800 px-2 py-1">
                  +{quizScheduleAlert.missingDates.length - 5} autre(s) jour(s)
                </li>
              )}
            </ul>
            <Link
              to={getAdminQuizSeasonUpdatePath(quizScheduleAlert.season.id)}
              className="text-sm font-semibold text-amber-900 underline hover:no-underline w-fit"
            >
              Ouvrir le pool de la saison
            </Link>
          </div>
        )}

        {newUsers.length === 0 && !quizScheduleAlert && (
          <p className="text-sm text-gray-500">Aucune alerte pour le moment.</p>
        )}
      </div>
    </AdminStructure>
  );
};

export default AdminHome;
