import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminStructure from "../adminLayout";
import AdminQuizFilter, {
  type AdminQuizFilters,
} from "../../../components/pages/admin/quiz/AdminQuizFilter";
import AdminQuizPagination from "../../../components/pages/admin/quiz/AdminQuizPagination";
import PopUp from "../../../components/generic/PopUp";
import usePopup from "../../../hooks/usePopup";
import {
  AdminQuizQuestion,
  deleteAdminQuizQuestion,
  getQuizThemes,
  listAdminQuizQuestions,
  QuizTheme,
  updateAdminQuizQuestion,
} from "../../../services/quiz";
import { URL_FRONT_ADMIN_QUIZ_ADD } from "../../../constant/urlsFront";

const PAGE_SIZE = 30;

const defaultFilters = (): AdminQuizFilters => ({
  prompt: "",
  theme: "",
  type: "",
  difficulty: "",
  is_active: "",
  was_daily_question: "",
});

const AdminQuizQuestions = () => {
  const [themes, setThemes] = useState<QuizTheme[]>([]);
  const [questions, setQuestions] = useState<AdminQuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [filters, setFilters] = useState<AdminQuizFilters>(defaultFilters());
  const [currentPage, setCurrentPage] = useState(1);

  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [themeList, questionList] = await Promise.all([
        getQuizThemes(),
        listAdminQuizQuestions({
          theme: filters.theme || undefined,
          type: filters.type || undefined,
          difficulty: filters.difficulty || undefined,
          is_active:
            filters.is_active === "" ? undefined : filters.is_active === "true",
          was_daily_question:
            filters.was_daily_question === ""
              ? undefined
              : filters.was_daily_question === "true",
        }),
      ]);
      setThemes(themeList);
      setQuestions(questionList);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Impossible de charger les questions"
      );
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  }, [
    filters.theme,
    filters.type,
    filters.difficulty,
    filters.is_active,
    filters.was_daily_question,
  ]);

  useEffect(() => {
    void load();
  }, [load, refresh]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    filters.prompt,
    filters.theme,
    filters.type,
    filters.difficulty,
    filters.is_active,
    filters.was_daily_question,
  ]);

  const filteredQuestions = useMemo(() => {
    const needle = filters.prompt.trim().toLowerCase();
    if (!needle) return questions;
    return questions.filter((q) => q.prompt.toLowerCase().includes(needle));
  }, [questions, filters.prompt]);

  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const paginatedQuestions = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredQuestions.slice(start, start + PAGE_SIZE);
  }, [filteredQuestions, page]);

  const resetAllFilters = () => {
    setFilters(defaultFilters());
    setCurrentPage(1);
    toast.success("Vous avez mis les filtres à leur état d'origine.");
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

  const handleDelete = (question: AdminQuizQuestion) => {
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
        label="Questions Quizz"
        catchphrase="Toutes les questions — filtres, activation et édition"
        buttonUrl={URL_FRONT_ADMIN_QUIZ_ADD}
        buttonLabel="Ajouter une question"
        returnButton
      />

      <AdminQuizFilter
        themes={themes}
        criteria={filters}
        setCriteria={setFilters}
        resetAllFilters={resetAllFilters}
        setRefresh={setRefresh}
      />

      <AdminQuizPagination
        questions={paginatedQuestions}
        currentPage={page}
        setPagination={setCurrentPage}
        setRefresh={setRefresh}
        questionsTotalCount={filteredQuestions.length}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        loading={loading}
        onDelete={handleDelete}
        onToggleActive={(q) => void handleToggleActive(q)}
      />

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

export default AdminQuizQuestions;
