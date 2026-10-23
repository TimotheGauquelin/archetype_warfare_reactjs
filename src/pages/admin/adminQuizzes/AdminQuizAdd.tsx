import AdminStructure from "../adminLayout";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminQuizQuestionForm from "../../../components/pages/admin/quiz/AdminQuizQuestionForm";

const AdminQuizAdd = () => {
  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Ajouter une question"
        catchphrase="Créez une question et ajoutez-la à un quizz"
        returnButton
      />
      <AdminQuizQuestionForm mode="create" />
    </AdminStructure>
  );
};

export default AdminQuizAdd;
