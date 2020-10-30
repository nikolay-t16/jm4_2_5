const itemsNode: HTMLElement = document.querySelector('.js-index__items');
const form: HTMLFormElement = document.querySelector('.index__form');
const search: HTMLInputElement = document.querySelector('.js-index__form-input');
const searchItems = document.querySelector('.js-index__form-results');
const removeHandler = (node: HTMLElement) => node.parentElement.remove();
const addItem = ({name, owner, stars}) => {
    const newNode = document.createRange().createContextualFragment(
        `<div class="index__items-item">
        <ul class="index__items-item-data">
            <li>Name: ${name} </li>
            <li>Owner: ${owner} </li>
            <li>Stars: ${stars} </li>
        </ul>
        <button class="index__items-item-close js-index__items-item-close" type="button" onclick="removeHandler(this)">
            <img src="close.svg" alt="close" width="42"/>
        </button>
    </div>`
    );
    itemsNode.append(newNode);
    search.value = "";
    searchItems.innerHTML = '';
};

const addSearchItem = ({name, owner, stars}) => {
    const node: HTMLButtonElement = document.createElement('button');
    node.classList.add('index__form-results-item', 'js-index__form-results-item');
    node.type = 'button';
    node.onclick = () => addItem({name, owner, stars, node});
    node.innerText = name;
    searchItems.append(node);
}

const searchHandler = async (search: string) => {
    if (search.trim() === "") {
        searchItems.innerHTML = '';
        return;
    }
    try {
        const res = await fetch(`https://api.github.com/search/repositories?q=${search}`);
        searchItems.innerHTML = '';
        if (res.ok) {
            let json = await res.json();
            for (let i = 0; i < (json.items.length < 5 ? json.items.length : 5); i++) {
                const itemToAdd = json.items[i];
                addSearchItem({name: itemToAdd.name, owner: itemToAdd.owner?.login, stars: itemToAdd.stargazers_count});
            }
        } else {
            console.log("Ошибка HTTP: " + res.status);
        }
    } catch (e) {
        console.log(e);
    }
}

const debounce = (fn: any, debounceTime): any => {
    let timer = null;
    return function (...params) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => fn.apply(this, params), debounceTime);
    };

};
const debounceSearch = debounce(searchHandler, 1000);
form.onsubmit = (e) => {
    e.preventDefault();
    debounceSearch(search.value);
}

search.onchange = () => debounceSearch(search.value);
search.onkeyup = () => debounceSearch(search.value);
