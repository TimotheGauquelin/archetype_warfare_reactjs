import { useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AdminStructure from "../adminLayout";
import AdminBodyHeader from "../../../components/pages/admin/AdminBodyHeader";
import AdminUserUpdateForm from "../../../components/pages/admin/users/AdminUserUpdateForm";
import AdminUserDecksTab from "../../../components/pages/admin/users/AdminUserDecksTab";
import AdminUserTournamentsTab from "../../../components/pages/admin/users/AdminUserTournamentsTab";
import AdminUserQuizTab from "../../../components/pages/admin/users/AdminUserQuizTab";

type UserUpdateTab = "general" | "decks" | "tournaments" | "quiz";

const TAB_CLASS = (active: boolean) =>
  `flex-1 min-w-[calc(50%-0.25rem)] tablet:min-w-0 tablet:flex-none text-center py-2 px-2 tablet:px-4 rounded-t-md cursor-pointer text-sm tablet:text-base ${
    active
      ? "text-blue-700 bg-blue-200 hover:bg-blue-300"
      : "text-gray-700 bg-gray-200 hover:bg-gray-300"
  }`;

const AdminUserUpdate = () => {
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState<UserUpdateTab>("general");

  return (
    <AdminStructure>
      <AdminBodyHeader
        label="Modifier un utilisateur"
        catchphrase="Compte, profil, decks, tournois et quiz"
        returnButton
      />
      <div>
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            className={TAB_CLASS(activeTab === "general")}
            onClick={() => setActiveTab("general")}
          >
            Infos
          </button>
          <button
            type="button"
            className={TAB_CLASS(activeTab === "decks")}
            onClick={() => setActiveTab("decks")}
          >
            Decks
          </button>
          <button
            type="button"
            className={TAB_CLASS(activeTab === "tournaments")}
            onClick={() => setActiveTab("tournaments")}
          >
            Tournois
          </button>
          <button
            type="button"
            className={TAB_CLASS(activeTab === "quiz")}
            onClick={() => setActiveTab("quiz")}
          >
            Quizz
          </button>
        </div>

        <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg p-2.5 tablet:p-4 shadow-sm overflow-hidden">
          {activeTab === "general" && <AdminUserUpdateForm />}
          {activeTab === "decks" &&
            (userId ? (
              <AdminUserDecksTab userId={userId} />
            ) : (
              <p className="text-sm text-gray-500">Utilisateur introuvable.</p>
            ))}
          {activeTab === "tournaments" &&
            (userId ? (
              <AdminUserTournamentsTab userId={userId} />
            ) : (
              <p className="text-sm text-gray-500">Utilisateur introuvable.</p>
            ))}
          {activeTab === "quiz" &&
            (userId ? (
              <AdminUserQuizTab userId={userId} />
            ) : (
              <p className="text-sm text-gray-500">Utilisateur introuvable.</p>
            ))}
        </div>
      </div>

      <ToastContainer />
    </AdminStructure>
  );
};

export default AdminUserUpdate;
