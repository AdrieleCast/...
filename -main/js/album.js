const albumList = document.getElementById("albumList");
const albumDetail = document.getElementById("albumDetail");
const albumPhotos = document.getElementById("albumPhotos");
const albumTitle = document.getElementById("albumTitle");
const closeAlbum = document.getElementById("closeAlbum");
const voltarAlbuns = document.getElementById("voltar-albuns");

// Dados dos álbuns
const albumsData = {
    makingof: ["../assets/casal2.jpg", "../assets/casal2.jpg", "../assets/casal2.jpg"],
    cerimonia: ["../assets/casal2.jpg", "../assets/casal2.jpg"],
    festa: ["../assets/casal2.jpg", "../assets/casal2.jpg", "../assets/casal2.jpg", "../assets/casal2.jpg"]
};

// Função para abrir álbum
function abrirAlbum(nome) {
    albumTitle.textContent = nome === "makingof" ? "Making Of" : 
                             nome === "cerimonia" ? "Cerimônia" : "Festa";
    
    // Limpa fotos antigas
    albumPhotos.innerHTML = "";

    // Adiciona fotos do álbum
    albumsData[nome].forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        albumPhotos.appendChild(img);
    });

    // Mostra detalhes e esconde lista
    albumList.style.display = "none";
    albumDetail.style.display = "flex";
}

// Ao clicar em qualquer álbum
albumList.querySelectorAll(".album").forEach(album => {
    album.addEventListener("click", () => {
        abrirAlbum(album.dataset.album);
    });
});

// Botão fechar
closeAlbum.addEventListener("click", () => {
    albumDetail.style.display = "none";
    albumList.style.display = "flex";
});

// Menu "Álbuns" também volta à lista
voltarAlbuns.addEventListener("click", (e) => {
    e.preventDefault();
    albumDetail.style.display = "none";
    albumList.style.display = "flex";
});
