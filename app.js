// StepPet core data model stored in memory and persisted via localStorage.
const pet = {
  exp: 0,
  level: 1,
  stepsToday: 0,
  evolutionStage: 0,
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

  elements.petEmoji.textContent = EVOLUTION_EMOJIS[pet.evolutionStage] || '🐣';
  elements.level.textContent = pet.level;
  elements.stepsToday.textContent = pet.stepsToday.toLocaleString();
  elements.exp.textContent = pet.exp.toLocaleString();
  elements.expBar.style.width = `${progressToNextLevel}%`;
}

/**
 * Update message paragraph with a friendly note.
 */
function setMessage(text) {
  elements.message.textContent = text;
}

/**
 * Extract ?steps=### parameter, update pet stats, and persist.
 */
function processStepsFromURL() {
  const url = new URL(window.location.href);
  const newSteps = parseInt(url.searchParams.get('steps'), 10);

  if (!isNaN(newSteps) && newSteps > 0) {
    pet.stepsToday = newSteps;
    pet.exp += newSteps;
    setMessage(`Added ${newSteps.toLocaleString()} steps. Keep going!`);
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

  loadPet();
  updateLevelAndEvolution();
  updateUI();
  processStepsFromURL();
}

// Ensure initialization occurs only after DOM is ready.
document.addEventListener('DOMContentLoaded', init);
