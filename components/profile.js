// components/profile.js
// Customize tab content: rename pet + preview.
(function () {
  function profileTemplate(state) {
    const previews = PetModule.STAGE_RULES.map(
      (rule) => `<div><img src="${PetModule.getPetAsset(rule.stage)}" alt="Stage ${rule.stage}" /><p>Stage ${rule.stage}</p></div>`
    ).join('');

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
          <div class="pet-preview-grid">
            ${previews}
          </div>
        </div>
      </section>
    `;
  }

  window.ProfileComponent = {
    profileTemplate,
  };
})();
