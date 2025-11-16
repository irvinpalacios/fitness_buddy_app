// src/pet.js
// Evolution logic, asset helpers, and pet naming utilities.
(function () {
  const STAGE_RULES = [
    { stage: 0, min: 0, max: 2999 },
    { stage: 1, min: 3000, max: 6499 },
    { stage: 2, min: 6500, max: 9999 },
    { stage: 3, min: 10000, max: Infinity },
  ];

  // Inline base64 placeholders remove the need for binary assets while
  // still allowing the UI to render basic imagery.
  const PLACEHOLDER_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
  const PET_IMAGES = [PLACEHOLDER_PIXEL, PLACEHOLDER_PIXEL, PLACEHOLDER_PIXEL, PLACEHOLDER_PIXEL];
  const BACKGROUND_IMAGES = [PLACEHOLDER_PIXEL, PLACEHOLDER_PIXEL, PLACEHOLDER_PIXEL, PLACEHOLDER_PIXEL];

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
    return PET_IMAGES[stage] || PLACEHOLDER_PIXEL;
  }

  function getBackgroundAsset(stage) {
    return BACKGROUND_IMAGES[stage] || PLACEHOLDER_PIXEL;
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
