// components/home.js
// Generates markup for the Home tab.
(function () {
  function homeTemplate(state) {
    const stepsToNext = PetModule.getStepsToNextStage(state);
    const progressPercent = PetModule.getProgressPercent(state).toFixed(0);
    const stageLabel = `Stage ${state.evolutionStage}`;
    const petSet = PetModule.getPetSetInfo(state.petSet);
    const petEmoji = PetModule.getPetAsset(state.evolutionStage, petSet.key);
    const bgEmoji = PetModule.getBackgroundAsset(state.evolutionStage, petSet.key);

    return `
      <section class="pet-stage-card home-hero">
        <div class="pet-visual">
          <div class="background-emoji" aria-hidden="true">${bgEmoji}</div>
          <div class="pet-emoji" role="img" aria-label="Pet stage ${state.evolutionStage}">${petEmoji}</div>
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
          <p><strong>Lineage:</strong> ${petSet.label}</p>
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
