// components/home.js
// Generates markup for the Home tab.
(function () {
  const STAGE_TITLES = ['Egg', 'Hatchling', 'Companion', 'Mythic'];
  const STAGE_DESCRIPTIONS = [
    'A mysterious egg waiting to hatch.',
    'Each step helps this buddy break out of its shell.',
    'Your partner soaks up every walk you take.',
    'A legendary friend forged by countless steps.',
  ];

  function formatNumber(value) {
    return (value || 0).toLocaleString('en-US');
  }

  function getStageTitle(stage) {
    if (typeof STAGE_TITLES[stage] !== 'undefined') {
      return STAGE_TITLES[stage];
    }
    return `Stage ${stage + 1}`;
  }

  function getStageDescription(stage, fallback) {
    if (typeof STAGE_DESCRIPTIONS[stage] !== 'undefined') {
      return STAGE_DESCRIPTIONS[stage];
    }
    return fallback || '';
  }

  function homeTemplate(state, options = {}) {
    const stepsToNext = PetModule.getStepsToNextStage(state);
    const progressPercent = PetModule.getProgressPercent(state).toFixed(0);
    const stageTitle = getStageTitle(state.evolutionStage);
    const petSet = PetModule.getPetSetInfo(state.petSet);
    const petEmoji = PetModule.getPetAsset(state.evolutionStage, petSet.key);
    const petBackground = PetModule.getBackgroundAsset(state.evolutionStage, petSet.key);
    const nextStageEmoji = PetModule.getPetAsset(
      Math.min(state.evolutionStage + 1, PetModule.STAGE_RULES.length - 1),
      petSet.key
    );
    const heroDescription = getStageDescription(state.evolutionStage, petSet.description);
    const levelLabel = `Level ${state.evolutionStage + 1}`;
    const totalStepsTarget =
      state.evolutionStage < PetModule.STAGE_RULES.length - 1
        ? PetModule.STAGE_RULES[state.evolutionStage + 1].min
        : null;
    const levelGoalText = totalStepsTarget ? `${formatNumber(totalStepsTarget)} total steps` : 'Max level reached';
    const nextStageTitle = getStageTitle(Math.min(state.evolutionStage + 1, STAGE_TITLES.length - 1));
    const nextStageText =
      totalStepsTarget !== null
        ? `${nextStageTitle} · ${formatNumber(totalStepsTarget)} total steps`
        : 'Your companion reached the final form';
    const milestoneTarget = BattleModule.getMilestoneTarget();
    const battleRequirement = BattleModule.getBattleRequirement(state);
    const readySteps = BattleModule.getStepsTowardNextBattle(state);
    const readyPercent = BattleModule.getBattleReadyPercent(state).toFixed(0);
    const battleDisplayRemaining = Math.max(0, BattleModule.getBattleDisplayRemaining(state));
    const battleStepsDone = Math.min(battleRequirement, Math.max(0, battleRequirement - battleDisplayRemaining));
    const battleProgressPercent = BattleModule.getBattleProgressPercent(state).toFixed(0);
    const battleInProgress = BattleModule.isBattleInProgress(state);
    const battleHasResult = BattleModule.hasBattleResult(state);
    const battleTimerMs = BattleModule.getBattleTimeRemaining(state);
    const battleTimerText = battleInProgress ? BattleModule.formatBattleTime(battleTimerMs) : '0 minutes 0 seconds';
    const showBattleStartBtn = state.battleAvailable && !battleInProgress && !battleHasResult;
    const { battleScreenVisible = false } = options;
    const homeViewClass = battleScreenVisible ? 'is-hidden' : '';
    const battleScreenClass = battleScreenVisible ? '' : 'is-hidden';
    const showResumeButton = battleInProgress && !battleScreenVisible;
    const showResultButton = battleHasResult && !battleScreenVisible;
    let battleHeading = 'Battle Encounter';
    let battleIntroText = 'Your partner encountered a challenge!';
    let battleStatusText = `Steps remaining: ${battleDisplayRemaining}`;

    if (battleHasResult) {
      if (state.battleResult === 'victory') {
        battleHeading = 'Victory!';
        battleIntroText = 'Victory! Your partner won the battle!';
        battleStatusText = 'Walk to the next milestone to unlock another battle.';
      } else {
        battleHeading = 'Battle Lost';
        battleIntroText = 'Time ran out before your partner could finish the challenge.';
        battleStatusText = 'Time ran out before your partner could finish the challenge.';
      }
    } else if (!battleInProgress) {
      battleStatusText = 'Walk to the next milestone to unlock another battle.';
    }

    return `
      <div id="home-main-view" class="${homeViewClass}">
        <section class="home-card hero-card">
          <div class="hero-text">
            <p class="hero-stage">${stageTitle}</p>
            <h2 class="hero-name">${state.name}</h2>
            <p class="hero-desc">${heroDescription}</p>
            <div class="hero-lineage">${petSet.label}</div>
            <div class="hero-streak">🔥 ${state.streakCount} day streak</div>
          </div>
          <div class="hero-egg" role="img" aria-label="Current pet stage">
            <span>${petEmoji}</span>
          </div>
        </section>

        <section class="home-card steps-card">
          <div class="steps-header">
            <div>
              <p class="card-label">Today's Steps</p>
              <p class="steps-value">${formatNumber(state.stepsToday)}</p>
            </div>
            <div class="steps-egg" aria-hidden="true">🥾</div>
          </div>
          <p class="exp-earned">${formatNumber(state.exp)} EXP earned</p>
          <div class="level-meta">
            <p class="card-label">${levelLabel}</p>
            <span>${levelGoalText}</span>
          </div>
          <div class="level-progress" role="progressbar" aria-valuenow="${progressPercent}" aria-valuemin="0" aria-valuemax="100">
            <div class="level-progress-fill" style="width:${progressPercent}%"></div>
          </div>
          <p class="progress-caption">${progressPercent}% · ${formatNumber(stepsToNext)} steps to evolve</p>
        </section>

        <section class="home-card next-evolution-card">
          <div>
            <p class="card-label">Next Evolution</p>
            <h3>${nextStageTitle}</h3>
            <p class="next-stage-text">${nextStageText}</p>
            <div class="steps-pill">${formatNumber(stepsToNext)} steps remaining</div>
          </div>
          <div class="next-egg" role="img" aria-label="Next pet stage">
            <span>${nextStageEmoji}</span>
          </div>
        </section>

        <section class="home-card battle-ready-card" aria-live="polite">
          <div class="battle-meter-header">
            <h2>Battle Ready Meter</h2>
            <span>${readyPercent}%</span>
          </div>
          <div class="battle-meter-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${milestoneTarget}" aria-valuenow="${readySteps}">
            <div class="battle-meter-fill" style="width:${readyPercent}%"></div>
          </div>
          <p class="battle-meter-text">${readySteps} / ${milestoneTarget} steps</p>
          <p class="battle-meter-help">Walk ${milestoneTarget} steps to unlock your next battle.</p>
          ${showBattleStartBtn ? '<button id="battle-start-btn" class="battle-button">Battle Available!</button>' : ''}
          ${showResumeButton ? '<button id="battle-resume-btn" class="battle-button battle-button--secondary">Resume Battle</button>' : ''}
          ${showResultButton ? '<button id="battle-result-btn" class="battle-button battle-button--secondary">View Battle Result</button>' : ''}
        </section>
      </div>
      <section id="battle-screen" class="battle-screen ${battleScreenClass}" aria-live="polite">
        <div class="battle-screen-header">
          <h2>${battleHeading}</h2>
          <p>${battleIntroText}</p>
        </div>
        <div class="battle-pet-showcase" aria-label="Your pet companion">
          <div class="pet-visual battle-pet-visual">
            <div class="background-emoji" aria-hidden="true">${petBackground}</div>
            <div class="pet-emoji" role="img" aria-label="Current pet stage">${petEmoji}</div>
          </div>
        </div>
        <p class="battle-status-text">${battleStatusText}</p>
        <p id="battle-timer-text" class="battle-timer">Time Remaining: ${battleTimerText}</p>
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

    const resultBtn = document.getElementById('battle-result-btn');
    if (resultBtn) {
      resultBtn.addEventListener('click', function () {
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
