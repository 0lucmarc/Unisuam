
/* =========================================
   SPAN GAMES - PRODUTOS
========================================= */

/* =========================================
   PRODUTOS FIXOS
========================================= */

const produtos = [

    {
        id: 1,
        nome: "Teclado Mecânico Gamer RGB",
        idcategoria: 4,
        descrição: "Teclado mecânico gamer com iluminação RGB e switches de alta precisão.",
        preço: 299.90,
        preçooferta: 249.90,
        quantidadedeestoque: 15,
        urlimagem: "assets/imagens/tecladoredragao.png",
        oferta: true,
        destaque: true
    },

    {
        id: 3,
        nome: "Fone Gamer Redragon",
        idcategoria: 3,
        descrição: "Fone gamer com áudio de qualidade e conforto para longas sessões.",
        preço: 159.90,
        preçooferta: 119.90,
        quantidadedeestoque: 15,
        urlimagem: "assets/imagens/foneredragao.png",
        oferta: true,
        destaque: true
    },

      {
        id: 11,
        nome: "Mouse Gamer Razer Deathadder Essential, LED Verde, 6400 DPI, 5 Botões, Preto",
        idcategoria: 1,
        descrição: "Por mais de uma década, a linha Razer DeathAdder tem sido um pilar na arena global de esportes eletrônicos. Ele conquistou uma reputação de confiabilidade que os jogadores confiam devido à sua durabilidade e ergonomia comprovadas. Agora, estamos tornando-o ainda mais acessível com seu mais recente sucessor - o Razer DeathAdder Essential.",
        preço: 388.22,
        preçooferta: 139.99,
        quantidadedeestoque: 30,
        urlimagem: "assets/imagens/MouseGamerRazerDeathadder.png",
        oferta: true,
        destaque: true
    },

      {
        id: 5,
        nome: "Controle Sem Fio Sony DualSense, PlayStation 5, Bluetooth, Branco",
        idcategoria: 5,
        descrição: "Controle sem fio compatível com PC, oferecendo conforto e resposta rápida.",
        preço: 499.00,
        preçooferta: 398.97,
        quantidadedeestoque: 30,
        urlimagem: "assets/imagens/controleps5.png",
        oferta: true,
        destaque: true
    },
      {
        id: 7,
        nome: "Mouse Gamer Sem Fio Logitech G305 Lightspeed, 12.000 DPI, 6 Botões Programáveis, Branco",
        idcategoria: 1,
        descrição: "Sensor HERO com 200 a 12.000 DPI, oferecendo precisão de nível profissional",
        preço:  431.81,
        preçooferta: 169.90,
        quantidadedeestoque: 60,
        urlimagem: "assets/imagens/mouselogitech.png",
        oferta: true,
        destaque: true
    },

      {
        id: 8,
        nome: "Notebook Gamer Acer Nitro V16, Intel Core 5 210H, 8GB RAM, SSD 512GB, RTX 5060, Tela 16",
        idcategoria: 2,
        descrição: "Desempenho Superior: Processador Intel Core i5 e NVIDIA RTX 5060 para jogos e multitarefas sem limites.",
        preço: 9999,
        preçooferta: 6389,
        quantidadedeestoque: 15,
        urlimagem: "assets/imagens/NotebookGamerAcerNitroV16.png",
        oferta: true,
        destaque: true
    },
];


/* =========================================
   BUSCAR PRODUTOS CADASTRADOS
========================================= */

function buscarProdutosCadastrados() {

    try {

        const produtosSalvos = JSON.parse(
            localStorage.getItem("produtos") || "[]"
        );

        return Array.isArray(produtosSalvos)
            ? produtosSalvos
            : [];

    } catch (erro) {

        console.error(
            "Erro ao carregar produtos cadastrados:",
            erro
        );

        return [];
    }

}


/* =========================================
   JUNTAR PRODUTOS
========================================= */

function obterTodosProdutos() {

    const produtosCadastrados =
        buscarProdutosCadastrados();

    const mapaProdutos = new Map();

    /*
       Primeiro adicionamos os produtos fixos.
    */

    produtos.forEach(produto => {

        mapaProdutos.set(
            String(produto.id),
            produto
        );

    });

    /*
       Depois adicionamos os cadastrados.

       Se um ID já existir, a versão
       cadastrada terá prioridade.
    */

    produtosCadastrados.forEach(produto => {

        mapaProdutos.set(
            String(produto.id),
            produto
        );

    });

    return Array.from(
        mapaProdutos.values()
    );

}


/* =========================================
   FILTRAR PRODUTOS EM DESTAQUE
========================================= */

function obterProdutosDestaque() {

    return obterTodosProdutos().filter(
        produto =>
            produto.destaque === true ||
            produto.destaque === "true"
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
   RENDERIZAR PRODUTOS EM DESTAQUE
========================================= */

function carregarProdutosDestaque() {

    const listaProdutos =
        document.getElementById("listaProdutos");

    if (!listaProdutos) {
        return;
    }

    const produtosDestaque =
        obterProdutosDestaque();

    listaProdutos.innerHTML = "";

    if (produtosDestaque.length === 0) {

        listaProdutos.innerHTML = `
            <p class="sem-destaques">
                Nenhum produto em destaque no momento.
            </p>
        `;

        return;
    }

    produtosDestaque.forEach(produto => {

        const nome =
            escaparHTML(produto.nome);

        const imagem =
            escaparHTML(produto.urlimagem || "");

        const id =
            encodeURIComponent(produto.id);

        const card =
            document.createElement("div");

        card.className = "produto-card";

        card.innerHTML = `

            <a
                href="detalhes.html?id=${id}"
                class="link-produto-destaque"
                aria-label="Ver detalhes de ${nome}"
            >

                <img
                    src="${imagem}"
                    alt="${nome}"
                    loading="lazy"
                >

                <p>${nome}</p>

            </a>

        `;

        listaProdutos.appendChild(card);

    });

}


/* =========================================
   CARROSSEL
========================================= */

const btnAnterior =
    document.getElementById("anterior");

const btnProximo =
    document.getElementById("proximo");

const listaProdutos =
    document.getElementById("listaProdutos");

if (
    btnAnterior &&
    btnProximo &&
    listaProdutos
) {

    btnProximo.addEventListener("click", () => {

        listaProdutos.scrollBy({
            left: 250,
            behavior: "smooth"
        });

    });

    btnAnterior.addEventListener("click", () => {

        listaProdutos.scrollBy({
            left: -250,
            behavior: "smooth"
        });

    });

}


/* =========================================
   INICIAR
========================================= */

carregarProdutosDestaque();


/* =========================================
   ATUALIZAR ENTRE ABAS
========================================= */

window.addEventListener("storage", evento => {

    if (evento.key === "produtos") {

        carregarProdutosDestaque();

    }

});
