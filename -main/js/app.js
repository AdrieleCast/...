// ======================
// CONFIGURAÇÃO DO PORTAL
// ======================
const CONFIG = {
  couple: {
    name: "Bianca & Arthur",
    tagline: "Jesus é o centro do nosso amor.",
    password: "A&B0925" // simples para protótipo; em produção, use backend!
  },
  categories: [
    { id: "teaser", title: "Teaser" },
    { id: "trailer", title: "Trailer" },
    { id: "filme", title: "Filme Completo" },
    { id: "makingof", title: "Making Of" },
    { id: "reels", title: "Reels & Highlights" }
  ],
  videos: [
    // PUBLIC
    { id: "t1", title: "Teaser Oficial", category: "teaser", duration: "0:58",
      thumb: "assets/imagens/thumb-teaser.jpg",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      public: true },
    { id: "tr1", title: "Trailer Cinematográfico", category: "trailer", duration: "1:42",
      thumb: "assets/imagens/thumb-trailer.jpg",
      url: "https://player.vimeo.com/video/76979871",
      public: true },
    // EXCLUSIVE
    { id: "f1", title: "Filme Completo", category: "filme", duration: "14:10",
      thumb: "assets/imagens/thumb-filme.jpg",
      url: "assets/imagens/sample.mp4", // se for MP4 local
      public: false },
    { id: "m1", title: "Making Of – Preparativos", category: "makingof", duration: "5:33",
      thumb: "assets/imagens/thumb-makingof.jpg",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      public: false },
    { id: "r1", title: "Reels – Momentos", category: "reels", duration: "0:30",
      thumb: "assets/imagens/thumb-reels.jpg",
      url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      public: true }
  ]
};

// ======================
// ESTADO
// ======================
const STATE = {
  logged: false
};

// ======================
// BOOT
// ======================
document.addEventListener("DOMContentLoaded", () => {
  // Carrega estado do login
  STATE.logged = localStorage.getItem("ef_logged") === "true";

  // Cabeçalho / hero
  setText("coupleName", CONFIG.couple.name);
  setText("tagline", CONFIG.couple.tagline);
  setText("coupleNameHero", CONFIG.couple.name);
  setText("taglineHero", `"${CONFIG.couple.tagline}"`);

  // Renderiza rails
  renderRails();

  // Modais
  setupLoginModal();
  setupPlayerModal();
});

// ======================
// RENDERIZAÇÃO
// ======================
function renderRails(){
  const rails = document.getElementById("rails");
  rails.innerHTML = "";
  CONFIG.categories.forEach(cat => {
    const rail = document.createElement("section");
    rail.className = "rail";
    rail.innerHTML = `<h2>${cat.title}</h2><div class="scroller" id="rail-${cat.id}"></div>`;
    rails.appendChild(rail);

    const scroller = rail.querySelector(".scroller");
    CONFIG.videos.filter(v => v.category === cat.id).forEach(v => {
      const isLocked = !v.public && !STATE.logged;
      const tile = document.createElement("article");
      tile.className = "tile";
      tile.innerHTML = `
        <span class="badge">${v.duration}</span>
        <img src="${v.thumb}" alt="${v.title}">
        <div class="tile-body">
          <div class="title">${v.title}</div>
          <div class="meta">${cat.title}</div>
        </div>
        ${isLocked ? `<div class="lock"><span>🔒 Exclusivo dos noivos</span></div>` : ""}
      `;
      tile.addEventListener("click", () => {
        if (isLocked) { openLogin(); return; }
        openPlayer(v);
      });
      scroller.appendChild(tile);
    });
  });
}

// ======================
// PLAYER
// ======================
let playerModal, playerArea, playerTitle, playerInfo, closePlayerBtn;
function setupPlayerModal(){
  playerModal = document.getElementById("playerModal");
  playerArea = document.getElementById("playerArea");
  playerTitle = document.getElementById("playerTitle");
  playerInfo = document.getElementById("playerInfo");
  closePlayerBtn = document.getElementById("closePlayer");

  closePlayerBtn.addEventListener("click", closePlayer);
  playerModal.addEventListener("click", (e)=>{ if(e.target === playerModal) closePlayer(); });
}

function openPlayer(video){
  playerTitle.textContent = video.title;
  playerInfo.textContent = CONFIG.categories.find(c => c.id === video.category)?.title || "";
  // decide: iframe (YT/Vimeo) ou <video>
  if (/youtube\.com|youtu\.be|vimeo\.com/i.test(video.url)){
    playerArea.innerHTML = `<iframe src="${video.url}" allow="autoplay; fullscreen" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  } else if (/\.mp4($|\?)/i.test(video.url)) {
    playerArea.innerHTML = `<video src="${video.url}" controls playsinline></video>`;
  } else {
    playerArea.innerHTML = `<div style="display:grid;place-items:center;height:100%;color:#ccc">URL inválida</div>`;
  }
  playerModal.style.display = "flex";
}

function closePlayer(){
  playerModal.style.display = "none";
  playerArea.innerHTML = "";
}

// ======================
/* LOGIN NOIVOS */
// ======================
let loginModal, openLoginBtn, closeLoginBtn, loginForm, loginStatus;
function setupLoginModal(){
  loginModal = document.getElementById("loginModal");
  openLoginBtn = document.getElementById("openLogin");
  closeLoginBtn = document.getElementById("closeLogin");
  loginForm = document.getElementById("loginForm");
  loginStatus = document.getElementById("loginStatus");

  openLoginBtn.addEventListener("click", openLogin);
  closeLoginBtn.addEventListener("click", closeLogin);
  loginModal.addEventListener("click", (e)=>{ if(e.target === loginModal) closeLogin(); });

  loginForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    const input = document.getElementById("password").value.trim();
    if (input === CONFIG.couple.password){
      STATE.logged = true;
      localStorage.setItem("ef_logged", "true");
      loginStatus.textContent = "Acesso liberado! Conteúdo exclusivo desbloqueado.";
      setTimeout(()=>{
        closeLogin();
        renderRails();
      }, 600);
    } else {
      loginStatus.textContent = "Senha incorreta. Tente novamente.";
    }
  });
}

function openLogin(){ loginModal.style.display = "flex"; }
function closeLogin(){ loginModal.style.display = "none"; loginStatus.textContent = ""; }

// ======================
// UTILS
// ======================
function setText(id, text){ const el=document.getElementById(id); if(el) el.textContent = text; }

/////////////////////////////////////////////////////////////

const galleries = document.querySelectorAll(".container"); // cada seção

galleries.forEach(gallery => {
const controls = gallery.querySelectorAll(".control");
const items = gallery.querySelectorAll(".item");
let currentItem = 0;
const maxItems = items.length;

controls.forEach(control => {
  control.addEventListener("click", e => {
    e.preventDefault(); // impede comportamento padrão
    const isLeft = control.classList.contains("arrow-left");

    if (isLeft) {
      currentItem -= 1;
    } else {
      currentItem += 1;
    }

    if (currentItem >= maxItems) currentItem = 0;
    if (currentItem < 0) currentItem = maxItems - 1;

    items.forEach(item => item.classList.remove("current-item"));

    items[currentItem].scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"// garante que não mexa na v ertical
    });

    items[currentItem].classList.add("current-item");
  });
});
});
/* =========================================================
 ACRESCIMO: Lightbox para fotos das galerias (sem alterar
 seu HTML nem as funções existentes)
 ========================================================= */
(function(){
// injeta o modal de fotos somente se não existir
function ensurePhotoModal(){
  if (document.getElementById('photoModal')) return;

  const modal = document.createElement('div');
  modal.id = 'photoModal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" id="closePhotoX" aria-label="Fechar">&times;</button>
      <div class="player-area" id="photoArea"></div>
    </div>
  `;
  document.body.appendChild(modal);

  // estilo mínimo para a imagem caber bem (sem mexer no seu CSS)
  const style = document.createElement('style');
  style.textContent = `
    #photoArea img{
      width:100%;
      height:auto;
      max-height:80vh;
      object-fit:contain;
      border-radius:12px;
    }
  `;
  document.head.appendChild(style);

  // fechar no X ou clicando fora
  document.getElementById('closePhotoX').addEventListener('click', closePhoto);
  modal.addEventListener('click', (e)=>{ if(e.target === modal) closePhoto(); });
}

function openPhotoBySrc(src, alt=''){
  ensurePhotoModal();
  const area = document.getElementById('photoArea');
  area.innerHTML = `<img src="${src}" alt="${alt}">`;
  document.getElementById('photoModal').style.display = 'flex';
}

function closePhoto(){
  const modal = document.getElementById('photoModal');
  if (!modal) return;
  modal.style.display = 'none';
  const area = document.getElementById('photoArea');
  if (area) area.innerHTML = '';
}

// delegação: qualquer clique em .gallery .item abre a foto
document.addEventListener('click', function(e){
  const img = e.target.closest('.gallery .item');
  if (!img) return;
  e.preventDefault();
  openPhotoBySrc(img.getAttribute('src'), img.getAttribute('alt') || '');
});

// ESC fecha o modal
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape') closePhoto();
});
})();

