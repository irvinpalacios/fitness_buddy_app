// components/home.js
// Generates markup for the Home tab.
(function () {
  function homeTemplate(state) {
    const stepsToNext = PetModule.getStepsToNextStage(state);
    const progressPercent = PetModule.getProgressPercent(state).toFixed(0);
    const stageLabel = `Stage ${state.evolutionStage}`;
    const petImg = PetModule.getPetAsset(state.evolutionStage);
    const bgImg = PetModule.getBackgroundAsset(state.evolutionStage);

    return `
      <section class="pet-stage-card home-hero">
        <div class="pet-visual">
          <img class="background-img" src="${bgImg}" alt="Background" />
          <img class="pet-img" src="${petImg}" alt="Pet stage ${state.evolutionStage}" />
          <div class="streak-pill">🔥 Streak: ${state.streakCount} days</div>
          <div class="progress-wrapper">
            <div class="progress-bar">
              <div class="progress-fill" style="width:${progressPercent}%;"></div>
            </div>
            <div class="progress-text">
              ${stageLabel} · ${progressPercent}% to next form · ${stepsToNext} steps left
            </div>
          </div>
        </div>
        <div class="summary-card">
          <h2>Today's Summary</h2>
          <p><strong>Pet:</strong> ${state.name}</p>
          <p><strong>Steps today:</strong> ${state.stepsToday}</p>
          <p><strong>Total EXP:</strong> ${state.exp}</p>
          <p><strong>Steps to evolve:</strong> ${stepsToNext}</p>
          <small>Sync more steps using <code>?steps=1234</code> in the URL.</small>
        </div>
      </section>
    `;
  }

  window.HomeComponent = {
    homeTemplate,
  };
})();
