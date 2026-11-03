import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  createBanlistReason,
  deleteBanlistReason,
  getBanlistReasons,
  updateBanlistReason,
} from "@/services/banlistReason";
import type { RootState } from "@/redux/store";
import type { BanlistReason } from "@/types";
import usePopup from "@/hooks/usePopup";
import PopUp from "@/components/generic/PopUp";
import { toast } from "react-toastify";

const emptyForm = {
  slug: "",
  label: "",
  text: "",
  logo_url: "",
};

const AdminBanlistReasons = () => {
  const { token } = useSelector((state: RootState) => state.user);
  const [reasons, setReasons] = useState<BanlistReason[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const { isOpen, popupConfig, closePopup, showConfirmDialog } = usePopup();

  const loadReasons = useCallback(async () => {
    setLoading(true);
    await getBanlistReasons(setReasons);
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadReasons();
  }, [loadReasons]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const startEdit = (reason: BanlistReason) => {
    setEditingId(reason.id);
    setForm({
      slug: reason.slug ?? "",
      label: reason.label ?? "",
      text: reason.text ?? "",
      logo_url: reason.logo_url ?? "",
    });
  };

  const handleSubmit = async () => {
    if (!token) return;
    if (!form.label.trim() || !form.text.trim()) {
      toast.error("Label et texte sont obligatoires");
      return;
    }

    setSaving(true);
    const payload = {
      slug: form.slug.trim() || undefined,
      label: form.label.trim(),
      text: form.text.trim(),
      logo_url: form.logo_url.trim() || null,
    };

    const result =
      editingId != null
        ? await updateBanlistReason(token, editingId, payload, toast)
        : await createBanlistReason(token, payload, toast);

    setSaving(false);
    if (result) {
      resetForm();
      await loadReasons();
    }
  };

  const handleDelete = (reason: BanlistReason) => {
    if (!token) return;
    showConfirmDialog({
      title: "Supprimer la raison",
      message: `Supprimer « ${reason.label} » ? Les associations aux cartes seront aussi retirées.`,
      onConfirm: () => {
        void (async () => {
          const ok = await deleteBanlistReason(token, reason.id, toast);
          if (ok) {
            if (editingId === reason.id) resetForm();
            await loadReasons();
          }
        })();
      },
    });
  };

  return (
    <section className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4">
      <div>
        <h2 className="text-base font-semibold text-gray-900">Raisons de banlist</h2>
        <p className="text-sm text-gray-500">
          Motifs réutilisables (logo, label, texte) assignables aux cartes restreintes.
        </p>
      </div>

      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
        <div className="space-y-3 border border-gray-200 rounded-lg p-3 bg-slate-50">
          <h3 className="font-semibold text-gray-800">
            {editingId != null ? `Modifier #${editingId}` : "Ajouter une raison"}
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input
              className="w-full p-2 border border-gray-300 rounded-md"
              value={form.label}
              onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
              placeholder="Floodgate"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug / id (optionnel)
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded-md"
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="floodgate"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Texte</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md resize-none"
              rows={3}
              value={form.text}
              onChange={(e) => setForm((prev) => ({ ...prev, text: e.target.value }))}
              placeholder="Bloque l'adversaire sur le développement de son jeu"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo (URL)
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded-md"
              value={form.logo_url}
              onChange={(e) => setForm((prev) => ({ ...prev, logo_url: e.target.value }))}
              placeholder="https://…"
            />
            {form.logo_url ? (
              <img
                src={form.logo_url}
                alt=""
                className="mt-2 h-10 w-10 object-contain rounded border bg-white"
              />
            ) : null}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => void handleSubmit()}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold px-3 py-2 rounded"
            >
              {editingId != null ? "Enregistrer" : "Ajouter"}
            </button>
            {editingId != null ? (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-3 py-2 rounded"
              >
                Annuler
              </button>
            ) : null}
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-4 text-gray-500">Chargement…</div>
          ) : reasons.length === 0 ? (
            <div className="p-4 text-gray-500">Aucune raison pour le moment.</div>
          ) : (
            <ul className="divide-y divide-gray-100 max-h-[420px] overflow-y-auto">
              {reasons.map((reason) => (
                <li
                  key={reason.id}
                  className="flex items-start gap-3 p-3 hover:bg-slate-50"
                >
                  {reason.logo_url ? (
                    <img
                      src={reason.logo_url}
                      alt=""
                      className="h-9 w-9 object-contain rounded border bg-white shrink-0"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded border bg-gray-100 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-gray-900">
                      {reason.label}{" "}
                      <span className="text-xs font-normal text-gray-400">
                        #{reason.id} · {reason.slug}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{reason.text}</p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      className="text-blue-600 text-sm font-medium hover:underline"
                      onClick={() => startEdit(reason)}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="text-red-600 text-sm font-medium hover:underline"
                      onClick={() => handleDelete(reason)}
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

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
    </section>
  );
};

export default AdminBanlistReasons;
