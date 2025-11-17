// src/battle.js
// Battle helpers: handles milestone tracking, battle progress, and exposes UI helpers.
(function () {
  const MILESTONE_STEPS = 1000;
  const STEP_REQUIREMENT = 300;
  const BATTLE_DURATION_MS = 60 * 60 * 1000;

  function getBattleDurationMs(state) {
    if (!state) return BATTLE_DURATION_MS;
    if (typeof state.battleDurationMs === 'number' && state.battleDurationMs > 0) {
      return state.battleDurationMs;
    }
    return BATTLE_DURATION_MS;
  }

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
    if (state.battleStartTime === undefined) {
      state.battleStartTime = null;
    }
    if (state.battleDurationMs === undefined) {
      state.battleDurationMs = BATTLE_DURATION_MS;
    }
    if (state.battleResult === undefined) {
      state.battleResult = null;
    }
    if (state.lastBattleRemaining === undefined) {
      state.lastBattleRemaining = null;
    }
    return state;
  }

  function resolveBattle(state, result) {
    if (!state) return state;
    const finalRemaining = typeof state.stepsRemaining === 'number' ? Math.max(0, state.stepsRemaining) : state.battleStepRequirement;
    state.lastBattleRemaining = finalRemaining;
    state.stepsAtBattleStart = null;
    state.stepsRemaining = state.battleStepRequirement;
    state.battleStartTime = null;
    state.battleAvailable = false;
    state.battleResult = result || null;
    return state;
  }

  function syncBattleProgress(state) {
    if (!state) return state;
    ensureDefaults(state);
    if (state.stepsAtBattleStart !== null) {
      if (!state.battleStartTime) {
        state.battleStartTime = Date.now();
      }
      const stepsSinceStart = Math.max(0, (state.stepsToday || 0) - state.stepsAtBattleStart);
      state.stepsRemaining = Math.max(0, state.battleStepRequirement - stepsSinceStart);
      if (state.stepsRemaining === 0) {
        return resolveBattle(state, 'victory');
      }
      const timeRemaining = getBattleTimeRemaining(state);
      if (timeRemaining <= 0) {
        return resolveBattle(state, 'defeat');
      }
    } else {
      state.stepsRemaining = state.battleStepRequirement;
      if (!state.battleResult) {
        state.lastBattleRemaining = null;
      }
      state.battleStartTime = null;
    }
    return state;
  }

  function updateAfterStepsChange(state, previousSteps) {
    if (!state) return state;
    ensureDefaults(state);
    const prev = typeof previousSteps === 'number' ? previousSteps : state.stepsToday || 0;
    const current = state.stepsToday || 0;
    const prevMilestones = Math.floor(prev / MILESTONE_STEPS);
    const currentMilestones = Math.floor(current / MILESTONE_STEPS);

    if (!state.battleAvailable && state.stepsAtBattleStart === null && currentMilestones > prevMilestones) {
      state.battleAvailable = true;
      state.stepsRemaining = state.battleStepRequirement;
      state.battleResult = null;
      state.lastBattleRemaining = null;
    }

    if (state.stepsAtBattleStart !== null) {
      const stepsSinceStart = Math.max(0, current - state.stepsAtBattleStart);
      state.stepsRemaining = Math.max(0, state.battleStepRequirement - stepsSinceStart);
      if (state.stepsRemaining === 0) {
        resolveBattle(state, 'victory');
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
    state.battleStartTime = Date.now();
    state.battleResult = null;
    state.lastBattleRemaining = null;
    return state;
  }

  function getMilestoneTarget() {
    return MILESTONE_STEPS;
  }

  function getBattleRequirement(state) {
    return state && state.battleStepRequirement ? state.battleStepRequirement : STEP_REQUIREMENT;
  }

  function getBattleDisplayRemaining(state) {
    if (!state) return STEP_REQUIREMENT;
    if (state.stepsAtBattleStart !== null) {
      return Math.max(0, typeof state.stepsRemaining === 'number' ? state.stepsRemaining : state.battleStepRequirement);
    }
    if (state.battleResult && typeof state.lastBattleRemaining === 'number') {
      return Math.max(0, state.lastBattleRemaining);
    }
    return state.battleStepRequirement;
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
    const remaining = Math.max(0, getBattleDisplayRemaining(state));
    const completed = Math.max(0, Math.min(requirement, requirement - remaining));
    return requirement === 0 ? 0 : Math.min(100, (completed / requirement) * 100);
  }

  function isBattleInProgress(state) {
    if (!state) return false;
    return state.stepsAtBattleStart !== null && !state.battleResult;
  }

  function hasBattleResult(state) {
    return Boolean(state && state.battleResult);
  }

  function getBattleTimeRemaining(state) {
    if (!state) return 0;
    if (state.stepsAtBattleStart === null) return 0;
    if (!state.battleStartTime) return getBattleDurationMs(state);
    const duration = getBattleDurationMs(state);
    const elapsed = Date.now() - state.battleStartTime;
    return Math.max(0, duration - elapsed);
  }

  function formatBattleTime(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const parts = [];
    if (hours > 0) {
      parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
    }
    parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
    parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
    return parts.join(' ');
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
    hasBattleResult,
    getBattleTimeRemaining,
    formatBattleTime,
    getBattleDisplayRemaining,
  };
})();
