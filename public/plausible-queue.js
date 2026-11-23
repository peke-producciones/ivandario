// Cola de eventos de Plausible: permite registrar eventos antes de que cargue su script.
window.plausible =
  window.plausible ||
  function () {
    (window.plausible.q = window.plausible.q || []).push(arguments);
  };
