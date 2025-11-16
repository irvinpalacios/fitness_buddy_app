// components/home.js
// Generates markup for the Home tab.
(function () {
  function homeTemplate(state, options = {}) {
    const stepsToNext = PetModule.getStepsToNextStage(state);
    const progressPercent = PetModule.getProgressPercent(state).toFixed(0);
    const stageLabel = `Stage ${state.evolutionStage}`;
    const petSet = PetModule.getPetSetInfo(state.petSet);
    const petEmoji = PetModule.getPetAsset(state.evolutionStage, petSet.key);
    const bgEmoji = PetModule.getBackgroundAsset(state.evolutionStage, petSet.key);
    const milestoneTarget = BattleModule.getMilestoneTarget();
    const battleRequirement = BattleModule.getBattleRequirement(state);
    const readySteps = BattleModule.getStepsTowardNextBattle(state);
    const readyPercent = BattleModule.getBattleReadyPercent(state).toFixed(0);
    const battleStepsRemaining = Math.max(0, state.stepsRemaining ?? battleRequirement);
    const battleStepsDone = Math.min(battleRequirement, Math.max(0, battleRequirement - battleStepsRemaining));
    const battleProgressPercent = BattleModule.getBattleProgressPercent(state).toFixed(0);
    const battleInProgress = BattleModule.isBattleInProgress(state);
    const { battleScreenVisible = false } = options;
    const homeViewClass = battleScreenVisible ? 'is-hidden' : '';
    const battleScreenClass = battleScreenVisible ? '' : 'is-hidden';
    const showResumeButton = battleInProgress && !battleScreenVisible;
    const battleIntroText = battleStepsRemaining === 0 ? 'Victory! You won the battle.' : 'Your partner encountered a challenge!';
    const battleStatusText = battleStepsRemaining === 0
      ? 'All done! Walk toward your next milestone to unlock another battle.'
      : `Steps remaining: ${battleStepsRemaining}`;

    return `
      <div id="home-main-view" class="${homeViewClass}">
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
          </div>
        </section>
        <section class="summary-card battle-ready-card" aria-live="polite">
          <div class="battle-meter-header">
            <h2>Battle Ready Meter</h2>
            <span>${readyPercent}%</span>
          </div>
          <div class="battle-meter-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${milestoneTarget}" aria-valuenow="${readySteps}">
            <div class="battle-meter-fill" style="width:${readyPercent}%"></div>
          </div>
          <p class="battle-meter-text">${readySteps} / ${milestoneTarget} steps</p>
          <p class="battle-meter-help">Walk ${milestoneTarget} steps to unlock your next battle.</p>
          <button id="battle-start-btn" class="battle-button ${state.battleAvailable ? '' : 'is-hidden'}">Battle Available!</button>
          ${showResumeButton ? '<button id="battle-resume-btn" class="battle-button battle-button--secondary">Resume Battle</button>' : ''}
        </section>
      </div>
      <section id="battle-screen" class="battle-screen ${battleScreenClass}" aria-live="polite">
        <div class="battle-screen-header">
          <h2>Battle Encounter</h2>
          <p>${battleIntroText}</p>
        </div>
        <p class="battle-status-text">${battleStatusText}</p>
        <div class="battle-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${battleRequirement}" aria-valuenow="${battleStepsDone}">
          <div class="battle-progress-fill" style="width:${battleProgressPercent}%"></div>
        </div>
        <p class="battle-progress-text">${battleStepsDone} / ${battleRequirement} steps</p>
        <button id="battle-return-btn" class="battle-return-btn">Return Home</button>
      </section>
    `;
  }

  function bindEvents() {
    const startBtn = document.getElementById('battle-start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', function () {
        document.dispatchEvent(new CustomEvent('startBattle'));
      });
    }

    const resumeBtn = document.getElementById('battle-resume-btn');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', function () {
        document.dispatchEvent(new CustomEvent('openBattleScreen'));
      });
    }

    const returnBtn = document.getElementById('battle-return-btn');
    if (returnBtn) {
      returnBtn.addEventListener('click', function () {
        document.dispatchEvent(new CustomEvent('closeBattleScreen'));
      });
    }
  }

  window.HomeComponent = {
    homeTemplate,
    bindEvents,
  };
})();
