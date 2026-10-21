import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  AdminQuizQuestion,
  AdminQuizQuestionInput,
  AdminQuizSeason,
  createAdminQuizQuestion,
  getQuizThemes,
  listAdminQuizSeasons,
  QuizDifficulty,
  QuizMcqChoice,
  QuizTheme,
  updateAdminQuizQuestion,
} from "../../../../services/quiz";
import { convertBase64 } from "../../../../utils/img/convertBase";
import { URL_FRONT_ADMIN_QUIZ_QUESTIONS } from "../../../../constant/urlsFront";
import QuizChoiceCardPicker, {
  type ChoiceCard,
} from "./QuizChoiceCardPicker";
import QuizImageCardSearch from "./QuizImageCardSearch";
import AdminOrderItemsEditor, {
  emptyOrderItems,
  type OrderItemForm,
} from "./AdminOrderItemsEditor";
import AdminNameTheCardsEditor, {
  emptyNameTheCardsAnswers,
  type NameTheCardsAnswerForm,
} from "./AdminNameTheCardsEditor";
import AdminSummonerEditor, {
  emptySummonerProposition,
  emptySummonerPropositions,
  type SummonerPropositionForm,
} from "./AdminSummonerEditor";
import AdminZoomEditor, {
  emptyZoomForm,
  type ZoomFormState,
} from "./AdminZoomEditor";
import AdminHintLadderEditor, {
  emptyHintLadderForm,
  type HintLadderFormState,
} from "./AdminHintLadderEditor";
import CheckboxSlider from "../../../generic/CheckboxSlider";

export type ChoicesMode = "text" | "cards";
export type ImageMode = "upload" | "card";
export type QuestionType =
  | "mcq"
  | "true_false"
  | "order"
  | "name_the_cards"
  | "summoner"
  | "zoom"
  | "hint_ladder";

const CARD_GAME_THEME_SLUG = "jeu-de-cartes";

const isCardGameQuestionType = (type: QuestionType): boolean =>
  type === "summoner" || type === "zoom" || type === "hint_ladder";

const detectImageMode = (imageUrl: string | null | undefined): ImageMode => {
  if (
    typeof imageUrl === "string" &&
    imageUrl.includes("images.ygoprodeck.com/images/cards_cropped/")
  ) {
    return "card";
  }
  return "upload";
};

const emptyChoice = (): ChoiceCard => ({
  text: "",
  cardId: null,
  name: null,
  artworkUrl: null,
});

const emptyChoices = (): QuestionFormState["choices"] => [
  emptyChoice(),
  emptyChoice(),
  emptyChoice(),
  emptyChoice(),
];

const normalizeChoice = (
  raw: string | QuizMcqChoice | undefined
): ChoiceCard => {
  if (!raw) return emptyChoice();
  if (typeof raw === "string") {
    return { text: raw, cardId: null, name: null, artworkUrl: null };
  }
  return {
    text: raw.text ?? raw.name ?? "",
    cardId: raw.cardId ?? null,
    name: raw.name ?? null,
    artworkUrl: raw.artworkUrl ?? null,
  };
};

const detectChoicesMode = (q: AdminQuizQuestion): ChoicesMode => {
  const mode = (q.payload as { choicesMode?: string })?.choicesMode;
  if (mode === "cards" || mode === "text") return mode;
  const choices = q.payload.choices ?? [];
  if (
    choices.length === 4 &&
    choices.every((c) => {
      if (typeof c === "string") return false;
      return Boolean(c?.cardId);
    })
  ) {
    return "cards";
  }
  return "text";
};

const normalizeOrderItemsFromQuestion = (
  q: AdminQuizQuestion
): {
  items: [OrderItemForm, OrderItemForm, OrderItemForm, OrderItemForm];
  correctOrder: [string, string, string, string];
} => {
  const rawItems = Array.isArray(q.payload.items) ? q.payload.items : [];
  const base = emptyOrderItems();
  const items = base.map((_, index) => {
    const raw = rawItems[index] as
      | { id?: string; label?: string; imageUrl?: string | null }
      | undefined;
    const imageUrl = raw?.imageUrl ?? "";
    return {
      id: String(raw?.id ?? index),
      label: raw?.label ?? "",
      imageUrl,
      imageMode: detectImageMode(imageUrl),
      imageCardName: detectImageMode(imageUrl) === "card" ? "Carte sélectionnée" : null,
    };
  }) as [OrderItemForm, OrderItemForm, OrderItemForm, OrderItemForm];

  const rawOrder = Array.isArray(q.payload.correctOrder)
    ? q.payload.correctOrder.map(String)
    : items.map((item) => item.id);
  const correctOrder = [
    rawOrder[0] ?? items[0].id,
    rawOrder[1] ?? items[1].id,
    rawOrder[2] ?? items[2].id,
    rawOrder[3] ?? items[3].id,
  ] as [string, string, string, string];

  return { items, correctOrder };
};

export type QuestionFormState = {
  themeSlug: string;
  type: QuestionType;
  prompt: string;
  choicesMode: ChoicesMode;
  choices: [ChoiceCard, ChoiceCard, ChoiceCard, ChoiceCard];
  correctIndex: number;
  correct: boolean;
  orderItems: [OrderItemForm, OrderItemForm, OrderItemForm, OrderItemForm];
  correctOrder: [string, string, string, string];
  monsterCount: number;
  nameTheCardsAnswers: NameTheCardsAnswerForm[];
  propositionCount: number;
  summonerPropositions: SummonerPropositionForm[];
  zoom: ZoomFormState;
  hintLadder: HintLadderFormState;
  points: number;
  is_active: boolean;
  /** Planifier pour un jour (UI) ; côté API, planifier pose was_daily_question */
  schedule_daily: boolean;
  was_daily_question: boolean;
  /** Déjà brûlée sans créneau (chargée ainsi) : non replanifiable */
  daily_locked: boolean;
  daily_time_limit_seconds: number;
  season_id: number | null;
  scheduled_date: string | null;
  difficulty: QuizDifficulty;
  imageMode: ImageMode;
  image_url: string;
  imageCardName: string | null;
  hint: string;
  explanation: string;
};

export const emptyForm = (themeSlug = ""): QuestionFormState => ({
  themeSlug,
  type: "mcq",
  prompt: "",
  choicesMode: "text",
  choices: emptyChoices(),
  correctIndex: 0,
  correct: true,
  orderItems: emptyOrderItems(),
  correctOrder: ["0", "1", "2", "3"],
  monsterCount: 1,
  nameTheCardsAnswers: emptyNameTheCardsAnswers(1),
  propositionCount: 4,
  summonerPropositions: emptySummonerPropositions(4),
  zoom: emptyZoomForm(),
  hintLadder: emptyHintLadderForm(),
  points: 1,
  is_active: true,
  schedule_daily: false,
  was_daily_question: false,
  daily_locked: false,
  daily_time_limit_seconds: 15,
  season_id: null,
  scheduled_date: null,
  difficulty: "medium",
  imageMode: "upload",
  image_url: "",
  imageCardName: null,
  hint: "",
  explanation: "",
});

const normalizeCardAnswersFromQuestion = (
  q: AdminQuizQuestion,
  countKey: "monsterCount"
): { count: number; answers: NameTheCardsAnswerForm[] } => {
  const rawAnswers = Array.isArray(q.payload.answers) ? q.payload.answers : [];
  const count = Math.max(
    1,
    Math.min(10, Number(q.payload[countKey]) || rawAnswers.length || 1)
  );
  const answers = emptyNameTheCardsAnswers(count).map((_, index) => {
    const raw = rawAnswers[index] as
      | {
          cardId?: string | null;
          label?: string;
          name?: string | null;
          artworkUrl?: string | null;
          text?: string;
        }
      | undefined;
    if (!raw) return emptyChoice();
    return {
      text: raw.label ?? raw.name ?? raw.text ?? "",
      cardId: raw.cardId ? String(raw.cardId) : null,
      name: raw.name ?? raw.label ?? null,
      artworkUrl: raw.artworkUrl ?? null,
    };
  });
  return { count, answers };
};

const normalizeSummonerFromQuestion = (
  q: AdminQuizQuestion
): {
  propositionCount: number;
  propositions: SummonerPropositionForm[];
} => {
  const rawProps = Array.isArray(q.payload.propositions)
    ? q.payload.propositions
    : Array.isArray(q.payload.answers)
      ? q.payload.answers.map((a) => ({ ...a, isMaterial: true }))
      : [];
  const propositionCount = Math.max(
    2,
    Math.min(10, rawProps.length || 4)
  );
  const propositions = emptySummonerPropositions(propositionCount).map(
    (_, index) => {
      const raw = rawProps[index] as
        | {
            cardId?: string | null;
            label?: string;
            name?: string | null;
            artworkUrl?: string | null;
            text?: string;
            isMaterial?: boolean;
          }
        | undefined;
      if (!raw) return emptySummonerProposition();
      return {
        text: raw.label ?? raw.name ?? raw.text ?? "",
        cardId: raw.cardId ? String(raw.cardId) : null,
        name: raw.name ?? raw.label ?? null,
        artworkUrl: raw.artworkUrl ?? null,
        isMaterial: Boolean(raw.isMaterial),
      };
    }
  );
  return { propositionCount, propositions };
};

const normalizeZoomFromQuestion = (q: AdminQuizQuestion): ZoomFormState => {
  const base = emptyZoomForm();
  const cardId = q.payload.cardId ? String(q.payload.cardId) : null;
  return {
    answer: {
      text: q.payload.label ?? q.payload.name ?? "",
      cardId,
      name: q.payload.name ?? q.payload.label ?? null,
      artworkUrl: q.payload.artworkUrl ?? null,
    },
    focusX: Math.max(0, Math.min(100, Number(q.payload.focusX) || base.focusX)),
    focusY: Math.max(0, Math.min(100, Number(q.payload.focusY) || base.focusY)),
    phaseDurationSeconds: Math.max(
      5,
      Math.min(30, Number(q.payload.phaseDurationSeconds) || 15)
    ),
  };
};

const normalizeHintLadderFromQuestion = (
  q: AdminQuizQuestion
): HintLadderFormState => {
  const cardId = q.payload.cardId ? String(q.payload.cardId) : null;
  const rawHints =
    q.payload.hints && typeof q.payload.hints === "object"
      ? q.payload.hints
      : {};
  return {
    answer: {
      text: q.payload.label ?? q.payload.name ?? "",
      cardId,
      name: q.payload.name ?? q.payload.label ?? null,
      artworkUrl: q.payload.artworkUrl ?? null,
    },
    hints: {
      hard: String(rawHints.hard ?? ""),
      medium: String(rawHints.medium ?? ""),
      easy: String(rawHints.easy ?? ""),
      newbie: String(rawHints.newbie ?? ""),
    },
  };
};

export const formFromQuestion = (q: AdminQuizQuestion): QuestionFormState => {
  const image_url = q.image_url ?? "";
  const type: QuestionType =
    q.type === "true_false"
      ? "true_false"
      : q.type === "order"
        ? "order"
        : q.type === "name_the_cards"
          ? "name_the_cards"
          : q.type === "summoner"
            ? "summoner"
            : q.type === "zoom"
              ? "zoom"
              : q.type === "hint_ladder"
                ? "hint_ladder"
                : "mcq";
  const orderData = normalizeOrderItemsFromQuestion(q);
  const nameData = normalizeCardAnswersFromQuestion(q, "monsterCount");
  const summonerData = normalizeSummonerFromQuestion(q);
  return {
    themeSlug: isCardGameQuestionType(type)
      ? CARD_GAME_THEME_SLUG
      : q.theme?.slug ?? "",
    type,
    prompt: q.prompt,
    choicesMode: detectChoicesMode(q),
    choices: [
      normalizeChoice(q.payload.choices?.[0]),
      normalizeChoice(q.payload.choices?.[1]),
      normalizeChoice(q.payload.choices?.[2]),
      normalizeChoice(q.payload.choices?.[3]),
    ],
    correctIndex:
      typeof q.payload.correctIndex === "number" ? q.payload.correctIndex : 0,
    correct: typeof q.payload.correct === "boolean" ? q.payload.correct : true,
    orderItems: orderData.items,
    correctOrder: orderData.correctOrder,
    monsterCount: nameData.count,
    nameTheCardsAnswers: nameData.answers,
    propositionCount: summonerData.propositionCount,
    summonerPropositions: summonerData.propositions,
    zoom: normalizeZoomFromQuestion(q),
    hintLadder: normalizeHintLadderFromQuestion(q),
    points:
      q.type === "zoom" || q.type === "hint_ladder" ? 3 : q.points || 1,
    is_active: q.is_active,
    schedule_daily: Boolean(q.season_id && q.scheduled_date),
    was_daily_question: Boolean(q.was_daily_question),
    daily_locked: Boolean(q.was_daily_question) && !q.season_id,
    daily_time_limit_seconds: Math.max(
      0,
      Math.min(30, Number(q.daily_time_limit_seconds) || 0)
    ),
    season_id: q.season_id ?? q.season?.id ?? null,
    scheduled_date: q.scheduled_date
      ? String(q.scheduled_date).slice(0, 10)
      : null,
    difficulty: q.difficulty ?? "medium",
    imageMode: detectImageMode(image_url),
    image_url,
    imageCardName: detectImageMode(image_url) === "card" ? "Carte sélectionnée" : null,
    hint: q.hint ?? "",
    explanation: q.explanation ?? "",
  };
};

const buildPayload = (
  form: QuestionFormState
): AdminQuizQuestionInput["payload"] => {
  if (form.type === "mcq") {
    if (form.choicesMode === "cards") {
      return {
        choicesMode: "cards",
        choices: form.choices.map((c) => ({
          text: c.name || c.text,
          cardId: c.cardId,
        })),
        correctIndex: form.correctIndex,
      };
    }
    return {
      choicesMode: "text",
      choices: form.choices.map((c) => ({
        text: c.text.trim(),
        cardId: null,
      })),
      correctIndex: form.correctIndex,
    };
  }
  if (form.type === "order") {
    return {
      items: form.orderItems.map((item) => ({
        id: item.id,
        label: item.label.trim(),
        imageUrl: item.imageUrl.trim() || null,
      })),
      correctOrder: [...form.correctOrder],
    };
  }
  if (form.type === "name_the_cards") {
    return {
      monsterCount: form.monsterCount,
      answers: form.nameTheCardsAnswers.map((a) => ({
        cardId: a.cardId,
        label: a.name || a.text,
      })),
    };
  }
  if (form.type === "summoner") {
    return {
      propositions: form.summonerPropositions.map((p) => ({
        cardId: p.cardId,
        label: p.name || p.text,
        isMaterial: p.isMaterial,
      })),
    };
  }
  if (form.type === "zoom") {
    return {
      cardId: form.zoom.answer.cardId,
      label: form.zoom.answer.name || form.zoom.answer.text,
      focusX: form.zoom.focusX,
      focusY: form.zoom.focusY,
      phaseDurationSeconds: form.zoom.phaseDurationSeconds,
    };
  }
  if (form.type === "hint_ladder") {
    return {
      cardId: form.hintLadder.answer.cardId,
      label: form.hintLadder.answer.name || form.hintLadder.answer.text,
      hints: { ...form.hintLadder.hints },
    };
  }
  return { correct: form.correct };
};

const choicesAreValid = (form: QuestionFormState): boolean => {
  if (form.choicesMode === "cards") {
    return form.choices.every((c) => Boolean(c.cardId));
  }
  return form.choices.every((c) => Boolean(c.text.trim()));
};

const orderItemsAreValid = (form: QuestionFormState): boolean => {
  if (form.orderItems.some((item) => !item.label.trim() && !item.imageUrl)) {
    return false;
  }
  return new Set(form.correctOrder).size === 4;
};

const nameTheCardsAreValid = (form: QuestionFormState): boolean => {
  if (!form.image_url.trim()) return false;
  if (form.nameTheCardsAnswers.length !== form.monsterCount) return false;
  return form.nameTheCardsAnswers.every((a) => Boolean(a.cardId));
};

const summonerAreValid = (form: QuestionFormState): boolean => {
  if (!form.image_url.trim()) return false;
  if (form.summonerPropositions.length !== form.propositionCount) return false;
  if (form.summonerPropositions.length < 2) return false;
  if (!form.summonerPropositions.every((p) => Boolean(p.cardId))) return false;
  return form.summonerPropositions.some((p) => p.isMaterial);
};

const zoomAreValid = (form: QuestionFormState): boolean =>
  Boolean(form.zoom.answer.cardId && form.zoom.answer.artworkUrl);

const hintLadderAreValid = (form: QuestionFormState): boolean => {
  if (!form.hintLadder.answer.cardId) return false;
  const { hard, medium, easy, newbie } = form.hintLadder.hints;
  return Boolean(
    hard.trim() && medium.trim() && easy.trim() && newbie.trim()
  );
};

interface AdminQuizQuestionFormProps {
  mode: "create" | "edit";
  questionId?: number;
  initialQuestion?: AdminQuizQuestion | null;
}

const AdminQuizQuestionForm: React.FC<AdminQuizQuestionFormProps> = ({
  mode,
  questionId,
  initialQuestion,
}) => {
  const navigate = useNavigate();
  const [themes, setThemes] = useState<QuizTheme[]>([]);
  const [seasons, setSeasons] = useState<AdminQuizSeason[]>([]);
  const [form, setForm] = useState<QuestionFormState>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [loadingThemes, setLoadingThemes] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoadingThemes(true);
      try {
        const [themeList, seasonList] = await Promise.all([
          getQuizThemes(),
          listAdminQuizSeasons(),
        ]);
        const filteredThemes = themeList.filter((t) => t.slug !== "all");
        setThemes(filteredThemes);
        setSeasons(seasonList);
        if (initialQuestion) {
          setForm(formFromQuestion(initialQuestion));
        } else {
          const currentSeason =
            seasonList.find((s) => s.status === "current") ?? seasonList[0];
          setForm({
            ...emptyForm(filteredThemes[0]?.slug ?? ""),
            season_id: currentSeason?.id ?? null,
          });
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Impossible de charger les thèmes"
        );
      } finally {
        setLoadingThemes(false);
      }
    })();
  }, [initialQuestion]);

  const setChoicesMode = (choicesMode: ChoicesMode) => {
    setForm((prev) => ({
      ...prev,
      choicesMode,
      choices: emptyChoices(),
      correctIndex: 0,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.themeSlug || !form.prompt.trim()) {
      toast.error("Thème et énoncé sont requis");
      return;
    }
    if (form.type === "mcq" && !choicesAreValid(form)) {
      toast.error(
        form.choicesMode === "cards"
          ? "Sélectionnez une carte pour chacune des 4 propositions"
          : "Remplissez les 4 propositions en texte libre"
      );
      return;
    }
    if (form.type === "order" && !orderItemsAreValid(form)) {
      toast.error(
        "Dans l'ordre : chaque proposition doit avoir un libellé ou une image, et l'ordre correct doit être une permutation"
      );
      return;
    }
    if (form.type === "name_the_cards" && !nameTheCardsAreValid(form)) {
      toast.error(
        "Trouvez le nom : une image est obligatoire et chaque monstre doit être une carte sélectionnée"
      );
      return;
    }
    if (form.type === "summoner" && !summonerAreValid(form)) {
      toast.error(
        "Invocateur : image obligatoire, 2–10 propositions carte, et au moins un matériau coché"
      );
      return;
    }
    if (form.type === "zoom" && !zoomAreValid(form)) {
      toast.error(
        "Zoom : sélectionnez une carte réponse via l'autocomplétion"
      );
      return;
    }
    if (form.type === "hint_ladder" && !hintLadderAreValid(form)) {
      toast.error(
        "Indices : sélectionnez une carte et renseignez les 4 niveaux d'indice"
      );
      return;
    }
    if (form.daily_locked && form.schedule_daily) {
      toast.error(
        "Cette question a déjà été utilisée en Daily et ne peut plus être planifiée"
      );
      return;
    }
    if (form.schedule_daily && !form.season_id) {
      toast.error(
        "Sélectionnez une saison Daily Quizz pour une question du défi du jour"
      );
      return;
    }
    if (form.schedule_daily && !form.scheduled_date) {
      toast.error(
        "Choisissez le jour (date) auquel cette question sera le défi du jour"
      );
      return;
    }

    const payload: AdminQuizQuestionInput = {
      themeSlug: isCardGameQuestionType(form.type)
        ? CARD_GAME_THEME_SLUG
        : form.themeSlug,
      type: form.type,
      prompt: form.prompt.trim(),
      payload: buildPayload(form),
      points:
        form.type === "zoom" || form.type === "hint_ladder" ? 3 : form.points,
      is_active: form.is_active,
      was_daily_question:
        form.schedule_daily || form.was_daily_question ? true : undefined,
      daily_time_limit_seconds:
        form.type === "zoom" ? 0 : form.daily_time_limit_seconds,
      season_id: form.schedule_daily ? form.season_id : null,
      scheduled_date: form.schedule_daily ? form.scheduled_date : null,
      difficulty: form.difficulty,
      image_url:
        form.type === "zoom"
          ? form.zoom.answer.artworkUrl?.trim() || null
          : form.type === "hint_ladder"
            ? null
            : form.image_url.trim() || null,
      hint:
        form.type === "zoom" || form.type === "hint_ladder"
          ? null
          : form.hint.trim() || null,
      explanation:
        form.type === "zoom" || form.type === "hint_ladder"
          ? null
          : form.explanation.trim() || null,
    };

    setSaving(true);
    try {
      if (mode === "edit" && questionId) {
        await updateAdminQuizQuestion(questionId, payload);
        toast.success("Question mise à jour");
      } else {
        await createAdminQuizQuestion(payload);
        toast.success("Question créée");
      }
      navigate(URL_FRONT_ADMIN_QUIZ_QUESTIONS);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'enregistrement"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loadingThemes) {
    return <div className="p-4">Chargement du formulaire…</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-slate-200 rounded p-4 space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <label className="col-span-12 tablet:col-span-3 flex flex-col text-sm font-medium text-gray-800">
          Thème
          <select
            required
            disabled={isCardGameQuestionType(form.type)}
            className="mt-1 p-2 rounded font-normal disabled:bg-gray-100 disabled:text-gray-500"
            value={
              isCardGameQuestionType(form.type)
                ? CARD_GAME_THEME_SLUG
                : form.themeSlug
            }
            title={
              isCardGameQuestionType(form.type)
                ? "Ce type de question est forcément « Jeu de Cartes »"
                : undefined
            }
            onChange={(e) =>
              setForm((prev) => ({ ...prev, themeSlug: e.target.value }))
            }
          >
            {themes.map((t) => (
              <option key={t.id} value={t.slug}>
                {t.label}
              </option>
            ))}
          </select>
          {isCardGameQuestionType(form.type) && (
            <span className="mt-1 text-xs text-gray-600 font-normal">
              Forcé : Jeu de Cartes (Invocateur / Zoom / Indices)
            </span>
          )}
        </label>

        <label className="col-span-12 tablet:col-span-3 flex flex-col text-sm font-medium text-gray-800">
          Type de question
          <select
            className="mt-1 p-2 rounded font-normal"
            value={form.type}
            onChange={(e) => {
              const nextType = e.target.value as QuestionType;
              setForm((prev) => ({
                ...prev,
                type: nextType,
                ...(isCardGameQuestionType(nextType)
                  ? { themeSlug: CARD_GAME_THEME_SLUG }
                  : {}),
                ...(nextType === "zoom"
                  ? {
                      prompt: "Quelle est cette carte ?",
                      hint: "",
                      explanation: "",
                      zoom: emptyZoomForm(),
                    }
                  : nextType === "hint_ladder"
                    ? {
                        prompt: "Trouvez le nom de la carte grâce aux indices",
                        hint: "",
                        explanation: "",
                        hintLadder: emptyHintLadderForm(),
                      }
                    : {}),
              }));
            }}
          >
            <option value="mcq">MCQ (4 choix)</option>
            <option value="true_false">Vrai / Faux</option>
            <option value="order">Dans l&apos;ordre</option>
            <option value="name_the_cards">Trouvez le nom</option>
            <option value="summoner">Invocateur</option>
            <option value="zoom">Zoom</option>
            <option value="hint_ladder">Indices</option>
          </select>
        </label>

        <label className="col-span-12 tablet:col-span-2 flex flex-col text-sm font-medium text-gray-800">
          Difficulté
          <select
            className="mt-1 p-2 rounded font-normal"
            value={form.difficulty}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                difficulty: e.target.value as QuizDifficulty,
              }))
            }
          >
            <option value="easy">Facile</option>
            <option value="medium">Moyen</option>
            <option value="hard">Difficile</option>
          </select>
        </label>

        <label className="col-span-12 tablet:col-span-2 flex flex-col text-sm font-medium text-gray-800">
          Points
          <input
            type="number"
            min={1}
            disabled={form.type === "zoom" || form.type === "hint_ladder"}
            className="mt-1 p-2 rounded font-normal disabled:bg-gray-100 disabled:text-gray-500"
            value={
              form.type === "zoom" || form.type === "hint_ladder"
                ? 3
                : form.points
            }
            title={
              form.type === "zoom"
                ? "Zoom : 3 / 2 / 1 selon la phase"
                : form.type === "hint_ladder"
                  ? "Indices : 3 / 2 / 1 / 0 selon le niveau"
                  : undefined
            }
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                points: Math.max(1, Number(e.target.value) || 1),
              }))
            }
          />
          {form.type === "zoom" && (
            <span className="mt-1 text-xs text-gray-600 font-normal">
              Auto : 3 → 2 → 1 selon la phase
            </span>
          )}
          {form.type === "hint_ladder" && (
            <span className="mt-1 text-xs text-gray-600 font-normal">
              Auto : 3 → 2 → 1 → 0 selon l&apos;indice
            </span>
          )}
        </label>

        <label className="col-span-12 tablet:col-span-2 flex items-end gap-2 text-sm font-medium text-gray-800 pb-2">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, is_active: e.target.checked }))
            }
          />
          Question active
        </label>

      </div>

      <fieldset className="rounded border-2 border-amber-400 bg-amber-50/60 p-4 space-y-3">
        <legend className="px-2 text-sm font-bold text-amber-900">
          Mode défi du jour
        </legend>
        {form.daily_locked ? (
          <p className="text-sm text-amber-900 font-medium">
            Cette question a déjà été utilisée en Daily et ne peut plus être
            planifiée.
          </p>
        ) : (
          <label className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <input
              type="checkbox"
              checked={form.schedule_daily}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  schedule_daily: e.target.checked,
                  ...(e.target.checked
                    ? {}
                    : { season_id: null, scheduled_date: null }),
                }))
              }
            />
            Planifier pour le défi du jour
          </label>
        )}
        {form.schedule_daily && (
          <>
            <label className="flex flex-col text-sm font-medium text-gray-800 max-w-md">
              Saison Daily Quizz
              <select
                className="mt-1 p-2 rounded font-normal border border-amber-300 bg-white"
                value={form.season_id ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    season_id: e.target.value ? Number(e.target.value) : null,
                    scheduled_date: null,
                  }))
                }
                required
              >
                <option value="">Sélectionner une saison</option>
                {seasons.map((season) => (
                  <option key={season.id} value={season.id}>
                    {season.name} ({season.startDate} → {season.endDate})
                  </option>
                ))}
              </select>
              {seasons.length === 0 && (
                <span className="mt-1 text-xs text-red-600 font-normal">
                  Créez d&apos;abord une saison depuis le dashboard Quizz.
                </span>
              )}
            </label>
            <label className="flex flex-col text-sm font-medium text-gray-800 max-w-md">
              Jour du défi (1 question / jour)
              <input
                type="date"
                className="mt-1 p-2 rounded font-normal border border-amber-300 bg-white"
                value={form.scheduled_date ?? ""}
                min={
                  seasons.find((s) => s.id === form.season_id)?.startDate ??
                  undefined
                }
                max={
                  seasons.find((s) => s.id === form.season_id)?.endDate ??
                  undefined
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    scheduled_date: e.target.value || null,
                  }))
                }
                required
                disabled={!form.season_id}
              />
              <span className="mt-1 text-xs text-gray-600 font-normal">
                Ce jour-là, cette question sera le défi du jour (unique dans la
                saison).
              </span>
            </label>
          </>
        )}
        {form.type === "zoom" ? (
          <p className="text-xs text-gray-700">
            Pour Zoom, le chrono joueur = 3 × « Durée par phase » (ex. 15 s →
            45 s). Pas de chrono daily séparé.
          </p>
        ) : (
          <label className="flex flex-col text-sm font-medium text-gray-800 max-w-xs">
            Temps imparti (secondes)
            <input
              type="number"
              min={0}
              max={30}
              className="mt-1 p-2 rounded font-normal border border-amber-300 bg-white"
              value={form.daily_time_limit_seconds}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  daily_time_limit_seconds: Math.max(
                    0,
                    Math.min(30, Math.floor(Number(e.target.value) || 0))
                  ),
                }))
              }
            />
            <span className="mt-1 text-xs text-gray-600 font-normal">
              0 = pas de chrono. Maximum 30 secondes.
            </span>
          </label>
        )}
      </fieldset>

      <label className="flex flex-col text-sm font-medium text-gray-800">
        Énoncé
        <textarea
          required
          rows={4}
          className="mt-1 p-2 rounded font-normal"
          value={form.prompt}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, prompt: e.target.value }))
          }
        />
      </label>

      <div className="grid grid-cols-12 gap-4">
        {form.type !== "zoom" && form.type !== "hint_ladder" && (
          <div className="col-span-12 tablet:col-span-6 bg-gray-100 rounded p-3 space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-gray-800">Image</p>
              <div className="flex flex-row items-center gap-2">
                <span className="text-xs font-medium text-gray-800 whitespace-nowrap">
                  Fichier
                </span>
                <label className="inline-flex relative items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={form.imageMode === "card"}
                    onChange={() => {
                      const nextMode: ImageMode =
                        form.imageMode === "card" ? "upload" : "card";
                      setForm((prev) => ({
                        ...prev,
                        imageMode: nextMode,
                        image_url: "",
                        imageCardName: null,
                      }));
                    }}
                  />
                  <CheckboxSlider />
                </label>
                <span className="text-xs font-medium text-gray-800 whitespace-nowrap">
                  Artwork carte
                </span>
              </div>
            </div>

            {form.image_url && (
              <img
                src={form.image_url}
                alt="Prévisualisation"
                className="max-h-40 rounded object-contain shadow-sm"
              />
            )}

            {form.imageMode === "upload" ? (
              <label className="flex flex-col text-sm font-medium text-gray-800">
                Fichier image
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 font-normal"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const base64Img = await convertBase64(file);
                    if (typeof base64Img === "string") {
                      setForm((prev) => ({
                        ...prev,
                        image_url: base64Img,
                        imageCardName: null,
                      }));
                    }
                  }}
                />
              </label>
            ) : (
              <QuizImageCardSearch
                selectedName={form.imageCardName}
                onSelect={(artworkUrl, cardName) =>
                  setForm((prev) => ({
                    ...prev,
                    image_url: artworkUrl,
                    imageCardName: cardName,
                  }))
                }
                onClear={() =>
                  setForm((prev) => ({
                    ...prev,
                    image_url: "",
                    imageCardName: null,
                  }))
                }
              />
            )}

            {form.image_url && (
              <button
                type="button"
                className="text-sm text-red-600 hover:underline"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    image_url: "",
                    imageCardName: null,
                  }))
                }
              >
                Retirer l&apos;image
              </button>
            )}
          </div>
        )}

        {form.type !== "zoom" && form.type !== "hint_ladder" && (
          <div className="col-span-12 tablet:col-span-6 space-y-3">
            <label className="flex flex-col text-sm font-medium text-gray-800">
              Indice
              <textarea
                rows={3}
                className="mt-1 p-2 rounded font-normal"
                value={form.hint}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, hint: e.target.value }))
                }
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-gray-800">
              Explication
              <textarea
                rows={4}
                className="mt-1 p-2 rounded font-normal"
                value={form.explanation}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, explanation: e.target.value }))
                }
              />
            </label>
          </div>
        )}
      </div>

      {form.type === "order" ? (
        <fieldset className="space-y-4 bg-gray-100 rounded p-4">
          <legend className="text-sm font-medium text-gray-800 mb-2">
            Dans l&apos;ordre — 4 propositions à classer
          </legend>
          <AdminOrderItemsEditor
            items={form.orderItems}
            correctOrder={form.correctOrder}
            onChangeItems={(orderItems) =>
              setForm((prev) => ({ ...prev, orderItems }))
            }
            onChangeCorrectOrder={(correctOrder) =>
              setForm((prev) => ({ ...prev, correctOrder }))
            }
          />
        </fieldset>
      ) : form.type === "name_the_cards" ? (
        <fieldset className="space-y-4 bg-gray-100 rounded p-4">
          <legend className="text-sm font-medium text-gray-800 mb-2">
            Trouvez le nom — réponses dans l&apos;ordre de l&apos;image
          </legend>
          <p className="text-xs text-amber-800 bg-amber-50 rounded p-2">
            Une image de question est obligatoire (hébergée ci-dessus). Les
            numéros 1…N sur l&apos;image correspondent aux réponses ci-dessous.
          </p>
          <AdminNameTheCardsEditor
            monsterCount={form.monsterCount}
            answers={form.nameTheCardsAnswers}
            onChangeMonsterCount={(monsterCount) =>
              setForm((prev) => {
                const answers =
                  monsterCount > prev.nameTheCardsAnswers.length
                    ? [
                        ...prev.nameTheCardsAnswers,
                        ...emptyNameTheCardsAnswers(
                          monsterCount - prev.nameTheCardsAnswers.length
                        ),
                      ]
                    : prev.nameTheCardsAnswers.slice(0, monsterCount);
                return {
                  ...prev,
                  monsterCount,
                  nameTheCardsAnswers: answers,
                };
              })
            }
            onChangeAnswers={(nameTheCardsAnswers) =>
              setForm((prev) => ({ ...prev, nameTheCardsAnswers }))
            }
          />
        </fieldset>
      ) : form.type === "summoner" ? (
        <fieldset className="space-y-4 bg-gray-100 rounded p-4">
          <legend className="text-sm font-medium text-gray-800 mb-2">
            Invocateur — propositions &amp; matériaux
          </legend>
          <p className="text-xs text-amber-800 bg-amber-50 rounded p-2">
            Image de la carte invocatrice obligatoire. Ajoutez des
            propositions (autocomplétion), puis cochez celles qui sont les
            matériaux. Le joueur verra toutes les propositions et devra
            cocher les bons matériaux.
          </p>
          <AdminSummonerEditor
            propositionCount={form.propositionCount}
            propositions={form.summonerPropositions}
            onChangePropositionCount={(propositionCount) =>
              setForm((prev) => {
                const propositions =
                  propositionCount > prev.summonerPropositions.length
                    ? [
                        ...prev.summonerPropositions,
                        ...emptySummonerPropositions(
                          propositionCount - prev.summonerPropositions.length
                        ),
                      ]
                    : prev.summonerPropositions.slice(0, propositionCount);
                return {
                  ...prev,
                  propositionCount,
                  summonerPropositions: propositions,
                };
              })
            }
            onChangePropositions={(summonerPropositions) =>
              setForm((prev) => ({ ...prev, summonerPropositions }))
            }
          />
        </fieldset>
      ) : form.type === "zoom" ? (
        <fieldset className="space-y-4 bg-gray-100 rounded p-4">
          <legend className="text-sm font-medium text-gray-800 mb-2">
            Zoom — focus progressif (3 → 2 → 1 points)
          </legend>
          <p className="text-xs text-amber-800 bg-amber-50 rounded p-2">
            Sélectionnez la carte réponse : son artwork sert d&apos;image. Le
            joueur voit d&apos;abord une petite zone (carré), puis plus large,
            puis la carte entière. Trouver tôt rapporte plus de points.
          </p>
          <AdminZoomEditor
            value={form.zoom}
            onChange={(zoom) => setForm((prev) => ({ ...prev, zoom }))}
          />
        </fieldset>
      ) : form.type === "hint_ladder" ? (
        <fieldset className="space-y-4 bg-gray-100 rounded p-4">
          <legend className="text-sm font-medium text-gray-800 mb-2">
            Indices — Difficile 3 → Moyen 2 → Facile 1 → Newbie 0
          </legend>
          <p className="text-xs text-amber-800 bg-amber-50 rounded p-2">
            Le joueur commence avec l&apos;indice Difficile. Il peut révéler
            les indices suivants (et baisser ses points potentiels) avant de
            proposer le nom de la carte.
          </p>
          <AdminHintLadderEditor
            value={form.hintLadder}
            onChange={(hintLadder) =>
              setForm((prev) => ({ ...prev, hintLadder }))
            }
          />
        </fieldset>
      ) : form.type === "mcq" ? (
        <fieldset className="space-y-4 bg-gray-100 rounded p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <legend className="text-sm font-medium text-gray-800">
              Propositions (cochez la bonne réponse)
            </legend>
            <div className="flex flex-row items-center justify-center gap-2 px-2">
              <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
                Entrée imagée
              </span>
              <label className="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={form.choicesMode === "text"}
                  onChange={() =>
                    setChoicesMode(
                      form.choicesMode === "text" ? "cards" : "text"
                    )
                  }
                />
                <CheckboxSlider />
              </label>
              <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
                Entrée libre
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-600">
            {form.choicesMode === "cards"
              ? "Chaque proposition doit être une carte sélectionnée dans la liste (recherche dans le nom)."
              : "Saisissez librement les 4 propositions (ex. culture G)."}
          </p>

          {form.choices.map((choice, index) => (
            <div
              key={`${form.choicesMode}-${index}`}
              className="flex items-start gap-3 bg-white rounded p-3 border border-gray-200"
            >
              <input
                type="radio"
                name="correctIndex"
                className="mt-3"
                title={`Bonne réponse : proposition ${String.fromCharCode(65 + index)}`}
                checked={form.correctIndex === index}
                onChange={() =>
                  setForm((prev) => ({ ...prev, correctIndex: index }))
                }
              />
              {form.choicesMode === "cards" ? (
                <QuizChoiceCardPicker
                  label={`Proposition ${String.fromCharCode(65 + index)}`}
                  value={choice}
                  onChange={(next) => {
                    const choices = [
                      ...form.choices,
                    ] as QuestionFormState["choices"];
                    choices[index] = next;
                    setForm((prev) => ({ ...prev, choices }));
                  }}
                />
              ) : (
                <label className="flex-1 flex flex-col text-sm font-medium text-gray-800">
                  Proposition {String.fromCharCode(65 + index)}
                  <input
                    type="text"
                    className="mt-1 p-2 rounded font-normal border border-gray-300"
                    value={choice.text}
                    placeholder="Texte de la proposition"
                    onChange={(e) => {
                      const choices = [
                        ...form.choices,
                      ] as QuestionFormState["choices"];
                      choices[index] = {
                        text: e.target.value,
                        cardId: null,
                        name: null,
                        artworkUrl: null,
                      };
                      setForm((prev) => ({ ...prev, choices }));
                    }}
                  />
                </label>
              )}
            </div>
          ))}
        </fieldset>
      ) : (
        <label className="flex flex-col text-sm font-medium text-gray-800 max-w-xs">
          Bonne réponse
          <select
            className="mt-1 p-2 rounded font-normal"
            value={form.correct ? "true" : "false"}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                correct: e.target.value === "true",
              }))
            }
          >
            <option value="true">Vrai</option>
            <option value="false">Faux</option>
          </select>
        </label>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="text-white p-2 bg-blue-400 rounded hover:bg-blue-500 font-bold cursor-pointer disabled:opacity-50"
        >
          {saving
            ? "Enregistrement…"
            : mode === "edit"
              ? "Mettre à jour"
              : "Créer la question"}
        </button>
        <button
          type="button"
          onClick={() => navigate(URL_FRONT_ADMIN_QUIZ_QUESTIONS)}
          className="p-2 rounded border border-gray-400 bg-white hover:bg-gray-100 font-medium"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

export default AdminQuizQuestionForm;
