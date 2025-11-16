const STORAGE_KEY = 'steppet_state_v1';
const STAGES = [
  { min: 0, max: 2999, emoji: '🐣', label: 'Stage 0', color: '#f3f3f3', nextThreshold: 3000 },
  { min: 3000, max: 7499, emoji: '🐥', label: 'Stage 1', color: '#d0e7ff', nextThreshold: 7500 },
  { min: 7500, max: 11999, emoji: '🦄', label: 'Stage 2', color: '#d8f7d4', nextThreshold: 12000 },
  { min: 12000, max: Infinity, emoji: '🐉', label: 'Stage 3', color: '#fff4c2', nextThreshold: null }
];

const el = id => document.getElementById(id);

const state = loadState();
const today = new Date().toISOString().split('T')[0];

resetForNewDay();

const stepsToday = getStepsFromURL();
state.stepsToday = stepsToday;
state.exp = stepsToday;

handleStreakUpdate();
updateUI();
attachHandlers();
state.lastUpdatedDate = today;
saveState();

function getStepsFromURL() {
  const params = new URLSearchParams(window.location.search);
  const steps = parseInt(params.get('steps'), 10);
  return Number.isFinite(steps) && steps >= 0 ? steps : 0;
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === 'object') {
      return {
        petName: saved.petName || 'Your Pet',
        streak: saved.streak || 0,
        lastUpdatedDate: saved.lastUpdatedDate || '',
        stepsToday: saved.stepsToday || 0,
        exp: saved.exp || 0
      };
    }
  } catch (e) {
    console.warn('Failed to parse saved state', e);
  }
  return {
    petName: 'Your Pet',
    streak: 0,
    lastUpdatedDate: '',
    stepsToday: 0,
    exp: 0
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function resetForNewDay() {
  if (!state.lastUpdatedDate) return;
  if (state.lastUpdatedDate !== today) {
    state.stepsToday = 0;
    state.exp = 0;
  }
}

function handleStreakUpdate() {
  if (state.lastUpdatedDate === today) return;

  if (state.stepsToday > 0) {
    state.streak += 1;
  } else if (state.stepsToday === 0) {
    state.streak = 0;
  }
}

function determineStage(steps) {
  return STAGES.find(stage => steps >= stage.min && steps <= stage.max) || STAGES[STAGES.length - 1];
}

function updateProgress(stage, steps) {
  const bar = el('expBar');
  const nextText = el('nextEvolutionText');
  if (stage.nextThreshold === null) {
    bar.style.width = '100%';
    nextText.textContent = 'Max evolution reached today!';
    return;
  }
  const nextThreshold = stage.nextThreshold;
  const percent = Math.min((steps / nextThreshold) * 100, 100);
  bar.style.width = `${percent}%`;
  const remaining = Math.max(nextThreshold - steps, 0);
  nextText.textContent = `Steps to next evolution: ${remaining} left`;
}

function updateUI() {
  const stage = determineStage(state.stepsToday);
  document.body.style.setProperty('--bg-color', stage.color);

  el('stepsToday').textContent = state.stepsToday;
  el('exp').textContent = state.exp;
  el('streakCount').textContent = `Streak: ${state.streak} days`;
  el('petEmoji').textContent = stage.emoji;
  el('petNameDisplay').textContent = state.petName;
  el('evolutionStage').textContent = `${stage.label} (${stage.emoji})`;
  el('message').textContent = getMessageForStage(stage);

  updateProgress(stage, state.stepsToday);

  el('summaryCardPet').textContent = stage.emoji;
  el('summaryCardName').textContent = state.petName;
  el('summaryCardSteps').textContent = `Steps: ${state.stepsToday}`;
  el('summaryCardStage').textContent = `${stage.label} (${stage.emoji})`;

  el('petNameInput').value = state.petName;
}

function getMessageForStage(stage) {
  switch (stage.label) {
    case 'Stage 0':
      return 'Keep moving! Your pet is just starting out.';
    case 'Stage 1':
      return 'Nice steps! Your pet is warming up.';
    case 'Stage 2':
      return 'Amazing! Your pet is magical now.';
    case 'Stage 3':
      return 'Legendary! Your pet reached its final form.';
    default:
      return 'Keep going!';
  }
}

function attachHandlers() {
  el('saveNameBtn').addEventListener('click', () => {
    const nameInput = el('petNameInput').value.trim();
    if (nameInput.length === 0) {
      alert('Please enter a valid name.');
      return;
    }
    state.petName = nameInput;
    updateUI();
    saveState();
  });
}
