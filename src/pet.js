// src/pet.js
// Evolution logic, asset helpers, and pet naming utilities.
(function () {
  const STAGE_RULES = [
    { stage: 0, min: 0, max: 2999 },
    { stage: 1, min: 3000, max: 6499 },
    { stage: 2, min: 6500, max: 9999 },
    { stage: 3, min: 10000, max: Infinity },
  ];

  // Emoji-based placeholders give us expressive visuals without binary assets.
  const PET_EMOJIS = ['🌱', '🐣', '🦊', '🐉'];
  const BACKGROUND_EMOJIS = ['🌿', '🌤️', '🌈', '🌌'];

  function determineStage(steps) {
    for (let i = 0; i < STAGE_RULES.length; i += 1) {
      const rule = STAGE_RULES[i];
      if (steps >= rule.min && steps <= rule.max) {
        return rule.stage;
      }
    }
    return 3;
  }

  function updateEvolutionStage(state) {
    const stage = determineStage(state.stepsToday);
    state.evolutionStage = stage;
    return state;
  }

  function getStepsToNextStage(state) {
    const stage = state.evolutionStage;
    if (stage >= STAGE_RULES.length - 1) {
      return 0;
    }
    const nextThreshold = STAGE_RULES[stage + 1].min;
    return Math.max(0, nextThreshold - state.stepsToday);
  }

  function getProgressPercent(state) {
    const stage = state.evolutionStage;
    if (stage >= STAGE_RULES.length - 1) {
      return 100;
    }
    const currentRule = STAGE_RULES[stage];
    const nextThreshold = STAGE_RULES[stage + 1].min;
    const span = nextThreshold - currentRule.min;
    const progress = state.stepsToday - currentRule.min;
    return Math.min(100, Math.max(0, (progress / span) * 100));
  }

  function setPetName(newName) {
    const state = GameState.getPetState();
    const trimmed = (newName || '').trim();
    state.name = trimmed || 'Sprout';
    GameState.savePetState(state);
    return state;
  }

  function getPetAsset(stage) {
    return PET_EMOJIS[stage] || '🐾';
  }

  function getBackgroundAsset(stage) {
    return BACKGROUND_EMOJIS[stage] || '✨';
  }

  window.PetModule = {
    updateEvolutionStage,
    getStepsToNextStage,
    getProgressPercent,
    setPetName,
    getPetAsset,
    getBackgroundAsset,
    STAGE_RULES,
  };
})();
