// src/ui.js
// DOM rendering helpers for each tab.
(function () {
  const tabContent = document.getElementById('tab-content');

  function renderHome(state) {
    tabContent.innerHTML = HomeComponent.homeTemplate(state);
  }

  function renderStats(state) {
    const stepsToNext = PetModule.getStepsToNextStage(state);
    const progressPercent = PetModule.getProgressPercent(state).toFixed(0);
    tabContent.innerHTML = `
      <section class="stats">
        <div class="stat-grid">
          <div class="stat-card">
            <h3>Steps Today</h3>
            <p>${state.stepsToday}</p>
          </div>
          <div class="stat-card">
            <h3>Total EXP</h3>
            <p>${state.exp}</p>
          </div>
          <div class="stat-card">
            <h3>Streak</h3>
            <p>${state.streakCount} days</p>
          </div>
          <div class="stat-card">
            <h3>Evolution</h3>
            <p>Stage ${state.evolutionStage}</p>
          </div>
        </div>
        <div class="summary-card" style="margin-top:1.5rem;">
          <h2>Progress Overview</h2>
          <p>${progressPercent}% of current stage complete.</p>
          <p>${stepsToNext} steps remaining to reach the next form.</p>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${progressPercent}%;"></div>
          </div>
        </div>
        <div style="margin-top:1.5rem;">
          ${BattleLogComponent.battleLogPlaceholder()}
        </div>
      </section>
    `;
  }

  function renderCustomize(state) {
    tabContent.innerHTML = ProfileComponent.profileTemplate(state);
    const form = document.getElementById('rename-form');
    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        const input = document.getElementById('pet-name');
        const name = input ? input.value : '';
        document.dispatchEvent(
          new CustomEvent('renamePet', {
            detail: { name },
          })
        );
      });
    }
  }

  window.UI = {
    renderHome,
    renderStats,
    renderCustomize,
  };
})();
