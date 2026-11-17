
/* =========================================
   SPAN GAMES
   CHECKOUT
========================================= */

/* =========================================
   ELEMENTOS
========================================= */

const produtosCheckout =
    document.getElementById("produtosCheckout");

const totalCheckout =
    document.getElementById("totalCheckout");

const valorPix =
    document.getElementById("valorPix");

const botaoValorPix =
    document.getElementById("botaoValorPix");

const botaoValorCartao =
    document.getElementById("botaoValorCartao");

const botaoValorBoleto =
    document.getElementById("botaoValorBoleto");

const numeroCartao =
    document.getElementById("num");

const nomeCartao =
    document.getElementById("nomeCartao");

const validadeCartao =
    document.getElementById("validadeCartao");

const cvvCartao =
    document.getElementById("cvvCartao");

const cpf =
    document.getElementById("cpf");

const nomeBoleto =
    document.getElementById("nomeBoleto");

const emailBoleto =
    document.getElementById("emailBoleto");

const copiarPix =
    document.getElementById("copiarPix");

const chavePix =
    document.getElementById("chavePix");


/* =========================================
   USUÁRIO LOGADO
========================================= */

function obterUsuarioLogado() {

    try {
        return JSON.parse(
            localStorage.getItem("usuarioLogado")
        );
    } catch (erro) {
        console.error("Erro ao carregar usuário:", erro);
        return null;
    }

}


/* =========================================
   PROTEGER CHECKOUT
========================================= */

function protegerCheckout() {

    const usuarioLogado =
        obterUsuarioLogado();

    if (!usuarioLogado) {

        localStorage.setItem(
            "redirecionarAposLogin",
            "span.html"
        );

        window.location.replace("erro-pagamento-login.html");

        return false;
    }

    return true;
}


/* =========================================
   PREÇO DO PRODUTO
========================================= */

function obterPrecoProduto(produto) {

    const precoNormal = Number(
        produto.preço ??
        produto.preco ??
        0
    );

    const precoOferta = Number(
        produto.preçooferta ??
        produto.precoOferta ??
        produto.precooferta ??
        0
    );

    if (
        (produto.oferta === true ||
         produto.oferta === "true") &&
        Number.isFinite(precoOferta) &&
        precoOferta > 0 &&
        precoOferta < precoNormal
    ) {
        return precoOferta;
    }

    return precoNormal;
}


/* =========================================
   FORMATAR PREÇO
========================================= */

function formatarPreco(valor) {

    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


/* =========================================
   PEGAR CARRINHO
========================================= */

function obterCarrinho() {

    try {

        const carrinho = JSON.parse(
            localStorage.getItem("carrinho") || "[]"
        );

        return Array.isArray(carrinho)
            ? carrinho
            : [];

    } catch (erro) {

        console.error(
            "Erro ao carregar carrinho:",
            erro
        );

        return [];
    }

}


/* =========================================
   BUSCAR IMAGEM NO CATÁLOGO
========================================= */

/*
   Recupera imagens que não estão mais
   armazenadas diretamente no carrinho.

   Isso permite adicionar produtos sem
   duplicar imagens Base64.
*/

function obterImagemProduto(produto) {

    const imagemDireta =
        produto.urlimagem ||
        produto.imagem ||
        "";

    if (imagemDireta) {
        return imagemDireta;
    }

    let produtosSalvos = [];

    try {

        produtosSalvos = JSON.parse(
            localStorage.getItem("produtos") || "[]"
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar imagens do catálogo:",
            erro
        );

    }

    const produtoEncontrado =
        produtosSalvos.find(
            item =>
                String(item.id) === String(produto.id)
        );

    if (produtoEncontrado) {

        return (
            produtoEncontrado.urlimagem ||
            produtoEncontrado.imagem ||
            ""
        );

    }

    /*
       Produtos fixos podem existir na
       variável global produtos.
    */

    if (
        typeof produtos !== "undefined" &&
        Array.isArray(produtos)
    ) {

        const produtoFixo = produtos.find(
            item =>
                String(item.id) === String(produto.id)
        );

        if (produtoFixo) {

            return (
                produtoFixo.urlimagem ||
                produtoFixo.imagem ||
                ""
            );

        }

    }

    return "";
}


/* =========================================
   ESCAPAR TEXOS PARA HTML
========================================= */

function escaparHTML(valor) {

    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

}


/* =========================================
   CALCULAR TOTAL
========================================= */

function calcularTotal() {

    const carrinho = obterCarrinho();

    let total = 0;

    carrinho.forEach(function (produto) {

        total += obterPrecoProduto(produto);

    });

    return total;
}


/* =========================================
   CARREGAR CHECKOUT
========================================= */

function carregarCheckout() {

    const carrinho = obterCarrinho();

    /* =====================================
       CARRINHO VAZIO
    ===================================== */

    if (carrinho.length === 0) {

        if (produtosCheckout) {

            produtosCheckout.innerHTML = `
                <div class="checkout-vazio">

                    <i class="fa-solid fa-cart-shopping"></i>

                    <p>
                        Seu carrinho está vazio.
                    </p>

                    <a href="produtos.html">
                        Ver produtos
                    </a>

                </div>
            `;

        }

        atualizarValores(0);
        desativarPagamento();

        return;
    }

    if (!produtosCheckout) {
        return;
    }

    produtosCheckout.innerHTML = "";

    /* =====================================
       AGRUPAR PRODUTOS
    ===================================== */

    const produtosAgrupados = {};

    carrinho.forEach(function (produto) {

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

    /* =====================================
       MOSTRAR PRODUTOS
    ===================================== */

    Object.values(produtosAgrupados).forEach(
        function (item) {

            const produto = item.produto;

            const quantidade = item.quantidade;

            const precoUnitario =
                obterPrecoProduto(produto);

            const subtotalProduto =
                precoUnitario * quantidade;

            const imagem =
                obterImagemProduto(produto);

            const imagemHTML = imagem
                ? `
                    <img
                        src="${escaparHTML(imagem)}"
                        alt="${escaparHTML(produto.nome)}"
                    >
                `
                : `
                    <div class="produto-sem-imagem">
                        <i class="fa-solid fa-gamepad"></i>
                    </div>
                `;

            produtosCheckout.innerHTML += `
                <div class="produto-checkout">

                    ${imagemHTML}

                    <div class="produto-checkout-info">

                        <h3>
                            ${escaparHTML(produto.nome)}
                        </h3>

                        <span>
                            ${quantidade}x
                            ${formatarPreco(precoUnitario)}
                        </span>

                    </div>

                    <strong class="produto-checkout-preco">
                        ${formatarPreco(subtotalProduto)}
                    </strong>

                </div>
            `;

        }
    );

    /* =====================================
       TOTAL
    ===================================== */

    const total = calcularTotal();

    atualizarValores(total);

}


/* =========================================
   ATUALIZAR VALORES
========================================= */

function atualizarValores(total) {

    const valorFormatado =
        formatarPreco(total);

    if (totalCheckout) {

        totalCheckout.textContent =
            valorFormatado;

    }

    if (valorPix) {

        valorPix.textContent =
            valorFormatado;

    }

    if (botaoValorPix) {

        botaoValorPix.textContent =
            valorFormatado;

    }

    if (botaoValorCartao) {

        botaoValorCartao.textContent =
            valorFormatado;

    }

    if (botaoValorBoleto) {

        botaoValorBoleto.textContent =
            valorFormatado;

    }

}


/* =========================================
   TROCAR FORMA DE PAGAMENTO
========================================= */

function openTab(id) {

    const formasPagamento = [
        "pix",
        "cartao",
        "boleto"
    ];

    formasPagamento.forEach(function (forma) {

        const conteudo =
            document.getElementById(forma);

        const botao =
            document.getElementById("t-" + forma);

        if (conteudo) {

            conteudo.classList.add("hidden");

        }

        if (botao) {

            botao.classList.remove("active");

        }

    });

    const conteudoSelecionado =
        document.getElementById(id);

    const botaoSelecionado =
        document.getElementById("t-" + id);

    if (conteudoSelecionado) {

        conteudoSelecionado.classList.remove(
            "hidden"
        );

    }

    if (botaoSelecionado) {

        botaoSelecionado.classList.add(
            "active"
        );

    }

}


/* =========================================
   DESATIVAR PAGAMENTO
========================================= */

function desativarPagamento() {

    const botoes =
        document.querySelectorAll(".btn-pagar");

    botoes.forEach(function (botao) {

        botao.disabled = true;

    });

}


/* =========================================
   AGRUPAR PRODUTOS PARA O PEDIDO
========================================= */

/*
   CORREÇÃO:

   Não salvar imagens Base64 dentro
   do histórico de pedidos.

   O ID do produto será mantido para
   recuperar a imagem no catálogo.
*/

function prepararProdutosPedido() {

    const carrinho = obterCarrinho();

    const agrupados = {};

    carrinho.forEach(function (produto) {

        const id = String(produto.id);

        if (!agrupados[id]) {

            const imagem =
                produto.urlimagem ||
                produto.imagem ||
                "";

            const imagemParaSalvar =
                typeof imagem === "string" &&
                imagem.startsWith("data:")
                    ? ""
                    : imagem;

            agrupados[id] = {

                id: produto.id,

                nome: produto.nome,

                imagem: imagemParaSalvar,

                preco: obterPrecoProduto(produto),

                quantidade: 1

            };

        } else {

            agrupados[id].quantidade++;

        }

    });

    return Object.values(agrupados);

}


/* =========================================
   ENDEREÇO DO USUÁRIO
========================================= */

function obterEnderecoUsuario(usuario) {

    return {

        cep: usuario.cep || "",

        rua: usuario.rua || "",

        bairro: usuario.bairro || "",

        cidade: usuario.cidade || "",

        uf: usuario.uf || ""

    };

}


/* =========================================
   VERIFICAR LOGIN NO PAGAMENTO
========================================= */

function verificarLoginPagamento() {

    const usuarioLogado =
        obterUsuarioLogado();

    if (!usuarioLogado) {

        localStorage.setItem(
            "redirecionarAposLogin",
            "span.html"
        );

       window.location.replace("erro-pagamento-login.html");

        return false;
    }

    return true;
}


/* =========================================
   CONCLUIR PAGAMENTO
========================================= */

function pagar(metodo) {

    /* =====================================
       VERIFICAR LOGIN
    ===================================== */

    if (!verificarLoginPagamento()) {
        return;
    }

    const usuarioLogado =
        obterUsuarioLogado();

    /* =====================================
       PEGAR CARRINHO
    ===================================== */

    const carrinho = obterCarrinho();

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio.");

        return;
    }

    const total = calcularTotal();

    if (
        !Number.isFinite(total) ||
        total <= 0
    ) {

        alert(
            "Não foi possível calcular o valor do pedido."
        );

        return;
    }

    /* =====================================
       GERAR NÚMERO DO PEDIDO
    ===================================== */

    const idPedido =
        "SPAN-" + Date.now();

    /* =====================================
       PREPARAR PRODUTOS
    ===================================== */

    const produtosPedido =
        prepararProdutosPedido();

    /* =====================================
       ENDEREÇO
    ===================================== */

    const endereco =
        obterEnderecoUsuario(usuarioLogado);

    /* =====================================
       CRIAR PEDIDO
    ===================================== */

    const pedido = {

        id: idPedido,

        usuario: usuarioLogado.login,

        usuarioId: usuarioLogado.id || null,

        produtos: produtosPedido,

        total: total,

        pagamento: metodo,

        status: "Pedido confirmado",

        endereco: endereco,

        data: new Date().toISOString(),

        // Horário utilizado na simulação
        // de entrega a cada 2 minutos.
        inicioSimulacao: Date.now()

    };

    /* =====================================
       PEGAR PEDIDOS EXISTENTES
    ===================================== */

    let pedidos = [];

    try {

        const pedidosSalvos = JSON.parse(
            localStorage.getItem("pedidos") || "[]"
        );

        pedidos = Array.isArray(pedidosSalvos)
            ? pedidosSalvos
            : [];

    } catch (erro) {

        console.error(
            "Erro ao carregar histórico de pedidos:",
            erro
        );

        alert(
            "Não foi possível carregar o histórico de pedidos. Nenhum dado foi apagado."
        );

        return;
    }

    /* =====================================
       ADICIONAR PEDIDO
    ===================================== */

    pedidos.push(pedido);

    /* =====================================
       SALVAR PEDIDOS COM SEGURANÇA
    ===================================== */

    try {

        localStorage.setItem(
            "pedidos",
            JSON.stringify(pedidos)
        );

    } catch (erro) {

        console.error(
            "Erro ao salvar pedido:",
            erro
        );

        if (
            erro.name === "QuotaExceededError" ||
            erro.code === 22
        ) {

            alert(
                "O armazenamento do navegador está cheio. Não foi possível finalizar a compra. Seus produtos e pedidos foram preservados."
            );

        } else {

            alert(
                "Ocorreu um erro ao salvar o pedido. Tente novamente."
            );

        }

        // Não limpa o carrinho se o
        // pedido não foi salvo.
        return;
    }

    /* =====================================
       LIMPAR CARRINHO
    ===================================== */

    localStorage.removeItem("carrinho");

    /* =====================================
       ATUALIZAR CONTADOR
    ===================================== */

    if (
        typeof atualizarContadorCarrinho ===
        "function"
    ) {

        atualizarContadorCarrinho();

    }

    /* =====================================
       MOSTRAR SUCESSO
    ===================================== */

    mostrarPagamentoConcluido(
        metodo,
        total,
        idPedido
    );

}


/* =========================================
   PAGAMENTO CONCLUÍDO
========================================= */

function mostrarPagamentoConcluido(
    metodo,
    total,
    idPedido
) {

    const checkout =

        document.querySelector(
            ".checkout-container"
        ) ||

        document.querySelector(
            ".checkout-page"
        ) ||

        document.querySelector(
            ".checkout"
        ) ||

        document.querySelector(
            "main"
        );

    if (!checkout) {

        console.error(
            "Container do checkout não encontrado."
        );

        return;
    }

    checkout.innerHTML = `

        <div class="pagamento-concluido">

            <div class="sucesso-icone">

                <i class="fa-solid fa-check"></i>

            </div>

            <h1>
                Pagamento concluído!
            </h1>

            <p class="sucesso-texto">

                Seu pagamento foi realizado
                com sucesso.

            </p>

            <div class="sucesso-pedido">

                <div class="sucesso-linha">

                    <span>
                        Pedido
                    </span>

                    <strong>
                        ${escaparHTML(idPedido)}
                    </strong>

                </div>

                <div class="sucesso-linha">

                    <span>
                        Forma de pagamento
                    </span>

                    <strong>
                        ${escaparHTML(metodo)}
                    </strong>

                </div>

                <div class="sucesso-linha">

                    <span>
                        Total pago
                    </span>

                    <strong class="sucesso-total">
                        ${formatarPreco(total)}
                    </strong>

                </div>

            </div>

            <div class="sucesso-aviso">

                <i class="fa-solid fa-circle-check"></i>

                <span>
                    Pedido confirmado com sucesso.
                </span>

            </div>

            <div class="sucesso-acoes">

                <a
                    href="pedidos.html"
                    class="btn-voltar-loja"
                >

                    <i class="fa-solid fa-box"></i>

                    Ver meus pedidos

                </a>

                <a
                    href="index.html"
                    class="btn-voltar-loja"
                >

                    <i class="fa-solid fa-house"></i>

                    Voltar para a loja

                </a>

            </div>

        </div>
    `;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================
   VALIDAR CARTÃO
========================================= */

function validarCartao() {

    if (!verificarLoginPagamento()) {
        return;
    }

    if (
        !numeroCartao ||
        !nomeCartao ||
        !validadeCartao ||
        !cvvCartao
    ) {

        alert(
            "Não foi possível encontrar os campos do cartão."
        );

        return;
    }

    const numero =
        numeroCartao.value.replace(/\D/g, "");

    const nome =
        nomeCartao.value.trim();

    const validade =
        validadeCartao.value.trim();

    const cvv =
        cvvCartao.value.replace(/\D/g, "");

    /* =====================================
       NÚMERO
    ===================================== */

    if (numero.length !== 16) {

        alert(
            "O cartão precisa possuir 16 dígitos."
        );

        numeroCartao.focus();

        return;
    }

    /* =====================================
       NOME
    ===================================== */

    if (nome.length < 3) {

        alert(
            "Digite o nome presente no cartão."
        );

        nomeCartao.focus();

        return;
    }

    /* =====================================
       VALIDADE
    ===================================== */

    if (!/^\d{2}\/\d{2}$/.test(validade)) {

        alert(
            "Digite uma validade válida no formato MM/AA."
        );

        validadeCartao.focus();

        return;
    }

    const [mes, ano] = validade
        .split("/")
        .map(Number);

    const hoje = new Date();

    const anoAtual =
        hoje.getFullYear() % 100;

    const mesAtual =
        hoje.getMonth() + 1;

    if (
        mes < 1 ||
        mes > 12 ||
        ano < anoAtual ||
        (ano === anoAtual && mes < mesAtual)
    ) {

        alert(
            "A validade do cartão está incorreta ou expirada."
        );

        validadeCartao.focus();

        return;
    }

    /* =====================================
       CVV
    ===================================== */

    if (cvv.length !== 3) {

        alert(
            "O CVV precisa possuir 3 dígitos."
        );

        cvvCartao.focus();

        return;
    }

    pagar("Cartão");

}


/* =========================================
   VALIDAR BOLETO
========================================= */

function validarBoleto() {

    if (!verificarLoginPagamento()) {
        return;
    }

    if (nomeBoleto) {

        const nome =
            nomeBoleto.value.trim();

        if (nome.length < 3) {

            alert(
                "Digite seu nome para gerar o boleto."
            );

            nomeBoleto.focus();

            return;
        }

    }

    if (emailBoleto) {

        const email =
            emailBoleto.value.trim();

        if (
            !email ||
            !email.includes("@")
        ) {

            alert(
                "Digite um e-mail válido."
            );

            emailBoleto.focus();

            return;
        }

    }

    pagar("Boleto");

}


/* =========================================
   PAGAR COM PIX
========================================= */

function pagarPix() {

    if (!verificarLoginPagamento()) {
        return;
    }

    pagar("PIX");

}


/* =========================================
   MÁSCARA DO CARTÃO
========================================= */

if (numeroCartao) {

    numeroCartao.addEventListener(
        "input",
        function () {

            let valor = this.value
                .replace(/\D/g, "")
                .slice(0, 16);

            valor = valor.replace(
                /(\d{4})(?=\d)/g,
                "$1 "
            );

            this.value = valor;

        }
    );

}


/* =========================================
   MÁSCARA DA VALIDADE
========================================= */

if (validadeCartao) {

    validadeCartao.addEventListener(
        "input",
        function () {

            let valor = this.value
                .replace(/\D/g, "")
                .slice(0, 4);

            if (valor.length > 2) {

                valor =
                    valor.slice(0, 2) +
                    "/" +
                    valor.slice(2);

            }

            this.value = valor;

        }
    );

}


/* =========================================
   CVV - APENAS NÚMEROS
========================================= */

if (cvvCartao) {

    cvvCartao.addEventListener(
        "input",
        function () {

            this.value = this.value
                .replace(/\D/g, "")
                .slice(0, 3);

        }
    );

}


/* =========================================
   MÁSCARA CPF
========================================= */

if (cpf) {

    cpf.addEventListener(
        "input",
        function () {

            let valor = this.value
                .replace(/\D/g, "")
                .slice(0, 11);

            valor = valor
                .replace(
                    /(\d{3})(\d)/,
                    "$1.$2"
                )
                .replace(
                    /(\d{3})(\d)/,
                    "$1.$2"
                )
                .replace(
                    /(\d{3})(\d{1,2})$/,
                    "$1-$2"
                );

            this.value = valor;

        }
    );

}


/* =========================================
   COPIAR CHAVE PIX
========================================= */

if (copiarPix && chavePix) {

    copiarPix.addEventListener(
        "click",
        function () {

            const chave = chavePix
                .textContent
                .trim();

            navigator.clipboard
                .writeText(chave)
                .then(function () {

                    const icone =
                        copiarPix.querySelector("i");

                    if (!icone) {
                        return;
                    }

                    icone.className =
                        "fa-solid fa-check";

                    setTimeout(function () {

                        icone.className =
                            "fa-regular fa-copy";

                    }, 1500);

                })
                .catch(function () {

                    alert("Chave PIX: " + chave);

                });

        }
    );

}


/* =========================================
   INICIAR CHECKOUT
========================================= */

/*
   Primeiro verificamos se existe
   um usuário logado.

   Se não existir, carregarCheckout()
   não será executado.
*/

if (protegerCheckout()) {

    carregarCheckout();

}
