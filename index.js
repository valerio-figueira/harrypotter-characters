const URL = 'http://hp-api.herokuapp.com/api/characters';
const characters = await fetchCharacters();

async function fetchCharacters(){
    return fetch(URL).then(response => {
        if(response.status >= 200 && response.status < 300){
            console.log('Status code: ' + response.status)
            return response.json();
        };
        console.error('Something goes wrong, error: ' + response.status);
    });
};

function renderCharacters(characters, start = 0, end = 10){
    document.querySelector('.gallery').innerHTML = 
    characters.slice(start, end).map(character => {
        return `
        <section class="character">
            <h2 class="name">${character.name}</h2>
            <div class="box">
                <img src="${character.image}" alt="${character.name}" class="character-img">
            </div>
            <p class="house">${character.house}</p>
        </section>
        `;
    }).join('');
    openPopup();
    searchController();
};

const index = 10;
var start = 0; var end = index;
const pagesCount = Math.ceil(characters.length / index);
const prev = document.querySelector('.prev-btn');
const next = document.querySelector('.next-btn');

renderCharacters(characters);
searchEngine();

prev.addEventListener('click', () => pagesController(start -= index, end -= index));
next.addEventListener('click', () => pagesController(start += index, end += index));

function pagesController(start, end){    
    if(start < 0){
        start = 0; end = 10; 
        prev.disabled = true;
        next.disabled = false;   
    } else if(end > characters.length){
        start = characters.length - 10; end = characters.length;
        prev.disabled = false;
        next.disabled = true;
    } else{
        prev.disabled = false;
        next.disabled = false;
    }
    searchController();
    renderCharacters(characters, start, end);    
    window.open('#header', '_self');
};

function openPopup(){
    const popup = document.querySelector('.popup');
    const gallery = document.querySelector('.gallery');
    document.querySelectorAll('.character')
    .forEach(character => {
        character.addEventListener('click', (e) => {
            if(e.target.matches('.character-img')){
                if(popup.firstElementChild){
                    popup.firstElementChild.remove();
                };
                popup.appendChild(createPopupImage(e.target));
                if(!popup.matches('.open')){
                    popup.classList.add('open');
                    popup.addEventListener('click', (e) => {
                        if(!e.target.matches('.character-img')){
                            popup.classList.remove('open');
                            gallery.style.filter = 'blur(0)';
                        };
                    }); gallery.style.filter = 'blur(2px)';
                };
            };
        });
    });
};

function createPopupImage(image){
    const img = document.createElement('img');
    img.src = image.src;
    img.alt = image.alt;
    img.className = image.className;
    return img;
};


function searchController(){
    const searchBtn = document.querySelector('.search-btn');
    const searchBar = document.querySelector('.search-bar');
    
    searchBtn.addEventListener('click', () => {
        if(!searchBar.matches('.open')){
            searchBar.classList.add('open');
            document.addEventListener('click', e => {
                if(!e.target.matches('.search-btn')){
                    if(!e.target.matches('.search-bar')){
                        if(!e.target.matches('#search-input')){
                            searchBar.classList.remove('open');
                        };
                    };
                };
            });
        } else{
            searchBar.classList.remove('open');
        };
    });
}


function searchEngine(){
    const searchInput = document.querySelector('#search-input');

    searchInput.addEventListener('keyup', (e) => {
        const lowerCaseInput = e.target.value.toLowerCase();
        const filteredCharacters = characters.filter(character => {
            const lowerCaseCharacter = character.name.toLowerCase();
            return lowerCaseCharacter.includes(lowerCaseInput);
        });
        renderCharacters(filteredCharacters);
        start = 0; end = 10;
    });
};