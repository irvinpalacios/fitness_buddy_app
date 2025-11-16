// StepPet core data model stored in memory and persisted via localStorage.
const DEFAULT_NAME = 'My Pet';

const pet = {
  exp: 0,
  level: 1,
  stepsToday: 0,
  evolutionStage: 0,
  name: DEFAULT_NAME,
};

// LocalStorage key allows future schema migrations if needed.
const STORAGE_KEY = 'steppet_pet_v1';

// Emoji visual per evolution stage.
const EVOLUTION_EMOJIS = ['🐣', '🐥', '🦄', '🐉'];

// DOM references resolved once on load.
const elements = {};

/**
 * Load pet stats from localStorage, overwriting defaults when possible.
 */
function loadPet() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      Object.assign(pet, saved);
    }
    if (!pet.name) {
      pet.name = DEFAULT_NAME;
    }
  } catch (error) {
    console.warn('Unable to parse saved pet state', error);
  }
}

/**
 * Persist the entire pet object.
 */
function savePet() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pet));
}

/**
 * Calculate current level and evolution stage based on EXP totals.
 */
function updateLevelAndEvolution() {
  const previousLevel = pet.level;
  const previousStage = pet.evolutionStage;

  // Every 500 EXP grants one level. Level floor is 1.
  pet.level = Math.max(1, Math.floor(pet.exp / 500) + 1);

  // Map level ranges to evolution stage buckets.
  if (pet.level >= 20) {
    pet.evolutionStage = 3;
  } else if (pet.level >= 10) {
    pet.evolutionStage = 2;
  } else if (pet.level >= 5) {
    pet.evolutionStage = 1;
  } else {
    pet.evolutionStage = 0;
  }

  if (pet.level > previousLevel) {
    setMessage(`Level up! You are now level ${pet.level}.`);
  }

  if (pet.evolutionStage > previousStage) {
    setMessage('Your pet evolved! 🎉');
  }
}

/**
 * Update UI components to reflect pet state.
 */
function updateUI() {
  const progressToNextLevel = (pet.exp % 500) / 5; // convert to percentage
  const expNeeded = Math.max(0, pet.level * 500 - pet.exp);

  elements.petEmoji.textContent = EVOLUTION_EMOJIS[pet.evolutionStage] || '🐣';
  elements.level.textContent = pet.level;
  elements.stepsToday.textContent = pet.stepsToday.toLocaleString();
  elements.exp.textContent = pet.exp.toLocaleString();
  elements.expBar.style.width = `${progressToNextLevel}%`;
  elements.petNameDisplay.textContent = pet.name;
  if (elements.petNameInput && document.activeElement !== elements.petNameInput) {
    elements.petNameInput.value = pet.name;
  }
  elements.nextLevelText.textContent = `Next Level: ${expNeeded.toLocaleString()} EXP remaining`;
}

/**
 * Update message paragraph with a friendly note.
 */
function setMessage(text) {
  elements.message.textContent = text;
}

function handleSaveName() {
  const desiredName = elements.petNameInput.value.trim();
  pet.name = desiredName || DEFAULT_NAME;
  savePet();
  updateUI();
  setMessage('Pet name saved!');
}

/**
 * Extract ?steps=### parameter, update pet stats, and persist.
 */
function processStepsFromURL() {
  const url = new URL(window.location.href);
  const newSteps = parseInt(url.searchParams.get('steps'), 10);

  if (!isNaN(newSteps) && newSteps > 0) {
    const previousSteps = pet.stepsToday || 0;
    const delta = newSteps - previousSteps;

    pet.exp += Math.max(0, delta);
    pet.stepsToday = newSteps;

    const gainedExp = Math.max(0, delta);
    const message = gainedExp > 0
      ? `Synced ${newSteps.toLocaleString()} steps (+${gainedExp.toLocaleString()} EXP).`
      : `Synced ${newSteps.toLocaleString()} steps. No new steps since last update.`;
    setMessage(message);
    updateLevelAndEvolution();
    savePet();
    updateUI();
  }
}

/**
 * Initialize DOM references and start application flow.
 */
function init() {
  elements.petEmoji = document.getElementById('petEmoji');
  elements.level = document.getElementById('level');
  elements.stepsToday = document.getElementById('stepsToday');
  elements.exp = document.getElementById('exp');
  elements.expBar = document.getElementById('expBar');
  elements.message = document.getElementById('message');
  elements.petNameDisplay = document.getElementById('petNameDisplay');
  elements.petNameInput = document.getElementById('petNameInput');
  elements.saveNameBtn = document.getElementById('saveNameBtn');
  elements.nextLevelText = document.getElementById('nextLevelText');

  loadPet();
  updateLevelAndEvolution();
  updateUI();
  processStepsFromURL();

  if (elements.saveNameBtn) {
    elements.saveNameBtn.addEventListener('click', handleSaveName);
  }
}

// Ensure initialization occurs only after DOM is ready.
document.addEventListener('DOMContentLoaded', init);
