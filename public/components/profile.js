// components/profile.js
// Customize tab content: rename pet + preview.
(function () {
  function profileTemplate(state) {
    const selectedSet = PetModule.getPetSetInfo(state.petSet);
    const previews = PetModule.STAGE_RULES.map(
      (rule) => `
        <div class="pet-preview">
          <div class="pet-emoji" role="img" aria-label="Stage ${rule.stage}">${PetModule.getPetAsset(rule.stage, selectedSet.key)}</div>
          <p>Stage ${rule.stage}</p>
        </div>
      `
    ).join('');

    const setOptions = PetModule.getAvailablePetSets()
      .map(
        (set) => `
          <label class="pet-set-option">
            <input type="radio" name="pet-set" value="${set.key}" ${state.petSet === set.key ? 'checked' : ''} />
            <div class="pet-set-body">
              <div class="pet-set-header">
                <span class="pet-set-name">${set.label}</span>
                <span class="pet-set-tag">${set.theme}</span>
              </div>
              <p class="pet-set-desc">${set.description}</p>
              <div class="pet-set-emoji-row">
                ${set.pets
                  .map(
                    (emoji, idx) => `
                      <span class="pet-emoji" role="img" aria-label="Stage ${idx}">${emoji}</span>
                    `
                  )
                  .join('')}
              </div>
            </div>
          </label>
        `
      )
      .join('');

    return `
      <section class="customize">
        <div class="summary-card">
          <h2>Rename your pet</h2>
          <form class="customize-form" id="rename-form">
            <label for="pet-name">Pet name</label>
            <input id="pet-name" name="pet-name" value="${state.name}" maxlength="20" />
            <button type="submit">Save Name</button>
          </form>
        </div>
        <div class="summary-card">
          <h2>Evolution Preview</h2>
          <p class="pet-preview-note">Currently viewing: ${selectedSet.label}</p>
          <div class="pet-preview-grid">
            ${previews}
          </div>
        </div>
        <div class="summary-card">
          <h2>Choose your pet lineage</h2>
          <form id="pet-set-form" class="pet-set-form">
            ${setOptions}
          </form>
        </div>
      </section>
    `;
  }

  window.ProfileComponent = {
    profileTemplate,
  };
})();
