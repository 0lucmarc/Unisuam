
/* =========================================
   HEADER - SPAN GAMES
========================================= */

fetch("header.html")

    .then(response => {

        if (!response.ok) {
            throw new Error(
                "Não foi possível carregar o header."
            );
        }

        return response.text();

    })

    .then(data => {

        /* =====================================
           COLOCAR HEADER NA PÁGINA
        ===================================== */

        const header =
            document.getElementById("header");

        if (!header) return;

        header.innerHTML = data;



/* =========================================
   PROTEGER CLIQUE NO CARRINHO
========================================= */

const linksCarrinho = header.querySelectorAll(
    'a[href*="carrinho.html"]'
);

linksCarrinho.forEach(function (link) {

    link.addEventListener("click", function (evento) {

        const usuarioLogado = JSON.parse(
            localStorage.getItem("usuarioLogado") || "null"
        );

        if (!usuarioLogado) {

            evento.preventDefault();

            localStorage.setItem(
                "redirecionarAposLogin",
                "carrinho.html"
            );

            window.location.href =
                "erro-pagamento-login.html";

        }

    });

});


        /* =====================================
           ELEMENTOS DO USUÁRIO
        ===================================== */

        let usuarioLogado = null;

        try {

            usuarioLogado = JSON.parse(
                localStorage.getItem("usuarioLogado")
            );

        } catch (erro) {

            console.error(
                "Erro ao carregar usuário:",
                erro
            );

        }

        const linkUsuario =
            document.getElementById("linkUsuario");

        const textoUsuario =
            document.getElementById("textoUsuario");

        const usuarioDropdown =
            document.getElementById("usuarioDropdown");

        const btnSair =
            document.getElementById("btnSair");


        /* =====================================
           USUÁRIO LOGADO
        ===================================== */

        if (usuarioLogado) {

            if (textoUsuario) {

                const nomeUsuario =
                    usuarioLogado.nome ||
                    usuarioLogado.login;

                textoUsuario.textContent =
                    `Olá, ${nomeUsuario}`;

            }


            if (linkUsuario) {

                linkUsuario.href = "#";

                linkUsuario.addEventListener(
                    "click",
                    function (evento) {

                        evento.preventDefault();

                    }
                );

            }


            /* =====================================
               BOTÃO SAIR
            ===================================== */

            if (btnSair) {

                btnSair.addEventListener(
                    "click",
                    function () {

                        /* APAGAR SESSÃO */

                        localStorage.removeItem(
                            "usuarioLogado"
                        );


                        /* VOLTAR PARA HOME */

                        window.location.href =
                            "index.html";

                    }
                );

            }

        }


        /* =====================================
           USUÁRIO NÃO LOGADO
        ===================================== */

        else {

            if (textoUsuario) {

                textoUsuario.textContent =
                    "Login / cadastro";

            }


            if (linkUsuario) {

                linkUsuario.href =
                    "login.html";

            }


            /*
               Sem login, não mostramos
               Editar perfil, Pedidos etc.
            */

            if (usuarioDropdown) {

                usuarioDropdown.style.display =
                    "none";

            }

        }


        /* =====================================
           BUSCA INTELIGENTE DE PRODUTOS
        ===================================== */

        function iniciarBuscaProdutos() {

            /*
               Procura o campo de pesquisa
               dentro do header compartilhado.
            */

            const campoBusca =
                header.querySelector(
                    'input[type="search"], .pesquisa input, .busca input, #buscaProdutos'
                );

            if (!campoBusca) {

                console.warn(
                    "Campo de busca não encontrado no header.html."
                );

                return;

            }

            /* =================================
               CRIAR ÁREA DE RESULTADOS
            ================================= */

            const containerBusca =
                campoBusca.parentElement;

            if (!containerBusca) return;

            containerBusca.style.position =
                "relative";

            const resultados =
                document.createElement("div");

            resultados.id =
                "resultadosBuscaHeader";

            resultados.className =
                "resultados-busca-header";

            resultados.setAttribute(
                "role",
                "listbox"
            );

            resultados.hidden = true;

            containerBusca.appendChild(
                resultados
            );


            /* =================================
               PROTEGER TEXTOS
            ================================= */

            function escaparHTML(valor) {

                return String(valor ?? "")
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#39;");

            }


            /* =================================
               NORMALIZAR TEXTO
            ================================= */

            function normalizarTexto(texto) {

                return String(texto ?? "")
                    .normalize("NFD")
                    .replace(
                        /[\u0300-\u036f]/g,
                        ""
                    )
                    .toLowerCase()
                    .trim();

            }


            /* =================================
               FORMATAR PREÇO
            ================================= */

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


            /* =================================
               BUSCAR PRODUTOS CADASTRADOS
            ================================= */

            function buscarProdutosCadastrados() {

                try {

                    const produtosSalvos =
                        JSON.parse(
                            localStorage.getItem(
                                "produtos"
                            ) || "[]"
                        );

                    return Array.isArray(
                        produtosSalvos
                    )
                        ? produtosSalvos
                        : [];

                } catch (erro) {

                    console.error(
                        "Erro ao buscar produtos:",
                        erro
                    );

                    return [];

                }

            }


            /* =================================
               BUSCAR PRODUTOS FIXOS
            ================================= */

            function buscarProdutosFixos() {

                /*
                   Em páginas que carregam
                   dadosprodutos.js ou produtos.js,
                   o array pode estar disponível.

                   typeof evita erro nas páginas
                   que não carregam esse arquivo.
                */

                if (
                    typeof produtos !== "undefined" &&
                    Array.isArray(produtos)
                ) {

                    return produtos;

                }

                return [];

            }


            /* =================================
               JUNTAR PRODUTOS
            ================================= */

            function obterTodosProdutos() {

                const mapa =
                    new Map();

                buscarProdutosFixos()
                    .forEach(produto => {

                        if (
                            produto.id === undefined ||
                            produto.id === null
                        ) {
                            return;
                        }

                        mapa.set(
                            String(produto.id),
                            produto
                        );

                    });


                /*
                   Os produtos cadastrados
                   têm prioridade quando
                   possuem o mesmo ID.
                */

                buscarProdutosCadastrados()
                    .forEach(produto => {

                        if (
                            produto.id === undefined ||
                            produto.id === null
                        ) {
                            return;
                        }

                        mapa.set(
                            String(produto.id),
                            produto
                        );

                    });

                return Array.from(
                    mapa.values()
                );

            }


            /* =================================
               OBTER PREÇO CORRETO
            ================================= */

            function obterPreco(produto) {

                const preco = Number(
                    produto["preço"] ??
                    produto.preco ??
                    0
                );

                const precoOferta = Number(
                    produto["preçooferta"] ??
                    produto.precoOferta ??
                    produto.precooferta ??
                    0
                );

                const emOferta =
                    produto.oferta === true ||
                    produto.oferta === "true";

                if (
                    emOferta &&
                    precoOferta > 0 &&
                    precoOferta < preco
                ) {

                    return precoOferta;

                }

                return preco;

            }


            /* =================================
               FECHAR RESULTADOS
            ================================= */

            function fecharResultados() {

                resultados.hidden = true;

                resultados.innerHTML = "";

            }


            /* =================================
               PESQUISAR PRODUTOS
            ================================= */

            function pesquisarProdutos() {

                const termo =
                    normalizarTexto(
                        campoBusca.value
                    );

                if (!termo) {

                    fecharResultados();
                    return;

                }

                const encontrados =
                    obterTodosProdutos()
                        .filter(produto => {

                            const nome =
                                normalizarTexto(
                                    produto.nome
                                );

                            return nome.includes(
                                termo
                            );

                        })
                        .slice(0, 6);


                resultados.innerHTML = "";

                resultados.hidden = false;


                /* =================================
                   NENHUM RESULTADO
                ================================= */

                if (
                    encontrados.length === 0
                ) {

                    const vazio =
                        document.createElement(
                            "div"
                        );

                    vazio.className =
                        "busca-sem-resultados";

                    vazio.textContent =
                        "Nenhum produto encontrado.";

                    resultados.appendChild(
                        vazio
                    );

                    return;

                }


                /* =================================
                   MOSTRAR PRODUTOS
                ================================= */

                encontrados.forEach(produto => {

                    const nome =
                        escaparHTML(
                            produto.nome
                        );

                    const imagem =
                        escaparHTML(
                            produto.urlimagem ||
                            produto.imagem ||
                            ""
                        );

                    const preco =
                        formatarPreco(
                            obterPreco(produto)
                        );

                    const id =
                        encodeURIComponent(
                            produto.id
                        );

                    const link =
                        document.createElement(
                            "a"
                        );

                    link.className =
                        "resultado-produto";

                    link.href =
                        `detalhes.html?id=${id}`;

                    link.setAttribute(
                        "role",
                        "option"
                    );

                    link.innerHTML = `

                        <div class="resultado-imagem">

                            ${
                                imagem
                                    ? `
                                        <img
                                            src="${imagem}"
                                            alt="${nome}"
                                        >
                                    `
                                    : `
                                        <i class="fa-solid fa-gamepad"></i>
                                    `
                            }

                        </div>

                        <div class="resultado-informacoes">

                            <span class="resultado-nome">
                                ${nome}
                            </span>

                            <strong class="resultado-preco">
                                ${preco}
                            </strong>

                        </div>

                        <i class="fa-solid fa-chevron-right resultado-seta"></i>

                    `;

                    resultados.appendChild(
                        link
                    );

                });

            }


            /* =================================
               DIGITAR NA PESQUISA
            ================================= */

            campoBusca.addEventListener(
                "input",
                pesquisarProdutos
            );


            /* =================================
               TECLA ESC
            ================================= */

            campoBusca.addEventListener(
                "keydown",
                function (evento) {

                    if (
                        evento.key === "Escape"
                    ) {

                        fecharResultados();

                        campoBusca.blur();

                    }

                    if (
                        evento.key === "Enter"
                    ) {

                        const primeiroResultado =
                            resultados.querySelector(
                                ".resultado-produto"
                            );

                        if (
                            primeiroResultado &&
                            !resultados.hidden
                        ) {

                            evento.preventDefault();

                            window.location.href =
                                primeiroResultado.href;

                        }

                    }

                }
            );


            /* =================================
               FECHAR AO CLICAR FORA
            ================================= */

            document.addEventListener(
                "click",
                function (evento) {

                    if (
                        !containerBusca.contains(
                            evento.target
                        )
                    ) {

                        fecharResultados();

                    }

                }
            );


            /* =================================
               REABRIR AO FOCAR
            ================================= */

            campoBusca.addEventListener(
                "focus",
                function () {

                    if (
                        campoBusca.value.trim()
                    ) {

                        pesquisarProdutos();

                    }

                }
            );


            /* =================================
               ATUALIZAR ENTRE ABAS
            ================================= */

            window.addEventListener(
                "storage",
                function (evento) {

                    if (
                        evento.key === "produtos" &&
                        campoBusca.value.trim()
                    ) {

                        pesquisarProdutos();

                    }

                }
            );

        }


        /* =====================================
           INICIAR BUSCA
        ===================================== */

        iniciarBuscaProdutos();



/* =========================================
   CONTADOR DO CARRINHO - SPAN GAMES
========================================= */

function atualizarContadorCarrinho() {

    const contador =
        document.getElementById("contadorCarrinho");

    if (!contador) return;

    try {

        const carrinho = JSON.parse(
            localStorage.getItem("carrinho") || "[]"
        );

        if (!Array.isArray(carrinho)) {
            contador.textContent = "0";
            return;
        }

        const total = carrinho.reduce(
            (soma, produto) => {

                return soma +
                    (Number(produto.quantidade) || 1);

            },
            0
        );

        contador.textContent = total;

    } catch (erro) {

        console.error(
            "Erro ao atualizar carrinho:",
            erro
        );

        contador.textContent = "0";

    }
}

/* ATUALIZAR QUANDO O HEADER CARREGAR */

atualizarContadorCarrinho();

/* ATUALIZAR ENTRE ABAS */

window.addEventListener("storage", evento => {

    if (evento.key === "carrinho") {
        atualizarContadorCarrinho();
    }

});

/* ATUALIZAR AO VOLTAR PARA A PÁGINA */

window.addEventListener("pageshow", () => {
    atualizarContadorCarrinho();
});

/* PERMITIR ATUALIZAÇÃO NA MESMA ABA */

window.atualizarContadorCarrinho =
    atualizarContadorCarrinho;


        /* =====================================
           CARREGAR ACESSIBILIDADE
        ===================================== */

        const scriptAcessibilidade =
            document.createElement("script");

        scriptAcessibilidade.src =
            "js/acessibilidade.js";

        document.body.appendChild(
            scriptAcessibilidade
        );

    })


    /* =========================================
       ERRO AO CARREGAR HEADER
    ========================================= */

    .catch(error => {

        console.error(
            "Erro ao carregar o header:",
            error
        );

    });