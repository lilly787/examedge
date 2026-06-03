// Lucide icons helper — call refreshIcons() after dynamic HTML updates
function refreshIcons() {
  if (typeof lucide !== "undefined") {
    lucide.createIcons({ attrs: { "stroke-width": 1.75 } });
  }
}

function iconHtml(name, className = "ee-icon") {
  return `<i data-lucide="${name}" class="${className}" aria-hidden="true"></i>`;
}
