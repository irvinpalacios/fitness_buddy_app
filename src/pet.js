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
  const PET_SETS = {
    forest: {
      label: 'Forest Sprouts',
      theme: 'Earthy growth',
      description: 'Gentle woodland friends that bloom with every stroll.',
      pets: ['🌱', '🐿️', '🦊', '🦄'],
      backgrounds: ['🌿', '🌳', '🌼', '🌲'],
    },
    ocean: {
      label: 'Ocean Spirits',
      theme: 'Tidal energy',
      description: 'Bubbly sea pals that shimmer brighter with movement.',
      pets: ['🐚', '🐠', '🐬', '🐉'],
      backgrounds: ['🌊', '🐚', '💙', '🌌'],
    },
  };

  function resolvePetSet(key) {
    if (key && PET_SETS[key]) {
      return { key, data: PET_SETS[key] };
    }
    return { key: 'forest', data: PET_SETS.forest };
  }

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

  function setPetSet(key) {
    const state = GameState.getPetState();
    const resolved = resolvePetSet(key);
    state.petSet = resolved.key;
    GameState.savePetState(state);
    return state;
  }

  function getPetAsset(stage, petSetKey) {
    const resolved = resolvePetSet(petSetKey);
    const list = resolved.data.pets;
    return list[stage] || list[list.length - 1] || '🐾';
  }

  function getBackgroundAsset(stage, petSetKey) {
    const resolved = resolvePetSet(petSetKey);
    const list = resolved.data.backgrounds;
    return list[stage] || list[list.length - 1] || '✨';
  }

  function getPetSetInfo(key) {
    const resolved = resolvePetSet(key);
    return Object.assign({ key: resolved.key }, resolved.data);
  }

  function getAvailablePetSets() {
    return Object.keys(PET_SETS).map((key) => ({ key, label: PET_SETS[key].label, description: PET_SETS[key].description, theme: PET_SETS[key].theme, pets: PET_SETS[key].pets }));
  }

  window.PetModule = {
    updateEvolutionStage,
    getStepsToNextStage,
    getProgressPercent,
    setPetName,
    setPetSet,
    getPetAsset,
    getBackgroundAsset,
    getPetSetInfo,
    getAvailablePetSets,
    STAGE_RULES,
  };
})();
