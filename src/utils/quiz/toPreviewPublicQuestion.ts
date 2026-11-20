import type {
  QuizMcqChoice,
  QuizNameTheCardsAnswer,
  QuizPublicQuestion,
  QuizDifficulty,
} from "@/services/quiz";

/** Snapshot minimal du formulaire admin pour la prévisualisation joueur. */
export type PreviewFormSnapshot = {
  type: string;
  prompt: string;
  points: number;
  difficulty: QuizDifficulty | string;
  image_url: string;
  hint: string;
  explanation: string;
  explanation_image_url: string;
  themeSlug: string;
  choicesMode: "text" | "cards" | string;
  choices: Array<{
    text: string;
    cardId: string | null;
    name: string | null;
    artworkUrl: string | null;
  }>;
  correctIndex: number;
  correct: boolean;
  orderItems: Array<{
    id: string;
    label: string;
    imageUrl: string;
  }>;
  correctOrder: string[];
  monsterCount: number;
  nameTheCardsScoringMode?: "per_card" | "all_or_nothing";
  nameTheCardsAnswers: Array<{
    text: string;
    cardId: string | null;
    name: string | null;
    artworkUrl: string | null;
  }>;
  summonerPropositions: Array<{
    text: string;
    cardId: string | null;
    name: string | null;
    artworkUrl: string | null;
    isMaterial: boolean;
  }>;
  zoom: {
    answer: {
      text: string;
      cardId: string | null;
      name: string | null;
      artworkUrl: string | null;
    };
    focusX: number;
    focusY: number;
    phaseDurationSeconds: number;
  };
  hintLadder: {
    answer: {
      text: string;
      cardId: string | null;
      name: string | null;
      artworkUrl: string | null;
    };
    hints: {
      hard: string;
      medium: string;
      easy: string;
      newbie: string;
    };
  };
};

export type PreviewSolution = {
  correctIndex?: number;
  correct?: boolean;
  correctOrder?: string[];
  answers?: QuizNameTheCardsAnswer[];
  cardId?: string | null;
  answer?: QuizNameTheCardsAnswer | null;
};

export type PreviewModel = {
  question: QuizPublicQuestion;
  solution: PreviewSolution;
  themeLabel: string;
};

const PREVIEW_QUESTION_ID = -1;

export function toPreviewPublicQuestion(
  form: PreviewFormSnapshot,
  themeLabel?: string
): PreviewModel {
  const type = form.type;
  const base: QuizPublicQuestion = {
    id: PREVIEW_QUESTION_ID,
    type,
    prompt: form.prompt.trim() || "(Énoncé vide)",
    points:
      type === "zoom" || type === "hint_ladder"
        ? 3
        : Math.max(1, Number(form.points) || 1),
    difficulty: (form.difficulty as QuizDifficulty) || "medium",
    imageUrl: form.image_url.trim() || null,
    hint: form.hint.trim() || null,
    explanation: form.explanation.trim() || null,
    explanationImageUrl: form.explanation_image_url.trim() || null,
    theme: form.themeSlug
      ? {
          id: 0,
          slug: form.themeSlug,
          label: themeLabel || form.themeSlug,
        }
      : null,
    payload: {},
    userAnswer: null,
    isCorrect: null,
    correctPayload: null,
  };

  const solution: PreviewSolution = {};

  if (type === "mcq") {
    const choices: QuizMcqChoice[] = form.choices.map((c) =>
      form.choicesMode === "cards"
        ? {
            text: c.name || c.text,
            cardId: c.cardId,
            name: c.name,
            artworkUrl: c.artworkUrl,
          }
        : {
            text: c.text.trim(),
            cardId: null,
            name: null,
            artworkUrl: null,
          }
    );
    base.payload = {
      choices,
      correctIndex: form.correctIndex,
    };
    solution.correctIndex = form.correctIndex;
  } else if (type === "true_false") {
    base.payload = { correct: form.correct };
    solution.correct = form.correct;
  } else if (type === "order") {
    base.payload = {
      items: form.orderItems.map((item) => ({
        id: item.id,
        label: item.label.trim(),
        imageUrl: item.imageUrl.trim() || null,
      })),
      correctOrder: [...form.correctOrder],
    };
    solution.correctOrder = [...form.correctOrder];
  } else if (type === "name_the_cards") {
    const answers: QuizNameTheCardsAnswer[] = form.nameTheCardsAnswers.map(
      (a) => ({
        cardId: String(a.cardId ?? ""),
        label: a.name || a.text,
        name: a.name,
        artworkUrl: a.artworkUrl,
      })
    );
    base.payload = {
      monsterCount: form.monsterCount,
      scoringMode: form.nameTheCardsScoringMode,
      answers,
    };
    solution.answers = answers;
  } else if (type === "summoner") {
    const materials = form.summonerPropositions.filter((p) => p.isMaterial);
    const propositions = form.summonerPropositions.map((p, index) => ({
      id: String(index),
      cardId: String(p.cardId ?? ""),
      label: p.name || p.text,
      name: p.name,
      artworkUrl: p.artworkUrl,
      isMaterial: p.isMaterial,
    }));
    base.payload = {
      materialCount: materials.length,
      propositions,
    };
    solution.answers = materials.map((p) => ({
      cardId: String(p.cardId ?? ""),
      label: p.name || p.text,
      name: p.name,
      artworkUrl: p.artworkUrl,
    }));
  } else if (type === "zoom") {
    const label = form.zoom.answer.name || form.zoom.answer.text;
    const cardId = form.zoom.answer.cardId
      ? String(form.zoom.answer.cardId)
      : "";
    base.imageUrl =
      form.zoom.answer.artworkUrl?.trim() || form.image_url.trim() || null;
    base.payload = {
      cardId: cardId || undefined,
      label,
      name: form.zoom.answer.name,
      artworkUrl: form.zoom.answer.artworkUrl,
      focusX: form.zoom.focusX,
      focusY: form.zoom.focusY,
      phaseDurationSeconds: form.zoom.phaseDurationSeconds,
      maxPoints: 3,
    };
    solution.cardId = cardId || null;
    solution.answer = {
      cardId,
      label,
      name: form.zoom.answer.name,
      artworkUrl: form.zoom.answer.artworkUrl,
    };
  } else if (type === "hint_ladder") {
    const label =
      form.hintLadder.answer.name || form.hintLadder.answer.text;
    const cardId = form.hintLadder.answer.cardId
      ? String(form.hintLadder.answer.cardId)
      : "";
    base.payload = {
      cardId: cardId || undefined,
      label,
      name: form.hintLadder.answer.name,
      artworkUrl: form.hintLadder.answer.artworkUrl,
      hints: { ...form.hintLadder.hints },
      maxPoints: 3,
    };
    solution.cardId = cardId || null;
    solution.answer = {
      cardId,
      label,
      name: form.hintLadder.answer.name,
      artworkUrl: form.hintLadder.answer.artworkUrl,
    };
  } else {
    base.payload = { correct: form.correct };
    solution.correct = form.correct;
  }

  return {
    question: base,
    solution,
    themeLabel: themeLabel || form.themeSlug || "",
  };
}

function sameIdSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const setB = new Set(b);
  return a.every((id) => setB.has(id));
}

export function evaluatePreviewAnswer(
  type: string,
  solution: PreviewSolution,
  answer: Record<string, unknown>
): { isCorrect: boolean; correctPayload: QuizPublicQuestion["correctPayload"] } {
  if (type === "mcq") {
    const selected =
      typeof answer.selectedIndex === "number" ? answer.selectedIndex : -1;
    return {
      isCorrect: selected === solution.correctIndex,
      correctPayload: { correctIndex: solution.correctIndex },
    };
  }
  if (type === "true_false") {
    return {
      isCorrect: answer.value === solution.correct,
      correctPayload: { correct: solution.correct },
    };
  }
  if (type === "order") {
    const order = Array.isArray(answer.order)
      ? answer.order.map(String)
      : [];
    const expected = (solution.correctOrder ?? []).map(String);
    return {
      isCorrect:
        order.length === expected.length &&
        order.every((id, i) => id === expected[i]),
      correctPayload: {
        correctOrder: solution.correctOrder,
        items: undefined,
      },
    };
  }
  if (type === "name_the_cards") {
    const cardIds = Array.isArray(answer.cardIds)
      ? answer.cardIds.map((id) => String(id ?? "").trim())
      : [];
    const expected = (solution.answers ?? []).map((a) =>
      String(a.cardId ?? "")
    );
    const isCorrect =
      expected.length > 0 &&
      expected.every((id, index) => id && id === (cardIds[index] ?? ""));
    return {
      isCorrect,
      correctPayload: { answers: solution.answers },
    };
  }
  if (type === "summoner") {
    const cardIds = Array.isArray(answer.cardIds)
      ? answer.cardIds.map(String).filter(Boolean)
      : [];
    const expected = (solution.answers ?? [])
      .map((a) => String(a.cardId ?? ""))
      .filter(Boolean);
    return {
      isCorrect: sameIdSet(cardIds, expected),
      correctPayload: { answers: solution.answers },
    };
  }
  if (type === "zoom" || type === "hint_ladder") {
    const cardId =
      answer.cardId != null ? String(answer.cardId) : "";
    const expected = solution.cardId != null ? String(solution.cardId) : "";
    return {
      isCorrect: Boolean(cardId) && cardId === expected,
      correctPayload: {
        cardId: solution.cardId ?? undefined,
        answer: solution.answer ?? null,
      },
    };
  }
  return { isCorrect: false, correctPayload: null };
}
