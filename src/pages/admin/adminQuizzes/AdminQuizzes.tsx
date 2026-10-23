import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
import AdminQuizSeasonPagination from "../../../components/pages/admin/quiz/AdminQuizSeasonPagination";
import AdminQuizPagination from "../../../components/pages/admin/quiz/AdminQuizPagination";
import PopUp from "../../../components/generic/PopUp";
import usePopup from "../../../hooks/usePopup";
import {
  AdminQuizQuestion,
  AdminQuizSeason,
  deleteAdminQuizQuestion,
  deleteAdminQuizSeason,
  listAdminQuizQuestions,
  listAdminQuizSeasons,
  updateAdminQuizQuestion,
} from "../../../services/quiz";
import {
  URL_FRONT_ADMIN_QUIZ_ADD,
  URL_FRONT_ADMIN_QUIZ_QUESTIONS,
  URL_FRONT_ADMIN_QUIZ_SEASON_ADD,
  URL_FRONT_ADMIN_QUIZ_SEASONS,
} from "../../../constant/urlsFront";

const AdminQuizzes = () => {
  const [seasons, setSeasons] = useState<AdminQuizSeason[]>([]);
  const [questions, setQuestions] = useState<AdminQuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [seasonList, questionList] = await Promise.all([
        listAdminQuizSeasons({ preview: true }),
        listAdminQuizQuestions({ limit: 10 }),
      ]);
      setSeasons(seasonList);
      setQuestions(questionList);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de charger le dashboard Quizz"
      );
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, refresh]);

  const handleDeleteSeason = (season: AdminQuizSeason) => {
    showConfirmDialog({
      title: "Suppression de la saison",
      message: `Supprimer la saison « ${season.name} » ? Les questions liées ne seront plus rattachées à une saison.`,
      onConfirm: () => {
        void (async () => {
          try {
            await deleteAdminQuizSeason(season.id);
            toast.success("Saison supprimée");
            setRefresh(true);
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Impossible de supprimer la saison"
            );
          }
        })();
      },
    });
  };

  const handleToggleActive = async (question: AdminQuizQuestion) => {
    try {
      await updateAdminQuizQuestion(question.id, {
        is_active: !question.is_active,
      });
      toast.success(question.is_active ? "Question désactivée" : "Question activée");
      setRefresh(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Impossible de changer le statut"
      );
    }
  };

  const handleDeleteQuestion = (question: AdminQuizQuestion) => {
    showConfirmDialog({
      title: "Suppression de la question",
      message:
        "Êtes-vous sûr de vouloir supprimer cette question ? Cette action est irréversible.",
      onConfirm: () => {
        void (async () => {
          try {
            await deleteAdminQuizQuestion(question.id);
            toast.success("Question supprimée");
            setRefresh(true);
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : "Impossible de supprimer"
            );
          }
        })();
      },
    });
  };

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Quizz"
        catchphrase="Saisons Daily Quizz et dernières questions"
      />

      <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-10 space-y-3">
        <div className="flex flex-col sscreen:flex-row sscreen:items-center sscreen:justify-between gap-3">
          <h2 className="text-xl font-semibold text-gray-900">
            Gérer mes saisons de Daily Quizz
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link
              to={URL_FRONT_ADMIN_QUIZ_SEASON_ADD}
              className="h-fit block text-white px-3 py-2 bg-blue-400 rounded hover:bg-blue-500 font-bold text-sm"
            >
              Ajouter une saison
            </Link>
            <Link
              to={URL_FRONT_ADMIN_QUIZ_SEASONS}
              className="h-fit block text-blue-700 px-3 py-2 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 font-semibold text-sm"
            >
              Voir toutes les saisons
            </Link>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Saison en cours et les deux prochaines (~3 mois chacune). Une question
          daily est tirée chaque jour dans le pool de la saison.
        </p>

        <AdminQuizSeasonPagination
          seasons={seasons}
          loading={loading}
          onDelete={handleDeleteSeason}
        />
      </section>

      <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
        <div className="flex flex-col sscreen:flex-row sscreen:items-center sscreen:justify-between gap-3">
          <h2 className="text-xl font-semibold text-gray-900">
            Gérer mes questions
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link
              to={URL_FRONT_ADMIN_QUIZ_ADD}
              className="h-fit block text-white px-3 py-2 bg-blue-400 rounded hover:bg-blue-500 font-bold text-sm"
            >
              Ajouter une question
            </Link>
            <Link
              to={URL_FRONT_ADMIN_QUIZ_QUESTIONS}
              className="h-fit block text-blue-700 px-3 py-2 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 font-semibold text-sm"
            >
              Voir les questions
            </Link>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Les 10 dernières questions ajoutées
        </p>

        <AdminQuizPagination
          questions={questions}
          currentPage={1}
          setPagination={() => undefined}
          setRefresh={setRefresh}
          questionsTotalCount={questions.length}
          totalPages={1}
          pageSize={10}
          loading={loading}
          onDelete={handleDeleteQuestion}
          onToggleActive={(q) => void handleToggleActive(q)}
        />
      </section>

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
    </AdminStructure>
  );
};

export default AdminQuizzes;
