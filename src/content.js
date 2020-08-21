var searching = false;

async function loadProfiles(ul) {

    // Obtém o título da janela.
    const h1 = document.querySelectorAll("h1")[1];
    const title = h1.innerText;

    // Obtém o elemento que possui o número de perfis da lista a serem carregados.
    const element = [...document.querySelectorAll("section ul li a")].filter((element) => {
        return element.innerText.toLowerCase().indexOf(title.toLowerCase()) !== -1;
    });

    // Obtém a quantidade de perfis da lista.
    const length = parseInt(element[0].children[0].innerText.replace(".", ""));

    // Verifica se a lista carregou por completo, ou usuário pediu a sua parada.
    while (searching && ul.querySelectorAll("li").length < length - 1) {

        // Rola até o final da lista.
        const items = ul.querySelectorAll("li");
        items[items.length - 1].scrollIntoView();

        // Informa quantos perfis foram carregados.
        h1.innerText = `${title} (loading... ${items.length})`;

        // Espera um tempo em segundos
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    h1.innerText = title;
}

function changeSearchStatus(button, status) {

    // Inicia ou para a busca.
    searching = status ? status : !searching;
    button.innerText = searching ? "Searching..." : "Search";

    return searching;
}

function createSearchBar(ul_element) {

    // Cria o elementos.
    const search_bar = document.createElement("div");
    const button = document.createElement("button");

    // Copia a barra de pesquisa do Instagram.
    const input = document.querySelector("nav input[type='text']").cloneNode(true);

    // Configura a DIV principal.
    search_bar.className = "following_search_bar";

    // Configura o input.
    input.className = "following_input";
    input.setAttribute("type", "text");

    // Configura o botão.
    button.className = "following_search_button";
    button.innerHTML = "Search";
    button.addEventListener("click", search);

    // Adiciona os elementos para a DIV principal.
    search_bar.appendChild(input);
    search_bar.appendChild(button);

    // Adiciona para a lista a barra de busca.
    ul_element.prepend(search_bar);
}

function getProfile() {
    
    // Retorna o nome de usuário da página atual.
    const username = document.title.match(/\(@(\S+)\)/)[1];
    return username;
}

function main() {

    // Obtém todos os elementos de UL e a barra de busca.
    const following_list = document.querySelector("[role='dialog'] ul");
    const search_bar = document.querySelector(".following_search_bar");

    // Verifica se o usuário clicou em "Followers" ou "Following" e se 
    // existe ou não uma search bar criada para a UL. Se não existir, ela será criada.
    if (following_list && !search_bar && document.querySelectorAll("h1").length === 2) {
        createSearchBar(following_list);
    }
}

function searchProfiles(ul, name) {

    // Obtém todos os perfis da lista.
    const profiles = [...ul.querySelectorAll("span")].map((element) => {
        return element.parentElement.parentElement;
    });

    // Obtém somente os perfis que possuem um determinado nome.
    const results = profiles.filter((profile) => {
        return profile.innerText.toLowerCase().indexOf(name) !== -1;
    });

    // Informa os resultados da busca.
    console.log("[ Search Results ]................................");

    // Obtém os items da lista que contém os resultados da busca.
    const items = results.map((profile) => {

        // Imprime no console o perfil encontrado.
        console.log("Found:" + profile.querySelector("a").href);

        // Verifica se o elemento é um item de lista.
        while (profile.tagName.toLowerCase() !== "li") {
            profile = profile.parentElement;
        }

        return profile;
    });

    // Fecha o campo que mostra os resutados da busca.
    console.log("..................................................");

    return items;
}

async function search() {

    // Obtém o botão que foi clicado, a lista e o nome que será procurado.
    const button = event.target;
    const list = event.target.parentElement.parentElement;
    const input = list.querySelector(".following_input");
    const username = input.value;

    // Troca a cor de todos os itens para branco.
    setBackgroundColor(list.querySelectorAll("li"), "rgb(255, 255, 255)");

    // Liga a busca.
    changeSearchStatus(button);

    // Desliga a busca.
    if (!username || !searching) {
        return changeSearchStatus(button, false);
    }

    // Carrega a lista por completo.
    await loadProfiles(list, username);

    // Obtém os perfis e troca a cor de background deles.
    const profiles = searchProfiles(list, username);
    setBackgroundColor(profiles, "rgb(0, 220, 0)");

    // Informa que a busca acabou.
    changeSearchStatus(button, false);

    // Move os resultados para o início da lista.
    profiles.forEach((profile) => {
        profile.parentElement.prepend(profile);
    });

    // Rola até o início.
    input.scrollIntoView();
}

function setBackgroundColor(elements, color) {

    // Percorre todos os elementos e define uma nova cor de background.
    elements.forEach((element) => {
        element.style.backgroundColor = color;
    });
}

setInterval(main, 500);
