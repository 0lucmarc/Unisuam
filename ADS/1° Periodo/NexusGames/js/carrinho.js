
/* =========================================
   SPAN GAMES - PROTEGER CARRINHO
========================================= */

function protegerCarrinho() {

    let usuarioLogado = null;

    try {
        usuarioLogado = JSON.parse(
            localStorage.getItem("usuarioLogado") || "null"
        );
    } catch (erro) {
        console.error("Erro ao verificar login:", erro);
    }

    if (!usuarioLogado) {

        localStorage.setItem(
            "redirecionarAposLogin",
            "carrinho.html"
        );

        window.location.replace(
            "erro-pagamento-login.html"
        );

        return false;
    }

    return true;
}





// =========================================
// ADICIONAR PRODUTO AO CARRINHO
// =========================================

function adicionarAoCarrinho(idProduto) {

    // Produtos cadastrados pelo usuário
    const produtosSalvos =
        JSON.parse(localStorage.getItem("produtos")) || [];

    // Procura nos produtos cadastrados
    const produtoSalvo = produtosSalvos.find(
        produto => String(produto.id) === String(idProduto)
    );

    // Procura nos produtos fixos
    const produtoFixo = produtos.find(
        produto => String(produto.id) === String(idProduto)
    );

    const produto = produtoSalvo || produtoFixo;

    if (!produto) {
        console.error(
            "Produto não encontrado:",
            idProduto
        );
        return;
    }

    // Preços do produto
    const precoNormal = Number(
        produto.preço ?? produto.preco ?? 0
    );

    const precoOferta = Number(
        produto.preçooferta ??
        produto.precoOferta ??
        produto.precooferta ??
        0
    );

    const temOferta =
        (produto.oferta === true ||
         produto.oferta === "true") &&
        precoOferta > 0 &&
        precoOferta < precoNormal;

    // Salva somente os dados necessários.
    // Não duplica imagens Base64 no carrinho.
    const produtoCarrinho = {
        id: produto.id,
        nome: produto.nome,
        preço: precoNormal,
        preçooferta: temOferta ? precoOferta : 0,
        oferta: temOferta,

        // Mantém imagens pequenas ou URLs normais.
        // Imagens Base64 serão recuperadas do catálogo.
        urlimagem:
            typeof produto.urlimagem === "string" &&
            produto.urlimagem.startsWith("data:")
                ? ""
                : (produto.urlimagem || "")
    };

    const carrinho =
        JSON.parse(localStorage.getItem("carrinho")) || [];

    carrinho.push(produtoCarrinho);

    try {
        localStorage.setItem(
            "carrinho",
            JSON.stringify(carrinho)
        );
    } catch (erro) {
        console.error(
            "Não foi possível salvar o carrinho:",
            erro
        );

        alert(
            "O armazenamento está cheio. Não foi possível adicionar o produto."
        );
        return;
    }

    atualizarContadorCarrinho();

    mostrarNotificacaoCarrinho(produto.nome);
}

// =========================================
// ATUALIZAR CONTADOR DO CARRINHO
// =========================================

function atualizarContadorCarrinho() {

    const carrinho =
        JSON.parse(localStorage.getItem("carrinho")) || [];


    const contador =
        document.getElementById("contadorCarrinho");


    if (contador) {

        contador.textContent =
            carrinho.length;
    }
}



// =========================================
// ATUALIZA AO CARREGAR A PÁGINA
// =========================================

atualizarContadorCarrinho();

function mostrarNotificacaoCarrinho(nomeProduto) {

    // Remove uma notificação anterior
    const notificacaoAntiga =
        document.querySelector(".notificacao-carrinho");

    if (notificacaoAntiga) {
        notificacaoAntiga.remove();
    }


    // Cria a notificação
    const notificacao =
        document.createElement("div");

    notificacao.className =
        "notificacao-carrinho";

    notificacao.innerHTML = `
        <div class="notificacao-icone">
            <i class="fa-solid fa-check"></i>
        </div>

        <div class="notificacao-info">

            <strong>
                Produto adicionado!
            </strong>

            <span>
                ${nomeProduto}
            </span>

        </div>

        <a
            href= "carrinho.html"
            class="notificacao-ver-carrinho"
        >
            Ver carrinho
        </a>
    `;


    document.body.appendChild(notificacao);


    // Faz aparecer
    setTimeout(() => {
        notificacao.classList.add("mostrar");
    }, 10);


    // Some automaticamente
    setTimeout(() => {

        notificacao.classList.remove("mostrar");

        setTimeout(() => {
            notificacao.remove();
        }, 300);

    }, 3500);
}