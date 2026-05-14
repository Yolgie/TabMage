function getPrimaryDomain(urlString) {
  try {
    const { hostname, protocol } = new URL(urlString);

    if (!hostname || protocol === "about:" || protocol === "moz-extension:") {
      return null;
    }

    if (hostname === "localhost") {
      return "localhost";
    }

    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
      return hostname;
    }

    const parts = hostname.split(".").filter(Boolean);
    if (parts.length <= 2) {
      return hostname;
    }

    return parts.slice(-2).join(".");
  } catch {
    return null;
  }
}

async function computeDomainCounts() {
  const tabs = await browser.tabs.query({});
  const counts = {};

  for (const tab of tabs) {
    const domain = getPrimaryDomain(tab.url);
    if (!domain) {
      continue;
    }

    counts[domain] = (counts[domain] || 0) + 1;
  }

  return Object.entries(counts)
    .sort((a, b) => {
      if (b[1] !== a[1]) {
        return b[1] - a[1];
      }
      return a[0].localeCompare(b[0]);
    })
    .map(([domain, count]) => ({ domain, count }));
}

browser.runtime.onMessage.addListener((message) => {
  if (message?.type === "GET_DOMAIN_COUNTS") {
    return computeDomainCounts();
  }

  return undefined;
});
