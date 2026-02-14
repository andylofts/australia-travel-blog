// Highlight active nav link based on current path
(function setActiveNav(){
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll('nav a[data-page]').forEach(a=>{
    const page = (a.getAttribute("data-page") || "").toLowerCase();
    if(page === path) a.classList.add("active");
  });
})();

(function rotatingBackground(){
  const BG_INTERVAL_MS = 12000;

  // Use direct image URLs instead of source.unsplash.com (which is often broken/deprecated).
  // Wikimedia "Special:FilePath" reliably serves the file.
  const bgImages = [
    "https://commons.wikimedia.org/wiki/Special:FilePath/Sydney_opera_house_2010.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/The_Twelve_Apostles_2011.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Uluru%2C_helicopter_view.jpg",
    "https://commons.wikimedia.org/wiki/Special:FilePath/Reef_Snorkelling_on_the_Great_Barrier_Reef.jpg"
  ];

  const bgA = document.getElementById("bgA");
  const bgB = document.getElementById("bgB");
  if(!bgA || !bgB) return;

  const prefersReduced =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function preload(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  let idx = 0;
  let showingA = true;

  async function setNext(initial = false){
    const url = bgImages[idx % bgImages.length];
    idx++;

    // Wait until image is ready before fading
    await preload(url);

    const incoming = showingA ? bgB : bgA;
    const outgoing = showingA ? bgA : bgB;

    incoming.style.backgroundImage = `url("${url}")`;
    incoming.classList.add("show");
    outgoing.classList.remove("show");
    showingA = !showingA;

    if(initial) incoming.classList.add("show");
  }

  if(prefersReduced){
    bgA.style.backgroundImage = `url("${bgImages[0]}")`;
    bgA.classList.add("show");
    return;
  }

  setNext(true);
  setInterval(setNext, BG_INTERVAL_MS);
})();
