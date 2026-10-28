import { useEffect, useState } from "react";
import { getAdminUserQuizSummary } from "../../../../services/user";
import type { AdminUserQuizSummary } from "../../../../types";

interface AdminUserQuizTabProps {
  userId: string;
}

const modeLabel = (mode: string) => {
  if (mode === "daily") return "Daily";
  if (mode === "free") return "Libre";
  return mode;
};

const statusLabel = (status: string) => {
  if (status === "finished") return "Terminé";
  if (status === "in_progress") return "En cours";
  return status;
};

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("fr-FR");
  } catch {
    return value;
  }
};

const AdminUserQuizTab: React.FC<AdminUserQuizTabProps> = ({ userId }) => {
  const [summary, setSummary] = useState<AdminUserQuizSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    void getAdminUserQuizSummary(userId).then((data) => {
      if (cancelled) return;
      if (!data) {
        setError("Impossible de charger les données quiz.");
        setSummary(null);
      } else {
        setSummary(data);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loading) {
    return <p className="text-sm text-gray-500 p-2">Chargement…</p>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded p-3 text-sm">
        {error}
      </div>
    );
  }

  if (!summary) {
    return (
      <p className="text-sm text-gray-500 p-2">Aucune donnée quiz.</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-100 rounded p-2.5 tablet:p-3">
        <h2 className="font-semibold text-base tablet:text-lg text-gray-900">
          Score quiz
        </h2>
        <p className="text-xl tablet:text-2xl font-bold text-blue-600 mt-1">
          {summary.quiz_points}{" "}
          <span className="text-sm font-medium text-gray-600">points</span>
        </p>
      </div>

      <div className="bg-gray-100 rounded p-2.5 tablet:p-3 space-y-2">
        <h2 className="font-semibold text-base tablet:text-lg text-gray-900">
          Dernières tentatives
        </h2>
        {summary.attempts.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune tentative enregistrée.</p>
        ) : (
          <>
            <div className="sscreen:hidden space-y-2">
              {summary.attempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="bg-white border border-gray-200 rounded p-2.5 space-y-1"
                >
                  <p className="text-xs text-gray-500">
                    {formatDate(
                      attempt.finished_at ||
                        attempt.daily_date ||
                        attempt.started_at
                    )}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-700">
                    <span>
                      <span className="font-semibold">Mode</span>{" "}
                      {modeLabel(attempt.mode)}
                    </span>
                    <span>
                      <span className="font-semibold">Thème</span>{" "}
                      {attempt.theme?.label ?? "—"}
                    </span>
                    <span>
                      <span className="font-semibold">Score</span>{" "}
                      {attempt.score}/{attempt.max_score}
                    </span>
                    <span>
                      <span className="font-semibold">Statut</span>{" "}
                      {statusLabel(attempt.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden sscreen:block overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs uppercase bg-white text-gray-700">
                  <tr>
                    <th className="p-2">Date</th>
                    <th className="p-2">Mode</th>
                    <th className="p-2">Thème</th>
                    <th className="p-2">Score</th>
                    <th className="p-2">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.attempts.map((attempt) => (
                    <tr
                      key={attempt.id}
                      className="border-b border-gray-200 bg-white hover:bg-slate-50"
                    >
                      <td className="p-2">
                        {formatDate(
                          attempt.finished_at ||
                            attempt.daily_date ||
                            attempt.started_at
                        )}
                      </td>
                      <td className="p-2">{modeLabel(attempt.mode)}</td>
                      <td className="p-2">{attempt.theme?.label ?? "—"}</td>
                      <td className="p-2">
                        {attempt.score}/{attempt.max_score}
                      </td>
                      <td className="p-2">{statusLabel(attempt.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUserQuizTab;
