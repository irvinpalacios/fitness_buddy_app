// src/gameState.js
// Handles persistent state, daily resets, and exposes helpers for other modules.
(function () {
  const STORAGE_KEY = 'petstep_state';

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function defaultState() {
    return {
      name: 'Sprout',
      stepsToday: 0,
      battleAvailable: false,
      stepsAtBattleStart: null,
      battleStepRequirement: 300,
      stepsRemaining: 300,
      exp: 0,
      evolutionStage: 0,
      lastUpdatedDate: todayISO(),
      streakCount: 0,
      petSet: 'forest',
    };
  }

  function readState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      console.warn('Unable to read stored state', err);
      return null;
    }
  }

  function writeState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Unable to save state', err);
    }
  }

  function applyDailyReset(state) {
    const today = todayISO();
    if (!state.lastUpdatedDate) {
      state.lastUpdatedDate = today;
      return state;
    }

    if (state.lastUpdatedDate === today) {
      return state;
    }

    const prevDate = new Date(state.lastUpdatedDate);
    const diffDays = Math.floor((new Date(today) - prevDate) / (24 * 60 * 60 * 1000));

    if (diffDays === 1 && state.stepsToday > 0) {
      // Maintain streak but wait for today's steps to increment later.
      state.streakCount = Math.max(state.streakCount, 0);
    } else {
      // Missed a day or long gap resets streak.
      state.streakCount = 0;
    }

    state.stepsToday = 0;
    state.battleAvailable = false;
    state.stepsAtBattleStart = null;
    state.battleStepRequirement = 300;
    state.stepsRemaining = state.battleStepRequirement;
    state.lastUpdatedDate = today;
    return state;
  }

  function getPetState() {
    const stored = readState();
    const merged = Object.assign(defaultState(), stored || {});
    if (!merged.petSet) {
      merged.petSet = 'forest';
    }
    const resetState = applyDailyReset(merged);
    writeState(resetState);
    return resetState;
  }

  function savePetState(state) {
    writeState(state);
  }

  window.GameState = {
    getPetState,
    savePetState,
    applyDailyReset,
    todayISO,
  };
})();
