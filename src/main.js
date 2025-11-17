// src/main.js
// Entry point: handles navigation, listens for events, and orchestrates renders.
(function () {
  let currentState = null;
  let currentTab = 'home';
  let battleScreenVisible = false;
  let battleTimerInterval = null;
  let lastTimerSeconds = null;

  function battleStateSnapshot(state) {
    if (!state) return '';
    return JSON.stringify({
      stepsAtBattleStart: state.stepsAtBattleStart,
      stepsRemaining: state.stepsRemaining,
      battleResult: state.battleResult,
      lastBattleRemaining: state.lastBattleRemaining,
    });
  }

  function setActiveTab(tab) {
    currentTab = tab;
    if (tab !== 'home') {
      battleScreenVisible = false;
    }
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });
  }

  function renderCurrentTab() {
    if (!currentState) return;
    switch (currentTab) {
      case 'stats':
        UI.renderStats(currentState);
        break;
      case 'customize':
        UI.renderCustomize(currentState);
        break;
      case 'home':
      default:
        UI.renderHome(currentState, { battleScreenVisible });
        break;
    }
  }

  function refreshStateFromStorage() {
    currentState = GameState.getPetState();
    BattleModule.ensureDefaults(currentState);
    BattleModule.syncBattleProgress(currentState);
    PetModule.updateEvolutionStage(currentState);
    GameState.savePetState(currentState);
  }

  function initTabs() {
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        setActiveTab(tab);
        renderCurrentTab();
      });
    });
  }

  function init() {
    refreshStateFromStorage();
    const syncedState = StepSync.syncStepsFromUrl();
    if (syncedState) {
      currentState = syncedState;
    }
    BattleModule.ensureDefaults(currentState);
    BattleModule.syncBattleProgress(currentState);
    PetModule.updateEvolutionStage(currentState);
    GameState.savePetState(currentState);

    initTabs();
    renderCurrentTab();
    startBattleTicker();
  }

  function startBattleTicker() {
    if (battleTimerInterval) return;
    battleTimerInterval = setInterval(() => {
      if (!currentState) return;
      const before = battleStateSnapshot(currentState);
      BattleModule.syncBattleProgress(currentState);
      const after = battleStateSnapshot(currentState);
      const battleActive = BattleModule.isBattleInProgress(currentState);
      const timerSeconds = battleActive ? Math.ceil(BattleModule.getBattleTimeRemaining(currentState) / 1000) : null;
      const timerChanged = timerSeconds !== lastTimerSeconds;
      if (before !== after || timerChanged) {
        GameState.savePetState(currentState);
        renderCurrentTab();
      }
      lastTimerSeconds = timerSeconds;
    }, 1000);
  }

  document.addEventListener('stepsSynced', function (event) {
    currentState = event.detail && event.detail.state ? event.detail.state : GameState.getPetState();
    BattleModule.ensureDefaults(currentState);
    BattleModule.syncBattleProgress(currentState);
    renderCurrentTab();
  });

  document.addEventListener('renamePet', function (event) {
    const name = event.detail ? event.detail.name : '';
    currentState = PetModule.setPetName(name);
    renderCurrentTab();
  });

  document.addEventListener('changePetSet', function (event) {
    const key = event.detail ? event.detail.key : '';
    currentState = PetModule.setPetSet(key);
    PetModule.updateEvolutionStage(currentState);
    GameState.savePetState(currentState);
    renderCurrentTab();
  });

  document.addEventListener('startBattle', function () {
    if (!currentState) return;
    currentState = BattleModule.startBattle(currentState);
    GameState.savePetState(currentState);
    battleScreenVisible = true;
    renderCurrentTab();
  });

  document.addEventListener('openBattleScreen', function () {
    battleScreenVisible = true;
    renderCurrentTab();
  });

  document.addEventListener('closeBattleScreen', function () {
    battleScreenVisible = false;
    if (currentState && currentState.battleResult) {
      currentState.battleResult = null;
      currentState.lastBattleRemaining = null;
      GameState.savePetState(currentState);
    }
    renderCurrentTab();
  });

  document.addEventListener('DOMContentLoaded', init);
})();
