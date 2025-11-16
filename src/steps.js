// src/steps.js
// Reads ?steps=NUMBER, updates the pet state, handles streaks and evolution, then cleans the URL.
(function () {
  function parseStepsFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const value = params.get('steps');
    if (!value) return null;
    const parsed = parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      return null;
    }
    return { count: parsed, params };
  }

  function clearStepsParam(params) {
    if (!params) return;
    params.delete('steps');
    const query = params.toString();
    const newUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    window.history.replaceState({}, document.title, newUrl);
  }

  function syncStepsFromUrl() {
    const parsed = parseStepsFromUrl();
    const state = GameState.getPetState();
    BattleModule.ensureDefaults(state);
    BattleModule.syncBattleProgress(state);
    if (!parsed) {
      GameState.savePetState(state);
      return state;
    }

    const { count, params } = parsed;
    const previousSteps = state.stepsToday || 0;
    const hadNoStepsYet = previousSteps === 0;
    const delta = Math.max(0, count - previousSteps);

    state.stepsToday = count;
    state.exp += delta;

    PetModule.updateEvolutionStage(state);

    BattleModule.updateAfterStepsChange(state, previousSteps);

    if (count > 0 && hadNoStepsYet) {
      state.streakCount = (state.streakCount || 0) + 1;
    }

    GameState.savePetState(state);
    clearStepsParam(params);

    document.dispatchEvent(
      new CustomEvent('stepsSynced', {
        detail: { addedSteps: delta, state },
      })
    );

    return state;
  }

  window.StepSync = {
    syncStepsFromUrl,
  };
})();
