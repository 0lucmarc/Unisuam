
/* =========================================
   SPAN GAMES - OFERTAS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const gridOfertas =
        document.getElementById("gridOfertas");

    const mensagemSemOfertas =
        document.getElementById("mensagemSemOfertas");

    if (!gridOfertas) return;


  
/* =========================================
   BUSCAR TODOS OS PRODUTOS
   FIXOS + CADASTRADOS
========================================= */

function buscarProdutos() {

    try {

        const produtosSalvos = JSON.parse(
            localStorage.getItem("produtos") || "[]"
        );

        const produtosFixos =
            typeof produtos !== "undefined" &&
            Array.isArray(produtos)
                ? produtos
                : [];

        const mapaProdutos = new Map();

        // Primeiro adiciona os produtos fixos
        produtosFixos.forEach(produto => {

            mapaProdutos.set(
                String(produto.id),
                produto
            );

        });

        // Depois adiciona os cadastrados
        // Se o ID for igual, o cadastrado prevalece
        produtosSalvos.forEach(produto => {

            mapaProdutos.set(
                String(produto.id),
                produto
            );

        });

        return Array.from(mapaProdutos.values());

    } catch (erro) {

        console.error(
            "Erro ao carregar produtos:",
            erro
        );

        return [];

    }
}



    /* =========================================
       FORMATAR PREÇO
    ========================================= */

    function formatarPreco(valor) {

        return Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }


    /* =========================================
       CALCULAR DESCONTO
    ========================================= */

    function calcularDesconto(preco, precoOferta) {

        return Math.round(
            ((preco - precoOferta) / preco) * 100
        );
    }


    /* =========================================
       PROTEGER TEXTOS
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
       BUSCAR CARRINHO
    ========================================= */

    function buscarCarrinho() {

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
       ATUALIZAR CONTADOR
    ========================================= */

    function atualizarContadorCarrinho() {

        const contador =
            document.getElementById("contadorCarrinho");

        if (!contador) return;

        const carrinho = buscarCarrinho();

        const total = carrinho.reduce(
            (soma, item) =>
                soma + (Number(item.quantidade) || 1),
            0
        );

        contador.textContent = total;
    }


    /* =========================================
       ADICIONAR AO CARRINHO
    ========================================= */

    function adicionarAoCarrinho(produto) {

        const carrinho = buscarCarrinho();

        const existente = carrinho.find(
            item => String(item.id) === String(produto.id)
        );

        if (existente) {

            existente.quantidade =
                (Number(existente.quantidade) || 1) + 1;

        } else {

            /*
               Não duplicar imagem Base64
               quando ela já está salva
               no catálogo de produtos.
            */

            const produtoCarrinho = {
                ...produto,
                quantidade: 1
            };

            const imagem =
                produtoCarrinho.urlimagem || "";

            if (
                typeof imagem === "string" &&
                imagem.startsWith("data:")
            ) {

                produtoCarrinho.urlimagem = "";

            }

            carrinho.push(produtoCarrinho);
        }

        try {

            localStorage.setItem(
                "carrinho",
                JSON.stringify(carrinho)
            );

        } catch (erro) {

            console.error(
                "Erro ao salvar carrinho:",
                erro
            );

            mostrarNotificacao(
                "Não foi possível adicionar. O armazenamento pode estar cheio."
            );

            return;
        }

        atualizarContadorCarrinho();

        mostrarNotificacao(
            "Produto adicionado ao carrinho!"
        );
    }


    /* =========================================
       NOTIFICAÇÃO
    ========================================= */

    function mostrarNotificacao(mensagem) {

        let notificacao =
            document.getElementById("notificacaoOferta");

        if (!notificacao) {

            notificacao = document.createElement("div");

            notificacao.id = "notificacaoOferta";
            notificacao.setAttribute("role", "status");

            Object.assign(notificacao.style, {
                position: "fixed",
                right: "20px",
                bottom: "25px",
                padding: "15px 22px",
                background: "#8b5cf6",
                color: "#ffffff",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "700",
                zIndex: "9999",
                boxShadow: "0 5px 20px rgba(0,0,0,.3)",
                transition: "opacity .3s"
            });

            document.body.appendChild(notificacao);
        }

        notificacao.textContent = mensagem;
        notificacao.style.opacity = "1";

        clearTimeout(notificacao._timer);

        notificacao._timer = setTimeout(() => {
            notificacao.style.opacity = "0";
        }, 2500);
    }


    /* =========================================
       ABRIR DETALHES DO PRODUTO
    ========================================= */

    function abrirDetalhesProduto(idProduto) {

        if (
            idProduto === undefined ||
            idProduto === null ||
            idProduto === ""
        ) {

            console.error(
                "Produto sem ID. Não é possível abrir os detalhes."
            );

            return;
        }

        window.location.href =
            `detalhes.html?id=${encodeURIComponent(idProduto)}`;
    }


    /* =========================================
       CARREGAR OFERTAS
    ========================================= */

    function carregarOfertas() {

        const produtos = buscarProdutos();

        /* =====================================
           FILTRAR PRODUTOS EM OFERTA
        ===================================== */

        const ofertas = produtos.filter(produto => {

            const preco = Number(
                produto["preço"] ?? produto.preco
            );

            const precoOferta = Number(
                produto["preçooferta"] ??
                produto.precoOferta ??
                produto.precooferta
            );

            return (
                (produto.oferta === true ||
                 produto.oferta === "true") &&
                Number.isFinite(preco) &&
                Number.isFinite(precoOferta) &&
                preco > 0 &&
                precoOferta > 0 &&
                precoOferta < preco
            );
        });


        /* =====================================
           LIMPAR GRID
        ===================================== */

        gridOfertas.innerHTML = "";

        if (ofertas.length === 0) {

            mensagemSemOfertas.hidden = false;
            return;
        }

        mensagemSemOfertas.hidden = true;


        /* =====================================
           CRIAR CARDS
        ===================================== */

        ofertas.forEach(produto => {

            const preco = Number(
                produto["preço"] ?? produto.preco
            );

            const precoOferta = Number(
                produto["preçooferta"] ??
                produto.precoOferta ??
                produto.precooferta
            );

            const desconto =
                calcularDesconto(preco, precoOferta);

            const nome =
                escaparHTML(produto.nome);

            const imagem =
                escaparHTML(produto.urlimagem || "");

            const avaliacao =
                Number(produto.avaliacao);

            const textoAvaliacao =
                Number.isFinite(avaliacao) && avaliacao > 0
                    ? avaliacao.toFixed(1)
                    : "0.0";

            const card =
                document.createElement("article");

            card.className = "card-oferta";

            /*
               O link abre os detalhes ao clicar
               na imagem ou no nome do produto.

               O botão de carrinho fica fora
               do link e funciona normalmente.
            */

            const linkDetalhes =
                `detalhes.html?id=${encodeURIComponent(produto.id)}`;

            card.innerHTML = `
                <div class="oferta-topo">

                    <span class="oferta-desconto">
                        -${desconto}% OFF
                    </span>

                    <span class="oferta-avaliacao">
                        <i class="fa-solid fa-star"></i>
                        ${textoAvaliacao}
                    </span>

                </div>

                <a
                    href="${linkDetalhes}"
                    class="oferta-link-imagem"
                    aria-label="Ver detalhes de ${nome}"
                >

                    <div class="oferta-imagem">

                        <img
                            src="${imagem}"
                            alt="${nome}"
                            loading="lazy"
                        >

                    </div>

                </a>

                <div class="oferta-info">

                    <a
                        href="${linkDetalhes}"
                        class="oferta-link-nome"
                    >

                        <h3 class="oferta-nome">
                            ${nome}
                        </h3>

                    </a>

                    <p class="oferta-preco-antigo">
                        ${formatarPreco(preco)}
                    </p>

                    <p class="oferta-preco">
                        ${formatarPreco(precoOferta)}
                    </p>

                    <button
                        type="button"
                        class="btn-adicionar-oferta"
                    >
                        ADICIONAR AO CARRINHO
                    </button>

                </div>
            `;

            /* =================================
               BOTÃO ADICIONAR AO CARRINHO
            ================================= */

            const botao = card.querySelector(
                ".btn-adicionar-oferta"
            );

            botao.addEventListener("click", evento => {

                evento.stopPropagation();

                adicionarAoCarrinho(produto);
            });


            /* =================================
               ACESSIBILIDADE DOS LINKS
            ================================= */

            const links = card.querySelectorAll(
                ".oferta-link-imagem, .oferta-link-nome"
            );

            links.forEach(link => {

                link.addEventListener("click", evento => {

                    evento.preventDefault();

                    abrirDetalhesProduto(produto.id);

                });

            });


            /* =================================
               INSERIR CARD
            ================================= */

            gridOfertas.appendChild(card);
        });
    }


    /* =========================================
       INICIAR
    ========================================= */

    carregarOfertas();
    atualizarContadorCarrinho();


    /* =========================================
       ATUALIZAR ENTRE ABAS
    ========================================= */

    window.addEventListener("storage", evento => {

        if (evento.key === "produtos") {
            carregarOfertas();
        }

        if (evento.key === "carrinho") {
            atualizarContadorCarrinho();
        }
    });

});
