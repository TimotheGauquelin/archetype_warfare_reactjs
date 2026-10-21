import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AdminStructure from "../adminLayout";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminQuizQuestionForm from "../../../components/pages/admin/quiz/AdminQuizQuestionForm";
import {
  AdminQuizQuestion,
  listAdminQuizQuestions,
} from "../../../services/quiz";
import { URL_FRONT_ADMIN_QUIZZES } from "../../../constant/urlsFront";

const AdminQuizUpdate = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const [question, setQuestion] = useState<AdminQuizQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const id = Number(questionId);
    if (!Number.isFinite(id)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    void (async () => {
      setLoading(true);
      try {
        const questions = await listAdminQuizQuestions();
        const found = questions.find((q) => q.id === id) ?? null;
        if (!found) {
          setNotFound(true);
        } else {
          setQuestion(found);
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Impossible de charger la question"
        );
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [questionId]);

  return (
    <AdminStructure>
      <AdminBodyHeader
        label={question ? `Modifier la question #${question.id}` : "Modifier une question"}
        catchphrase="Éditez l'énoncé, les réponses, l'indice et l'explication"
        returnButton
      />

      {loading && <div className="p-4">Chargement…</div>}

      {!loading && notFound && (
        <div className="space-y-2 p-4">
          <p className="text-red-600">Question introuvable.</p>
          <Link to={URL_FRONT_ADMIN_QUIZZES} className="text-blue-600 hover:underline">
            Retour à la liste
          </Link>
        </div>
      )}

      {!loading && question && (
        <AdminQuizQuestionForm
          mode="edit"
          questionId={question.id}
          initialQuestion={question}
        />
      )}
    </AdminStructure>
  );
};

export default AdminQuizUpdate;
