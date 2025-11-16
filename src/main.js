// src/main.js
// Entry point: handles navigation, listens for events, and orchestrates renders.
(function () {
  let currentState = null;
  let currentTab = 'home';

  function setActiveTab(tab) {
    currentTab = tab;
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
        UI.renderHome(currentState);
        break;
    }
  }

  function refreshStateFromStorage() {
    currentState = GameState.getPetState();
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
    PetModule.updateEvolutionStage(currentState);
    GameState.savePetState(currentState);

    initTabs();
    renderCurrentTab();
  }

  document.addEventListener('stepsSynced', function (event) {
    currentState = event.detail && event.detail.state ? event.detail.state : GameState.getPetState();
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

  document.addEventListener('DOMContentLoaded', init);
})();
