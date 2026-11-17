// JSON fixo por enquanto
const categorias = [
    {
        id: 1,
        nome: "Mouses",
        descricao: "Celulares, televisores e eletrônicos em geral",
        imagem: "assets/imagens/mouselogitech.png",
        href: "produtos.html?categoria=1"
    },
    {
        id: 2,
        nome: "Monitores",
        descricao: "Monitores, Notebooks, computadores e acessórios",
        imagem: "assets/imagens/monitor.png",
        href: "produtos.html?categoria=2"
    },
    {
        id: 3,
        nome: "Fones",
        descricao: "Smartphones e acessórios",
        imagem: "assets/imagens/Fone razer.png",
        href: "produtos.html?categoria=3"
    },
    {
        id: 4,
        nome: "Teclados",
        descricao: "Móveis para casa e escritório",
        imagem: "assets/imagens/tecladoredragao.png",
        href: "produtos.html?categoria=4"
    },
    {
        id: 5,
        nome: "Controles",
        descricao: "Jogos, consoles e acessórios",
        imagem: "assets/imagens/controleps5.png",
        href: "produtos.html?categoria=5"
    }
];


// =========================================
// CARREGAR CATEGORIAS
// =========================================

const listaCategorias =
    document.getElementById("listaCategorias");


if (listaCategorias) {

    categorias.forEach(categoria => {

        listaCategorias.innerHTML += `

            <a
                href="${categoria.href}"
                class="categoria-card"
            >

                <img
                    src="${categoria.imagem}"
                    alt="${categoria.nome}"
                >

                <p>
                    ${categoria.nome}
                </p>

            </a>

        `;

    });

}
