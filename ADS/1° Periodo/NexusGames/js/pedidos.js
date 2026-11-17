
/* =========================================
   MEUS PEDIDOS - SPAN GAMES
========================================= */

/* =========================================
   ELEMENTOS
========================================= */

const listaPedidos =
    document.getElementById("listaPedidos");

const pedidosVazio =
    document.getElementById("pedidosVazio");

const pedidosResumo =
    document.getElementById("pedidosResumo");

const quantidadePedidos =
    document.getElementById("quantidadePedidos");

const pedidosAndamento =
    document.getElementById("pedidosAndamento");

const pedidosEntregues =
    document.getElementById("pedidosEntregues");

const templatePedido =
    document.getElementById("templatePedido");


/* =========================================
   USUÁRIO LOGADO
========================================= */

const usuarioLogado =
    JSON.parse(
        localStorage.getItem("usuarioLogado")
    );


/* =========================================
   PROTEGER PÁGINA
========================================= */

if (!usuarioLogado) {

    window.location.href =
        "login.html";

}


/* =========================================
   PEGAR TODOS OS PEDIDOS
========================================= */

function pegarPedidos() {

    try {

        const pedidos = JSON.parse(
            localStorage.getItem("pedidos") || "[]"
        );

        return Array.isArray(pedidos)
            ? pedidos
            : [];

    } catch (erro) {

        console.error(
            "Erro ao carregar pedidos:",
            erro
        );

        return [];

    }

}


/* =========================================
   PEGAR PEDIDOS DO USUÁRIO
========================================= */

function pegarPedidosUsuario() {

    const pedidos =
        pegarPedidos();

    return pedidos.filter(
        function (pedido) {

            return (
                pedido.usuario ===
                usuarioLogado.login
            );

        }
    );

}


/* =========================================
   FORMATAR DINHEIRO
========================================= */

function formatarPreco(valor) {

    return Number(valor || 0)
        .toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

}


/* =========================================
   FORMATAR DATA
========================================= */

function formatarData(data) {

    if (!data) {
        return "-";
    }

    /*
       Caso a data já esteja no formato
       brasileiro, não precisamos alterar.
    */

    if (
        typeof data === "string" &&
        data.includes("/")
    ) {

        return data;

    }

    const dataPedido =
        new Date(data);

    if (
        Number.isNaN(
            dataPedido.getTime()
        )
    ) {

        return data;

    }

    return dataPedido.toLocaleDateString(
        "pt-BR"
    );

}


/* =========================================
   DEFINIR PREÇO DO PRODUTO
========================================= */

function obterPrecoProduto(produto) {

    /*
       Aceita tanto os produtos antigos
       quanto os novos formatos de pedido.
    */

    if (
        produto.preco !== undefined
    ) {

        return Number(
            produto.preco
        );

    }

    if (
        produto.oferta === true &&
        produto.preçooferta !== undefined
    ) {

        return Number(
            produto.preçooferta
        );

    }

    return Number(
        produto.preço || 0
    );

}


/* =========================================
   CALCULAR TOTAL
========================================= */

function calcularTotalPedido(pedido) {

    /*
       Se o pedido já tiver total salvo,
       usamos esse valor.
    */

    if (
        pedido.total !== undefined &&
        pedido.total !== null
    ) {

        return Number(
            pedido.total
        );

    }

    /*
       Caso seja um pedido antigo sem total,
       calculamos pelos produtos.
    */

    return (pedido.produtos || [])
        .reduce(
            function (total, produto) {

                const preco =
                    obterPrecoProduto(
                        produto
                    );

                const quantidade =
                    Number(
                        produto.quantidade || 1
                    );

                return (
                    total +
                    preco * quantidade
                );

            },
            0
        );

}


/* =========================================
   FORMATAR ENDEREÇO
========================================= */

function formatarEndereco(endereco) {

    if (!endereco) {

        return "Endereço não informado";

    }

    /*
       Se estiver salvo como texto.
    */

    if (
        typeof endereco === "string"
    ) {

        return endereco;

    }

    const partes = [];

    if (endereco.rua) {

        partes.push(
            endereco.rua
        );

    }

    if (endereco.bairro) {

        partes.push(
            endereco.bairro
        );

    }

    let cidadeUf = "";

    if (endereco.cidade) {

        cidadeUf +=
            endereco.cidade;

    }

    if (endereco.uf) {

        cidadeUf +=
            cidadeUf
                ? ` - ${endereco.uf}`
                : endereco.uf;

    }

    if (cidadeUf) {

        partes.push(
            cidadeUf
        );

    }

    if (endereco.cep) {

        partes.push(
            `CEP ${endereco.cep}`
        );

    }

    if (partes.length === 0) {

        return "Endereço não informado";

    }

    return partes.join(", ");

}


/* =========================================
   NORMALIZAR STATUS
========================================= */

function normalizarStatus(status) {

    return String(
        status || "Pedido confirmado"
    )
        .toLowerCase()
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim();

}


/* =========================================
   DESCOBRIR ETAPA DO PEDIDO
========================================= */

function obterEtapaPedido(status) {

    const statusNormalizado =
        normalizarStatus(status);

    if (
        statusNormalizado.includes(
            "entregue"
        )
    ) {

        return 5;

    }

    if (
        statusNormalizado.includes(
            "a caminho"
        )
    ) {

        return 4;

    }

    if (
        statusNormalizado.includes(
            "enviado"
        )
    ) {

        return 3;

    }

    if (
        statusNormalizado.includes(
            "preparando"
        )
    ) {

        return 2;

    }

    return 1;

}


/* =========================================
   MENSAGEM DO STATUS
========================================= */

function obterMensagemStatus(etapa) {

    switch (etapa) {

        case 2:

            return (
                "Estamos preparando seu pedido."
            );

        case 3:

            return (
                "Seu pedido foi enviado."
            );

        case 4:

            return (
                "Seu pedido está a caminho."
            );

        case 5:

            return (
                "Seu pedido foi entregue."
            );

        default:

            return (
                "Seu pedido foi confirmado."
            );

    }

}


/* =========================================
   PORCENTAGEM DO PROGRESSO
========================================= */

function obterProgresso(etapa) {

    switch (etapa) {

        case 1:
            return 0;

        case 2:
            return 25;

        case 3:
            return 50;

        case 4:
            return 75;

        case 5:
            return 100;

        default:
            return 0;

    }

}


/* =========================================
   BUSCAR IMAGENS DOS PRODUTOS
========================================= */

/*
   CORREÇÃO DO ARMAZENAMENTO

   Os pedidos novos não precisam guardar
   cópias das imagens Base64.

   A imagem é recuperada pelo ID do produto
   cadastrado no catálogo.

   Os pedidos antigos continuam usando
   suas imagens originais normalmente.
*/

let catalogoImagensPedidos = null;

function carregarCatalogoImagensPedidos() {

    if (catalogoImagensPedidos !== null) {

        return catalogoImagensPedidos;

    }

    catalogoImagensPedidos = new Map();

    let produtosSalvos = [];

    try {

        produtosSalvos = JSON.parse(
            localStorage.getItem("produtos") || "[]"
        );

        if (!Array.isArray(produtosSalvos)) {

            produtosSalvos = [];

        }

    } catch (erro) {

        console.error(
            "Erro ao carregar imagens dos produtos:",
            erro
        );

    }

    /*
       Primeiro adicionamos produtos fixos,
       caso estejam disponíveis nesta página.
    */

    if (
        typeof produtos !== "undefined" &&
        Array.isArray(produtos)
    ) {

        produtos.forEach(function (produto) {

            const imagem =
                produto.urlimagem ||
                produto.imagem ||
                "";

            if (imagem) {

                catalogoImagensPedidos.set(
                    String(produto.id),
                    imagem
                );

            }

        });

    }

    /*
       Produtos cadastrados ou atualizados
       têm prioridade sobre os produtos fixos.
    */

    produtosSalvos.forEach(function (produto) {

        const imagem =
            produto.urlimagem ||
            produto.imagem ||
            "";

        if (imagem) {

            catalogoImagensPedidos.set(
                String(produto.id),
                imagem
            );

        }

    });

    return catalogoImagensPedidos;

}


/* =========================================
   OBTER IMAGEM DO PRODUTO
========================================= */

function obterImagemPedido(produto) {

    /*
       Pedidos antigos que possuem imagem
       continuam exibindo a imagem salva.
    */

    const imagemOriginal =
        produto.imagem ||
        produto.urlimagem ||
        "";

    if (imagemOriginal) {

        return imagemOriginal;

    }

    /*
       Pedidos novos procuram a imagem
       pelo ID no catálogo.
    */

    const catalogo =
        carregarCatalogoImagensPedidos();

    return (
        catalogo.get(String(produto.id)) ||
        ""
    );

}


/* =========================================
   ESCAPAR TEXOS HTML
========================================= */

function escaparHTMLPedido(valor) {

    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

}


/* =========================================
   CRIAR PRODUTOS DO PEDIDO
========================================= */

function criarProdutosPedido(
    elemento,
    produtos
) {

    elemento.innerHTML = "";

    if (
        !produtos ||
        produtos.length === 0
    ) {

        elemento.innerHTML = `
            <p class="pedido-sem-produtos">
                Produtos não encontrados.
            </p>
        `;

        return;

    }

    produtos.forEach(
        function (produto) {

            const quantidade =
                Number(
                    produto.quantidade || 1
                );

            const preco =
                obterPrecoProduto(
                    produto
                );

            const subtotal =
                preco * quantidade;

            /*
               CORREÇÃO:
               Busca imagem no pedido antigo
               ou no catálogo pelo ID.
            */

            const imagem =
                obterImagemPedido(produto);

            const nome =
                escaparHTMLPedido(
                    produto.nome || "Produto"
                );

            const div =
                document.createElement(
                    "div"
                );

            div.classList.add(
                "pedido-produto"
            );

            div.innerHTML = `

                <div class="pedido-produto-imagem">

                    ${
                        imagem
                            ? `
                                <img
                                    src="${escaparHTMLPedido(imagem)}"
                                    alt="${nome}"
                                >
                            `
                            : `
                                <i class="fa-solid fa-gamepad"></i>
                            `
                    }

                </div>

                <div class="pedido-produto-info">

                    <h4>
                        ${nome}
                    </h4>

                    <span>
                        ${quantidade}x
                        ${formatarPreco(preco)}
                    </span>

                </div>

                <strong class="pedido-produto-preco">

                    ${formatarPreco(subtotal)}

                </strong>

            `;

            elemento.appendChild(
                div
            );

        }
    );

}


/* =========================================
   CONFIGURAR PROGRESSO
========================================= */

function configurarProgresso(
    card,
    etapa
) {

    const preenchimento =
        card.querySelector(
            ".progresso-preenchimento"
        );

    const etapas =
        card.querySelectorAll(
            ".progresso-etapa"
        );

    if (preenchimento) {

        preenchimento.style.width =
            `${obterProgresso(etapa)}%`;

    }

    etapas.forEach(
        function (elementoEtapa) {

            const numeroEtapa =
                Number(
                    elementoEtapa.dataset.etapa
                );

            elementoEtapa.classList.remove(
                "ativa",
                "atual"
            );

            if (
                numeroEtapa <= etapa
            ) {

                elementoEtapa.classList.add(
                    "ativa"
                );

            }

            if (
                numeroEtapa === etapa
            ) {

                elementoEtapa.classList.add(
                    "atual"
                );

            }

        }
    );

}


/* =========================================
   CRIAR CARD DO PEDIDO
========================================= */

function criarPedido(pedido) {

    const fragmento =
        templatePedido.content.cloneNode(
            true
        );

    const card =
        fragmento.querySelector(
            ".pedido-card"
        );

    const numero =
        card.querySelector(
            ".pedido-numero"
        );

    const data =
        card.querySelector(
            ".pedido-data"
        );

    const status =
        card.querySelector(
            ".pedido-status"
        );

    const statusTexto =
        status.querySelector(
            "span"
        );

    const pagamento =
        card.querySelector(
            ".pedido-pagamento"
        );

    const total =
        card.querySelector(
            ".pedido-total"
        );

    const endereco =
        card.querySelector(
            ".pedido-endereco"
        );

    const produtosLista =
        card.querySelector(
            ".pedido-produtos-lista"
        );

    const mensagem =
        card.querySelector(
            ".pedido-mensagem"
        );

    const btnDetalhes =
        card.querySelector(
            ".btn-detalhes-pedido"
        );

    /* =====================================
       DADOS DO PEDIDO
    ===================================== */

    numero.textContent =
        pedido.id ||
        "SPAN-000000";

    data.textContent =
        formatarData(
            pedido.data ||
            pedido.dataPedido
        );

    const statusPedido =
        pedido.status ||
        "Pedido confirmado";

    statusTexto.textContent =
        statusPedido;

    pagamento.textContent =
        pedido.pagamento ||
        pedido.formaPagamento ||
        "Não informado";

    total.textContent =
        formatarPreco(
            calcularTotalPedido(
                pedido
            )
        );

    endereco.textContent =
        formatarEndereco(
            pedido.endereco
        );

    /* =====================================
       PRODUTOS
    ===================================== */

    criarProdutosPedido(
        produtosLista,
        pedido.produtos || []
    );

    /* =====================================
       PROGRESSO
    ===================================== */

    const etapa =
        obterEtapaPedido(
            statusPedido
        );

    configurarProgresso(
        card,
        etapa
    );

    mensagem.textContent =
        obterMensagemStatus(
            etapa
        );

    /* =====================================
       STATUS ENTREGUE
    ===================================== */

    if (etapa === 5) {

        status.classList.add(
            "entregue"
        );

    }

    /* =====================================
       DETALHES
    ===================================== */

    card.classList.add(
        "compacto"
    );

    btnDetalhes.addEventListener(
        "click",
        function () {

            const estaCompacto =
                card.classList.contains(
                    "compacto"
                );

            if (estaCompacto) {

                card.classList.remove(
                    "compacto"
                );

                card.classList.add(
                    "aberto"
                );

                btnDetalhes.innerHTML = `
                    Ocultar detalhes
                    <i class="fa-solid fa-chevron-up"></i>
                `;

            } else {

                card.classList.add(
                    "compacto"
                );

                card.classList.remove(
                    "aberto"
                );

                btnDetalhes.innerHTML = `
                    Ver detalhes
                    <i class="fa-solid fa-chevron-down"></i>
                `;

            }

        }
    );

    return fragmento;

}


/* =========================================
   ATUALIZAR RESUMO
========================================= */

function atualizarResumo(
    pedidos
) {

    const total =
        pedidos.length;

    const entregues =
        pedidos.filter(
            function (pedido) {

                return (
                    obterEtapaPedido(
                        pedido.status
                    ) === 5
                );

            }
        ).length;

    const andamento =
        total - entregues;

    quantidadePedidos.textContent =
        total;

    pedidosAndamento.textContent =
        andamento;

    pedidosEntregues.textContent =
        entregues;

}


/* =========================================
   MOSTRAR PEDIDOS
========================================= */

function mostrarPedidos() {

    if (!usuarioLogado) {
        return;
    }

    const pedidos =
        pegarPedidosUsuario();

    listaPedidos.innerHTML =
        "";

    atualizarResumo(
        pedidos
    );

    /* =====================================
       NENHUM PEDIDO
    ===================================== */

    if (
        pedidos.length === 0
    ) {

        pedidosVazio.hidden =
            false;

        listaPedidos.hidden =
            true;

        return;

    }

    /* =====================================
       EXISTEM PEDIDOS
    ===================================== */

    pedidosVazio.hidden =
        true;

    listaPedidos.hidden =
        false;

    /*
       Pedidos mais recentes primeiro.
    */

    pedidos
        .slice()
        .reverse()
        .forEach(
            function (pedido) {

                const card =
                    criarPedido(
                        pedido
                    );

                listaPedidos.appendChild(
                    card
                );

            }
        );

}


/* =========================================
   SIMULAÇÃO DE ENTREGA - A CADA 2 MINUTOS

   Mantém todos os cards e detalhes existentes.
========================================= */

const TEMPO_POR_ETAPA = 2 * 60 * 1000;

const STATUS_SIMULADOS = [
    "Pedido confirmado",
    "Preparando",
    "Enviado",
    "A caminho",
    "Entregue"
];


/* =========================================
   SALVAR PEDIDOS COM SEGURANÇA
========================================= */

/*
   Evita que um erro de armazenamento
   interrompa toda a página.

   Se o navegador estiver sem espaço,
   o histórico anterior permanece salvo.
*/

let avisoArmazenamentoPedidosExibido = false;

function salvarPedidosSimulacao(pedidos) {

    try {

        localStorage.setItem(
            "pedidos",
            JSON.stringify(pedidos)
        );

        avisoArmazenamentoPedidosExibido = false;

        return true;

    } catch (erro) {

        if (!avisoArmazenamentoPedidosExibido) {

            console.error(
                "Não foi possível atualizar os pedidos. O armazenamento pode estar cheio:",
                erro
            );

            avisoArmazenamentoPedidosExibido = true;

        }

        return false;

    }

}


/* =========================================
   PREPARAR SIMULAÇÃO DOS PEDIDOS
========================================= */

/*
   O horário inicial é salvo uma única vez.

   Pedidos antigos sem horário de simulação
   começam a contar na primeira visualização.

   Pedidos já entregues não são reiniciados.
*/

function prepararSimulacaoPedidos() {

    const pedidos = pegarPedidos();

    let alterou = false;

    pedidos.forEach(function (pedido) {

        if (
            pedido.usuario !==
            usuarioLogado.login
        ) {
            return;
        }

        if (
            obterEtapaPedido(pedido.status) === 5
        ) {
            return;
        }

        if (
            !Number.isFinite(
                Number(pedido.inicioSimulacao)
            ) ||
            Number(pedido.inicioSimulacao) <= 0
        ) {

            pedido.inicioSimulacao =
                Date.now();

            alterou = true;

        }

    });

    if (alterou) {

        salvarPedidosSimulacao(
            pedidos
        );

    }

}


/* =========================================
   ATUALIZAR STATUS SEM RECRIAR OS CARDS
========================================= */

function atualizarSimulacaoPedidos() {

    if (!usuarioLogado || !listaPedidos) {
        return;
    }

    const pedidos =
        pegarPedidos();

    let alterou = false;

    pedidos.forEach(function (pedido) {

        if (
            pedido.usuario !==
            usuarioLogado.login
        ) {
            return;
        }

        if (
            obterEtapaPedido(pedido.status) === 5
        ) {
            return;
        }

        const inicio =
            Number(pedido.inicioSimulacao);

        if (
            !Number.isFinite(inicio) ||
            inicio <= 0
        ) {
            return;
        }

        const tempoDecorrido = Math.max(
            0,
            Date.now() - inicio
        );

        const etapaPorTempo = Math.min(
            5,
            Math.floor(
                tempoDecorrido / TEMPO_POR_ETAPA
            ) + 1
        );

        const etapaAtual =
            obterEtapaPedido(pedido.status);

        const novaEtapa = Math.max(
            etapaAtual,
            etapaPorTempo
        );

        const novoStatus =
            STATUS_SIMULADOS[novaEtapa - 1];

        if (
            pedido.status !== novoStatus
        ) {

            pedido.status =
                novoStatus;

            alterou = true;

        }

    });

    /*
       Salva o novo status.

       Se não conseguir salvar, não exibe
       uma atualização temporária que seria
       perdida ao recarregar a página.
    */

    if (alterou) {

        const salvou =
            salvarPedidosSimulacao(pedidos);

        if (!salvou) {
            return;
        }

    }

    const pedidosUsuario = pedidos.filter(
        function (pedido) {

            return (
                pedido.usuario ===
                usuarioLogado.login
            );

        }
    );

    const pedidosExibidos =
        pedidosUsuario
            .slice()
            .reverse();

    const cards =
        listaPedidos.querySelectorAll(
            ".pedido-card"
        );

    cards.forEach(function (card, indice) {

        const pedido =
            pedidosExibidos[indice];

        if (!pedido) {
            return;
        }

        const statusAtual =
            pedido.status ||
            "Pedido confirmado";

        const etapa =
            obterEtapaPedido(statusAtual);

        const statusElemento =
            card.querySelector(
                ".pedido-status"
            );

        const statusTexto =
            statusElemento?.querySelector(
                "span"
            );

        const mensagem =
            card.querySelector(
                ".pedido-mensagem"
            );

        if (
            statusTexto &&
            statusTexto.textContent !== statusAtual
        ) {

            statusTexto.textContent =
                statusAtual;

        }

        if (statusElemento) {

            statusElemento.classList.toggle(
                "entregue",
                etapa === 5
            );

        }

        if (mensagem) {

            mensagem.textContent =
                obterMensagemStatus(etapa);

        }

        /*
           Atualiza a barra sem recriar
           o card e sem fechar os detalhes.
        */

        configurarProgresso(
            card,
            etapa
        );

    });

    atualizarResumo(
        pedidosUsuario
    );

}


/* =========================================
   INICIAR
========================================= */

if (usuarioLogado) {

    prepararSimulacaoPedidos();

    mostrarPedidos();

    atualizarSimulacaoPedidos();

    /*
       Verifica a cada segundo.
       Cada etapa dura 2 minutos.
    */

    setInterval(
        atualizarSimulacaoPedidos,
        1000
    );

}
