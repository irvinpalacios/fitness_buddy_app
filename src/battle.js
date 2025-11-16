// src/battle.js
// Battle helpers: handles milestone tracking, battle progress, and exposes UI helpers.
(function () {
  const MILESTONE_STEPS = 1000;
  const STEP_REQUIREMENT = 300;

  function ensureDefaults(state) {
    if (!state) return state;
    state.battleStepRequirement = STEP_REQUIREMENT;
    if (state.battleAvailable === undefined) {
      state.battleAvailable = false;
    }
    if (state.stepsAtBattleStart === undefined) {
      state.stepsAtBattleStart = null;
    }
    if (state.stepsRemaining === undefined) {
      state.stepsRemaining = state.battleStepRequirement;
    }
    return state;
  }

  function syncBattleProgress(state) {
    if (!state) return state;
    ensureDefaults(state);
    if (state.stepsAtBattleStart !== null) {
      const stepsSinceStart = Math.max(0, (state.stepsToday || 0) - state.stepsAtBattleStart);
      state.stepsRemaining = Math.max(0, state.battleStepRequirement - stepsSinceStart);
      if (state.stepsRemaining === 0) {
        state.stepsAtBattleStart = null;
        state.battleAvailable = false;
      }
    } else if (!state.battleAvailable) {
      state.stepsRemaining = state.battleStepRequirement;
    }
    return state;
  }

  function updateAfterStepsChange(state, previousSteps) {
    if (!state) return state;
    syncBattleProgress(state);
    const prev = typeof previousSteps === 'number' ? previousSteps : state.stepsToday || 0;
    const current = state.stepsToday || 0;
    const prevMilestones = Math.floor(prev / MILESTONE_STEPS);
    const currentMilestones = Math.floor(current / MILESTONE_STEPS);

    if (!state.battleAvailable && state.stepsAtBattleStart === null && currentMilestones > prevMilestones) {
      state.battleAvailable = true;
      state.stepsRemaining = state.battleStepRequirement;
    }

    if (state.stepsAtBattleStart !== null) {
      const stepsSinceStart = Math.max(0, current - state.stepsAtBattleStart);
      state.stepsRemaining = Math.max(0, state.battleStepRequirement - stepsSinceStart);
      if (state.stepsRemaining === 0) {
        state.stepsAtBattleStart = null;
        state.battleAvailable = false;
      }
    }

    return state;
  }

  function startBattle(state) {
    if (!state) return state;
    syncBattleProgress(state);
    if (state.stepsAtBattleStart !== null) {
      return state;
    }
    if (!state.battleAvailable) {
      return state;
    }
    state.battleAvailable = false;
    state.stepsAtBattleStart = state.stepsToday || 0;
    state.stepsRemaining = state.battleStepRequirement;
    return state;
  }

  function getMilestoneTarget() {
    return MILESTONE_STEPS;
  }

  function getBattleRequirement(state) {
    return state && state.battleStepRequirement ? state.battleStepRequirement : STEP_REQUIREMENT;
  }

  function getStepsTowardNextBattle(state) {
    if (!state) return 0;
    if (state.battleAvailable) return 0;
    return (state.stepsToday || 0) % MILESTONE_STEPS;
  }

  function getBattleReadyPercent(state) {
    const steps = getStepsTowardNextBattle(state);
    return Math.min(100, (steps / MILESTONE_STEPS) * 100);
  }

  function getBattleProgressPercent(state) {
    const requirement = getBattleRequirement(state);
    const remaining = Math.max(0, state && typeof state.stepsRemaining === 'number' ? state.stepsRemaining : requirement);
    const completed = Math.max(0, Math.min(requirement, requirement - remaining));
    return requirement === 0 ? 0 : Math.min(100, (completed / requirement) * 100);
  }

  function isBattleInProgress(state) {
    if (!state) return false;
    return state.stepsAtBattleStart !== null && state.stepsRemaining > 0;
  }

  window.BattleModule = {
    ensureDefaults,
    syncBattleProgress,
    updateAfterStepsChange,
    startBattle,
    getStepsTowardNextBattle,
    getBattleReadyPercent,
    getBattleProgressPercent,
    getBattleRequirement,
    getMilestoneTarget,
    isBattleInProgress,
  };
})();
