const listaCarrinho = document.getElementById("listaCarrinho");
const subtotalElemento = document.getElementById("subtotal");
const totalElemento = document.getElementById("total");
const btnFinalizar = document.getElementById("finalizarCompra");


/* =========================================
   PEGAR PREÇO CORRETO DO PRODUTO
========================================= */

function obterPrecoProduto(produto) {

    // Se estiver em oferta, usa o preço promocional
    if (
        produto.oferta === true &&
        produto.preçooferta !== undefined &&
        produto.preçooferta !== null
    ) {
        return Number(produto.preçooferta);
    }

    // Caso contrário, usa o preço normal
    return Number(produto.preço);
}


/* =========================================
   FORMATAR PREÇO
========================================= */

function formatarPreco(valor) {

    return `R$ ${Number(valor)
        .toFixed(2)
        .replace(".", ",")}`;
}


/* =========================================
   CARREGAR CARRINHO
========================================= */

function carregarCarrinho() {

    const carrinho =
        JSON.parse(localStorage.getItem("carrinho")) || [];

    listaCarrinho.innerHTML = "";


    // =====================================
    // CARRINHO VAZIO
    // =====================================

    if (carrinho.length === 0) {

        listaCarrinho.innerHTML = `
            <div class="carrinho-vazio">

                <i class="fa-solid fa-cart-shopping"></i>

                <h2>
                    Seu carrinho está vazio
                </h2>

                <p>
                    Adicione produtos para continuar sua compra.
                </p>

                <a href="produtos.html">
                    Ver produtos
                </a>

            </div>
        `;

        atualizarResumo();


        // Desativa o botão se não tiver produtos
        if (btnFinalizar) {
            btnFinalizar.disabled = true;
        }

        return;
    }


    // Libera o botão
    if (btnFinalizar) {
        btnFinalizar.disabled = false;
    }


    // =====================================
    // AGRUPAR PRODUTOS IGUAIS
    // =====================================

    const produtosAgrupados = {};


    carrinho.forEach(produto => {

        const id = String(produto.id);


        if (!produtosAgrupados[id]) {

            produtosAgrupados[id] = {
                produto: produto,
                quantidade: 1
            };

        } else {

            produtosAgrupados[id].quantidade++;

        }

    });


    // =====================================
    // MOSTRAR PRODUTOS
    // =====================================

    Object.values(produtosAgrupados).forEach(item => {

        const produto = item.produto;

        const quantidade = item.quantidade;

        const preco = obterPrecoProduto(produto);


        listaCarrinho.innerHTML += `

            <div class="item-carrinho">

                <img
                    src="${produto.urlimagem}"
                    alt="${produto.nome}"
                >


                <div class="info-produto">

                    <h3>
                        ${produto.nome}
                    </h3>


                    <div class="avaliacao">

                        ★★★★★

                        <span>
                            (0 avaliações)
                        </span>

                    </div>


                    <strong class="preco-produto">

                        ${formatarPreco(preco)}

                    </strong>

                </div>


                <div class="quantidade">

                    <button
                        type="button"
                        onclick="diminuirQuantidade(${produto.id})"
                    >
                        −
                    </button>


                    <span>
                        ${quantidade}
                    </span>


                    <button
                        type="button"
                        onclick="aumentarQuantidade(${produto.id})"
                    >
                        +
                    </button>

                </div>


                <button
                    type="button"
                    class="btn-remover"
                    onclick="removerDoCarrinho(${produto.id})"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        `;

    });


    atualizarResumo();
}


/* =========================================
   ATUALIZAR RESUMO
========================================= */

function atualizarResumo() {

    const carrinho =
        JSON.parse(localStorage.getItem("carrinho")) || [];


    let subtotal = 0;


    carrinho.forEach(produto => {

        subtotal += obterPrecoProduto(produto);

    });


    subtotalElemento.textContent =
        formatarPreco(subtotal);


    totalElemento.textContent =
        formatarPreco(subtotal);
}


/* =========================================
   AUMENTAR QUANTIDADE
========================================= */

function aumentarQuantidade(idProduto) {

    const carrinho =
        JSON.parse(localStorage.getItem("carrinho")) || [];


    const produto = carrinho.find(
        produto =>
            Number(produto.id) === Number(idProduto)
    );


    if (produto) {

        carrinho.push(produto);

    }


    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );


    carregarCarrinho();

    atualizarContadorCarrinho();
}


/* =========================================
   DIMINUIR QUANTIDADE
========================================= */

function diminuirQuantidade(idProduto) {

    const carrinho =
        JSON.parse(localStorage.getItem("carrinho")) || [];


    const indice = carrinho.findIndex(
        produto =>
            Number(produto.id) === Number(idProduto)
    );


    if (indice !== -1) {

        carrinho.splice(indice, 1);

    }


    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );


    carregarCarrinho();

    atualizarContadorCarrinho();
}


/* =========================================
   REMOVER PRODUTO
========================================= */

function removerDoCarrinho(idProduto) {

    let carrinho =
        JSON.parse(localStorage.getItem("carrinho")) || [];


    carrinho = carrinho.filter(
        produto =>
            Number(produto.id) !== Number(idProduto)
    );


    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );


    carregarCarrinho();

    atualizarContadorCarrinho();
}


/* =========================================
   FINALIZAR COMPRA
========================================= */

if (btnFinalizar) {

    btnFinalizar.addEventListener("click", function () {

        const carrinho =
            JSON.parse(localStorage.getItem("carrinho")) || [];


        // Não deixa continuar com carrinho vazio
        if (carrinho.length === 0) {

            alert("Seu carrinho está vazio.");

            return;
        }


        // =====================================
        // VAI PARA O CHECKOUT
        // =====================================

        window.location.href = "span.html";

    });

}


/* =========================================
   INICIAR
========================================= */

carregarCarrinho();