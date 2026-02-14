// Highlight active nav link based on current path
(function setActiveNav(){
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll('nav a[data-page]').forEach(a=>{
    const page = (a.getAttribute("data-page") || "").toLowerCase();
    if(page === path) a.classList.add("active");
  });
})();

// Rotating Australia background photos (Unsplash Source - no API key)
(function rotatingBackground(){
  const BG_INTERVAL_MS = 12000;

  const bgQueries = [
    "australia,landscape",
    "sydney,opera-house",
    "bondi,beach",
    "blue+mountains,australia",
    "melbourne,city",
    "great+ocean+road",
    "uluru,australia",
    "great+barrier+reef",
    "tasmania,nature",
    "perth,coast"
  ];

  const bgA = document.getElementById("bgA");
  const bgB = document.getElementById("bgB");
  if(!bgA || !bgB) return; // page missing background HTML

  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function unsplashUrl(query, sig) {
    return `https://source.unsplash.com/2400x1600/?${encodeURIComponent(query)}&sig=${sig}`;
  }

  function preload(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => resolve(url);
      img.src = url;
    });
  }

  let sig = 1;
  let idx = 0;
  let showingA = true;

  async function setNext(initial = false){
    const query = bgQueries[idx % bgQueries.length];
    const url = unsplashUrl(query, sig++);
    idx++;

    const readyUrl = await preload(url);

    const incoming = showingA ? bgB : bgA;
    const outgoing = showingA ? bgA : bgB;

    incoming.style.backgroundImage = `url("${readyUrl}")`;
    incoming.classList.add("show");
    outgoing.classList.remove("show");
    showingA = !showingA;

    if(initial) incoming.classList.add("show");
  }

  // Reduced motion: set one static image
  if(prefersReduced){
    const url = unsplashUrl(bgQueries[0], sig++);
    bgA.style.backgroundImage = `url("${url}")`;
    bgA.classList.add("show");
    return;
  }

  setNext(true);
  setInterval(setNext, BG_INTERVAL_MS);
})();
