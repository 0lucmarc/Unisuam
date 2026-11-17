const listaProdutos = document.getElementById("listaProdutos");

let produtosDaLoja = [...produtos];

const produtosSalvos =
    JSON.parse(localStorage.getItem("produtos")) || [];

produtosDaLoja = [
    ...produtosDaLoja,
    ...produtosSalvos
];


// Texto que mostra qual filtro está selecionado
const filtroAtual =
    document.querySelector(".filtro-atual strong");


// =========================================
// NOMES DAS CATEGORIAS
// =========================================

const nomesCategorias = {
    1: "Mouses",
    2: "Monitores",
    3: "Fones",
    4: "Teclados",
    5: "Controles"
};


// =========================================
// MOSTRAR PRODUTOS
// =========================================

function mostrarProdutos(categoriaSelecionada = "todos") {

    listaProdutos.innerHTML = "";

    let quantidadeEncontrada = 0;


    produtosDaLoja.forEach(produto => {

        // Verifica a categoria selecionada
        if (
            categoriaSelecionada !== "todos" &&
            Number(produto.idcategoria) !==
            Number(categoriaSelecionada)
        ) {
            return;
        }


        quantidadeEncontrada++;


        // =========================================
        // PREÇO NORMAL OU PREÇO DE OFERTA
        // =========================================

        let precoHTML = "";


        if (produto.oferta === true) {

            // Produto em promoção
            precoHTML = `
                <span class="preco-antigo">
                    R$ ${Number(produto.preço)
                        .toFixed(2)
                        .replace(".", ",")}
                </span>

                <strong>
                    R$ ${Number(produto.preçooferta)
                        .toFixed(2)
                        .replace(".", ",")}
                </strong>
            `;

        } else {

            // Produto sem promoção
            precoHTML = `
                <strong>
                    R$ ${Number(produto.preço)
                        .toFixed(2)
                        .replace(".", ",")}
                </strong>
            `;
        }


        // =========================================
        // CRIA O CARD DO PRODUTO
        // =========================================

        listaProdutos.innerHTML += `
            <div
                class="produto-card"
                onclick="abrirProduto(${produto.id})"
            >

                <img
                    src="${produto.urlimagem}"
                    alt="${produto.nome}"
                >

                <h3>
                    ${produto.nome}
                </h3>

                <div class="avaliacao">
                    ★★★★★
                    <span>(0 avaliações)</span>
                </div>

                <div class="preco">
                    ${precoHTML}
                </div>

                <button
                    class="btn-carrinho"
                    onclick="
                        event.stopPropagation();
                        adicionarAoCarrinho(${produto.id});
                    "
                >
                    🛒 Adicionar ao carrinho
                </button>

            </div>
        `;
    });


    // =========================================
    // NENHUM PRODUTO ENCONTRADO
    // =========================================

    if (quantidadeEncontrada === 0) {

        listaProdutos.innerHTML = `
            <div class="nenhum-produto">
                <p>
                    Nenhum produto encontrado
                    nesta categoria.
                </p>
            </div>
        `;
    }
}


// =========================================
// PEGAR CATEGORIA DA URL
// =========================================

const parametrosURL =
    new URLSearchParams(window.location.search);

const categoriaURL =
    parametrosURL.get("categoria");


// =========================================
// MOSTRAR PRODUTOS AO ABRIR
// =========================================

if (categoriaURL) {

    // Exemplo:
    // produtos.html?categoria=4

    mostrarProdutos(categoriaURL);


    // Atualiza o texto do filtro
    if (filtroAtual) {

        filtroAtual.textContent =
            nomesCategorias[categoriaURL] ||
            "Todos os produtos";
    }

} else {

    // Se não tiver categoria na URL,
    // mostra todos normalmente

    mostrarProdutos("todos");


    if (filtroAtual) {

        filtroAtual.textContent =
            "Todos os produtos";
    }
}


// =========================================
// FILTROS
// =========================================

const botoesFiltro =
    document.querySelectorAll(".filtros button");


botoesFiltro.forEach(botao => {

    botao.addEventListener("click", () => {

        const categoria =
            botao.dataset.categoria;


        // Mostra os produtos da categoria
        mostrarProdutos(categoria);


        // Atualiza o texto do filtro
        if (filtroAtual) {

            filtroAtual.textContent =
                categoria === "todos"
                    ? "Todos os produtos"
                    : botao.textContent.trim();
        }


        // =====================================
        // ATUALIZA A URL SEM RECARREGAR
        // =====================================

        if (categoria === "todos") {

            window.history.replaceState(
                {},
                "",
                "produtos.html"
            );

        } else {

            window.history.replaceState(
                {},
                "",
                `produtos.html?categoria=${categoria}`
            );
        }

    });

});


// =========================================
// ABRIR PÁGINA DO PRODUTO
// =========================================

function abrirProduto(id) {

   window.location.href = `detalhes.html?id=${id}`;

}