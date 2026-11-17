// =========================================
// SPAN GAMES
// DETALHES DO PRODUTO
// =========================================


// =========================================
// PEGAR ID DA URL
// =========================================

const parametros =
    new URLSearchParams(window.location.search);

const idProduto =
    Number(parametros.get("id"));


// =========================================
// PRODUTOS FIXOS + PRODUTOS CADASTRADOS
// =========================================

const produtosSalvos =
    JSON.parse(localStorage.getItem("produtos")) || [];

const todosProdutos = [
    ...produtos,
    ...produtosSalvos
];


// =========================================
// PROCURAR PRODUTO
// =========================================

const produtoSelecionado =
    todosProdutos.find(
        produto =>
            Number(produto.id) === idProduto
    );


// =========================================
// ELEMENTOS DA PÁGINA
// =========================================

const nomeProduto =
    document.getElementById("nomeProduto");

const nomeCaminho =
    document.getElementById("nomeCaminho");

const imagemProduto =
    document.getElementById("imagemProduto");

const miniaturaPrincipal =
    document.getElementById("miniaturaPrincipal");

const categoriaProduto =
    document.getElementById("categoriaProduto");

const categoriaInformacao =
    document.getElementById("categoriaInformacao");

const resumoProduto =
    document.getElementById("resumoProduto");

const descricaoProduto =
    document.getElementById("descricaoProduto");

const precoAntigo =
    document.getElementById("precoAntigo");

const precoProduto =
    document.getElementById("precoProduto");

const estoqueProduto =
    document.getElementById("estoqueProduto");

const estoqueInformacao =
    document.getElementById("estoqueInformacao");

const codigoProduto =
    document.getElementById("codigoProduto");

const quantidadeElemento =
    document.getElementById("quantidadeProduto");

const btnDiminuir =
    document.getElementById("diminuirQuantidadeProduto");

const btnAumentar =
    document.getElementById("aumentarQuantidadeProduto");

const btnAdicionar =
    document.getElementById("adicionarCarrinho");

const btnComprar =
    document.getElementById("comprarAgora");

const produtosRelacionados =
    document.getElementById("produtosRelacionados");


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
// QUANTIDADE
// =========================================

let quantidade = 1;


// =========================================
// FORMATAR PREÇO
// =========================================

function formatarPreco(valor) {

    return `R$ ${Number(valor)
        .toFixed(2)
        .replace(".", ",")}`;
}


// =========================================
// PEGAR PREÇO CORRETO
// =========================================

function obterPreco(produto) {

    if (
        produto.oferta === true &&
        produto.preçooferta !== undefined &&
        produto.preçooferta !== null
    ) {

        return Number(produto.preçooferta);
    }

    return Number(produto.preço);
}


// =========================================
// PRODUTO NÃO ENCONTRADO
// =========================================

function produtoNaoEncontrado() {

    const pagina =
        document.querySelector(".pagina-detalhes");

    if (!pagina) {
        return;
    }

    pagina.innerHTML = `
        <div class="produto-nao-encontrado">

            <i class="fa-solid fa-box-open"></i>

            <h2>
                Produto não encontrado
            </h2>

            <p>
                Não foi possível encontrar esse produto.
            </p>

            <a href="produtos.html">
                Voltar para produtos
            </a>

        </div>
    `;
}


// =========================================
// CARREGAR PRODUTO
// =========================================

function carregarProduto() {

    if (!produtoSelecionado) {

        produtoNaoEncontrado();

        return;
    }


    // =====================================
    // NOME
    // =====================================

    nomeProduto.textContent =
        produtoSelecionado.nome;

    nomeCaminho.textContent =
        produtoSelecionado.nome;


    // Atualiza título da aba

    document.title =
        `${produtoSelecionado.nome} | SPAN Games`;


    // =====================================
    // IMAGEM
    // =====================================

    imagemProduto.src =
        produtoSelecionado.urlimagem;

    imagemProduto.alt =
        produtoSelecionado.nome;

    miniaturaPrincipal.src =
        produtoSelecionado.urlimagem;

    miniaturaPrincipal.alt =
        produtoSelecionado.nome;


    // =====================================
    // CATEGORIA
    // =====================================

    const nomeCategoria =
        nomesCategorias[
            Number(produtoSelecionado.idcategoria)
        ] || "Produto";

    categoriaProduto.textContent =
        nomeCategoria;

    categoriaInformacao.textContent =
        nomeCategoria;


    // =====================================
    // DESCRIÇÃO
    // =====================================

    const descricao =
        produtoSelecionado.descrição ||
        "Confira todos os detalhes deste produto na SPAN Games.";


    // A descrição aparece somente
    // na seção "Sobre o produto"

    if (descricaoProduto) {

        descricaoProduto.textContent =
            descricao;
    }


    // Remove o resumo duplicado
    // da parte superior da página

    if (resumoProduto) {

        resumoProduto.style.display =
            "none";
    }


    // =====================================
    // PREÇO
    // =====================================

    if (produtoSelecionado.oferta === true) {

        precoAntigo.textContent =
            formatarPreco(
                produtoSelecionado.preço
            );

        precoProduto.textContent =
            formatarPreco(
                produtoSelecionado.preçooferta
            );

    } else {

        precoAntigo.textContent = "";

        precoProduto.textContent =
            formatarPreco(
                produtoSelecionado.preço
            );
    }


    // =====================================
    // ESTOQUE
    // =====================================

    const estoque =
        Number(
            produtoSelecionado.quantidadedeestoque
        ) || 0;


    if (estoque > 0) {

        estoqueProduto.textContent =
            `${estoque} unidades disponíveis`;

        estoqueInformacao.textContent =
            `${estoque} unidades`;

    } else {

        estoqueProduto.textContent =
            "Produto indisponível";

        estoqueInformacao.textContent =
            "Sem estoque";

        btnAdicionar.disabled = true;

        btnComprar.disabled = true;
    }


    // =====================================
    // CÓDIGO
    // =====================================

    codigoProduto.textContent =
        `SPAN-${String(produtoSelecionado.id)
            .padStart(4, "0")}`;


    // =====================================
    // RELACIONADOS
    // =====================================

    carregarRelacionados();
}


// =========================================
// AUMENTAR QUANTIDADE
// =========================================

btnAumentar.addEventListener(
    "click",
    function () {

        if (!produtoSelecionado) {
            return;
        }

        const estoque =
            Number(
                produtoSelecionado.quantidadedeestoque
            ) || 0;

        if (quantidade < estoque) {

            quantidade++;

            quantidadeElemento.textContent =
                quantidade;
        }
    }
);


// =========================================
// DIMINUIR QUANTIDADE
// =========================================

btnDiminuir.addEventListener(
    "click",
    function () {

        if (quantidade > 1) {

            quantidade--;

            quantidadeElemento.textContent =
                quantidade;
        }
    }
);


// =========================================
// ADICIONAR AO CARRINHO
// =========================================

btnAdicionar.addEventListener(
    "click",
    function () {

        if (!produtoSelecionado) {
            return;
        }

        let carrinho =
            JSON.parse(
                localStorage.getItem("carrinho")
            ) || [];


        // Adiciona conforme a quantidade escolhida

        for (
            let i = 0;
            i < quantidade;
            i++
        ) {

            carrinho.push(
                produtoSelecionado
            );
        }


        localStorage.setItem(
            "carrinho",
            JSON.stringify(carrinho)
        );


        // Atualiza contador do header

        if (
            typeof atualizarContadorCarrinho ===
            "function"
        ) {

            atualizarContadorCarrinho();
        }


        // Usa a notificação do carrinho.js

        if (
            typeof mostrarNotificacaoCarrinho ===
            "function"
        ) {

            mostrarNotificacaoCarrinho(
                produtoSelecionado.nome
            );
        }
    }
);


// =========================================
// COMPRAR AGORA
// =========================================

btnComprar.addEventListener(
    "click",
    function () {

        if (!produtoSelecionado) {
            return;
        }

        let carrinho =
            JSON.parse(
                localStorage.getItem("carrinho")
            ) || [];


        // Adiciona o produto na quantidade
        // selecionada

        for (
            let i = 0;
            i < quantidade;
            i++
        ) {

            carrinho.push(
                produtoSelecionado
            );
        }


        localStorage.setItem(
            "carrinho",
            JSON.stringify(carrinho)
        );


        // Vai direto para o checkout

        window.location.href =
            "span.html";
    }
);


// =========================================
// PRODUTOS RELACIONADOS
// =========================================

function carregarRelacionados() {

    if (!produtoSelecionado) {
        return;
    }

    produtosRelacionados.innerHTML = "";


    // Primeiro tenta pegar produtos
    // da mesma categoria

    let relacionados =
        todosProdutos.filter(
            produto =>
                Number(produto.id) !==
                    Number(produtoSelecionado.id) &&

                Number(produto.idcategoria) ===
                    Number(produtoSelecionado.idcategoria)
        );


    // Se tiver poucos produtos da mesma
    // categoria, completa com outros

    if (relacionados.length < 4) {

        const outrosProdutos =
            todosProdutos.filter(
                produto =>
                    Number(produto.id) !==
                        Number(produtoSelecionado.id) &&

                    !relacionados.some(
                        relacionado =>
                            Number(relacionado.id) ===
                            Number(produto.id)
                    )
            );

        relacionados = [
            ...relacionados,
            ...outrosProdutos
        ];
    }


    // Mostra no máximo 4

    relacionados =
        relacionados.slice(0, 4);


    relacionados.forEach(produto => {

        const preco =
            obterPreco(produto);

        produtosRelacionados.innerHTML += `
            <div
                class="relacionado-card"
                onclick="abrirProdutoRelacionado(${produto.id})"
            >

                <img
                    src="${produto.urlimagem}"
                    alt="${produto.nome}"
                >

                <h3>
                    ${produto.nome}
                </h3>

                <strong class="preco-relacionado">
                    ${formatarPreco(preco)}
                </strong>

            </div>
        `;
    });
}


// =========================================
// ABRIR PRODUTO RELACIONADO
// =========================================

function abrirProdutoRelacionado(id) {

    window.location.href =
        `detalhes.html?id=${id}`;
}


// =========================================
// INICIAR
// =========================================

carregarProduto();