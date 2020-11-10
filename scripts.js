var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const itemsNode = document.querySelector('.js-index__items');
const form = document.querySelector('.index__form');
const search = document.querySelector('.js-index__form-input');
const searchItems = document.querySelector('.js-index__form-results');
const removeHandler = (node) => node.parentElement.remove();
const addItem = ({ name, owner, stars }) => {
    const newNode = document.createRange().createContextualFragment(`<div class="index__items-item">
        <ul class="index__items-item-data">
            <li>Name: ${name}</li>
            <li>Owner: ${owner}</li>
            <li>Stars: ${stars}</li>
        </ul>
        <button class="index__items-item-close js-index__items-item-close" type="button" onclick="removeHandler(this)">
            <img src="close.svg" alt="close" width="42"/>
        </button>
    </div>`);
    itemsNode.append(newNode);
    search.value = "";
    searchItems.innerHTML = '';
};
const addSearchItem = ({ name, owner, stars }) => {
    const node = document.createElement('button');
    node.classList.add('index__form-results-item', 'js-index__form-results-item');
    node.type = 'button';
    node.onclick = () => addItem({ name, owner, stars });
    node.innerText = name;
    searchItems.append(node);
};
const searchHandler = (search) => __awaiter(this, void 0, void 0, function* () {
    var _a;
    if (search.trim() === "") {
        searchItems.innerHTML = '';
        return;
    }
    try {
        const res = yield fetch(`https://api.github.com/search/repositories?q=${search}`);
        searchItems.innerHTML = '';
        if (res.ok) {
            let json = yield res.json();
            for (let i = 0; i < (json.items.length < 5 ? json.items.length : 5); i++) {
                const itemToAdd = json.items[i];
                addSearchItem({ name: itemToAdd.name, owner: (_a = itemToAdd.owner) === null || _a === void 0 ? void 0 : _a.login, stars: itemToAdd.stargazers_count });
            }
        }
        else {
            console.log("Ошибка HTTP: " + res.status);
        }
    }
    catch (e) {
        console.log(e);
    }
});
const debounce = (fn, debounceTime) => {
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
};
search.oninput = () => debounceSearch(search.value);
