async function renderDomainCounts() {
  const list = document.getElementById("domain-list");
  const emptyState = document.getElementById("empty-state");

  list.textContent = "";

  const domainCounts = await browser.runtime.sendMessage({
    type: "GET_DOMAIN_COUNTS"
  });

  if (!domainCounts || domainCounts.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  for (const { domain, count } of domainCounts) {
    const item = document.createElement("li");
    item.textContent = `${domain}: ${count}`;
    list.appendChild(item);
  }
}

renderDomainCounts().catch((error) => {
  const emptyState = document.getElementById("empty-state");
  emptyState.hidden = false;
  emptyState.textContent = `Unable to load tab counts: ${error.message}`;
});
