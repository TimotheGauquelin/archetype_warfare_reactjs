import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import usePersistedListPage from "../../../hooks/usePersistedListPage";

const PAGE_SIZE = 30;

const defaultFilters = (): AdminQuizFilters => ({
  prompt: "",
  theme: "",
  type: "",
  difficulty: "",
  is_active: "",
  for_daily: "",
  was_daily_question: "",
});

const AdminQuizQuestions = () => {
  const [themes, setThemes] = useState<QuizTheme[]>([]);
  const [questions, setQuestions] = useState<AdminQuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [filters, setFilters] = useState<AdminQuizFilters>(defaultFilters());
  const [currentPage, setCurrentPage] = usePersistedListPage(
    "admin-quiz-questions"
  );
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [openGeneralActionsSignal, setOpenGeneralActionsSignal] = useState(0);

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
          for_daily:
            filters.for_daily === ""
              ? undefined
              : filters.for_daily === "true",
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
    filters.for_daily,
    filters.was_daily_question,
  ]);

  useEffect(() => {
    void load();
  }, [load, refresh]);

  const skipFilterPageReset = useRef(true);
  useEffect(() => {
    if (skipFilterPageReset.current) {
      skipFilterPageReset.current = false;
      return;
    }
    setCurrentPage(1);
  }, [
    filters.prompt,
    filters.theme,
    filters.type,
    filters.difficulty,
    filters.is_active,
    filters.for_daily,
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

  const pageIds = useMemo(
    () => paginatedQuestions.map((q) => q.id),
    [paginatedQuestions]
  );

  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id));

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const handleToggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setOpenGeneralActionsSignal((n) => n + 1);
  }, []);

  const handleToggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const everySelected =
        pageIds.length > 0 && pageIds.every((id) => next.has(id));
      if (everySelected) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
    setOpenGeneralActionsSignal((n) => n + 1);
  }, [pageIds]);

  // Nettoie la sélection si des IDs ne sont plus dans la liste filtrée
  useEffect(() => {
    const valid = new Set(filteredQuestions.map((q) => q.id));
    setSelectedIds((prev) => {
      let changed = false;
      const next = new Set<number>();
      prev.forEach((id) => {
        if (valid.has(id)) next.add(id);
        else changed = true;
      });
      return changed ? next : prev;
    });
  }, [filteredQuestions]);

  const resetAllFilters = () => {
    setFilters(defaultFilters());
    setCurrentPage(1);
    clearSelection();
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

      <section className="bg-white border border-gray-200 rounded-lg p-2.5 tablet:p-4 shadow-sm mb-6 tablet:mb-10 space-y-3 overflow-hidden">
        <AdminQuizFilter
          themes={themes}
          criteria={filters}
          setCriteria={setFilters}
          resetAllFilters={resetAllFilters}
          setRefresh={setRefresh}
          selectedIds={[...selectedIds]}
          onClearSelection={clearSelection}
          openGeneralActionsSignal={openGeneralActionsSignal}
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
          selectedIds={selectedIds}
          allPageSelected={allPageSelected}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onDelete={handleDelete}
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

export default AdminQuizQuestions;
