(function () {
  // Toggle aria-expanded on select-like buttons (Month/Year)
  const selects = Array.from(document.querySelectorAll('.select-btn'));
  selects.forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
    });
  });

  // Optional: keyboard focus visual support already handled in CSS :focus-visible

  // Prevent pointer on disabled days
  const disabledDays = Array.from(document.querySelectorAll('.day.disabled'));
  disabledDays.forEach(d => d.setAttribute('aria-disabled', 'true'));

  // No calendar computation required for static spec.
})();
