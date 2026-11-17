const inputImagem = document.getElementById("imagem");
const previewImagem = document.getElementById("previewImagem");
const btnSalvar = document.getElementById("btnSalvar");

const listaProdutosCadastrados =
    document.getElementById("listaProdutosCadastrados");


// Guarda o ID do produto que está sendo editado
let produtoEmEdicao = null;


// ================================
// PREVIEW DA IMAGEM
// ================================

inputImagem.addEventListener("change", () => {

    const arquivo = inputImagem.files[0];

    if (!arquivo) {
        return;
    }

    const leitor = new FileReader();

    leitor.onload = function (evento) {

        previewImagem.src = evento.target.result;

        previewImagem.style.display = "block";
    };

    leitor.readAsDataURL(arquivo);
});


// ================================
// SALVAR / EDITAR PRODUTO
// ================================

btnSalvar.addEventListener("click", () => {

    const nome =
        document.getElementById("nome").value.trim();

    const descricao =
        document.getElementById("descricao").value.trim();

    const categoria =
        document.getElementById("categoria").value;

    const preco =
        parseFloat(document.getElementById("preco").value);

    const precoOferta =
        parseFloat(document.getElementById("precoOferta").value);

    const estoque =
        parseInt(document.getElementById("estoque").value);

    const oferta =
        document.getElementById("oferta").checked;

    const destaque =
        document.getElementById("destaque").checked;


    // ================================
    // VALIDAÇÃO
    // ================================

    if (
        !nome ||
        !descricao ||
        !categoria ||
        isNaN(preco) ||
        isNaN(precoOferta) ||
        isNaN(estoque)
    ) {

        alert("Preencha todos os campos.");

        return;
    }


    // ================================
    // BUSCA PRODUTOS DO LOCALSTORAGE
    // ================================

    let produtosSalvos =
        JSON.parse(localStorage.getItem("produtos")) || [];


    // ================================
    // EDIÇÃO
    // ================================

    if (produtoEmEdicao !== null) {

        const indiceProduto =
            produtosSalvos.findIndex(
                produto => produto.id === produtoEmEdicao
            );

        if (indiceProduto === -1) {

            alert("Produto não encontrado.");

            return;
        }


        // Mantém a imagem antiga caso
        // nenhuma nova imagem seja escolhida

        const imagem =
            previewImagem.src ||
            produtosSalvos[indiceProduto].urlimagem;


        produtosSalvos[indiceProduto] = {

            ...produtosSalvos[indiceProduto],

            nome: nome,

            idcategoria: Number(categoria),

            descrição: descricao,

            preço: preco,

            preçooferta: precoOferta,

            quantidadedeestoque: estoque,

            urlimagem: imagem,

            oferta: oferta,

            destaque: destaque
        };


        localStorage.setItem(
            "produtos",
            JSON.stringify(produtosSalvos)
        );


        mostrarNotificacao("Produto atualizado com sucesso!");

        produtoEmEdicao = null;

        btnSalvar.textContent = "Salvar";

    }


    // ================================
    // NOVO PRODUTO
    // ================================

    else {

        const maiorIdExistente = Math.max(
            0,

            ...produtos.map(
                produto => produto.id
            ),

            ...produtosSalvos.map(
                produto => produto.id
            )
        );


        const novoId =
            maiorIdExistente + 1;


        const novoProduto = {

            id: novoId,

            nome: nome,

            idcategoria: Number(categoria),

            descrição: descricao,

            preço: preco,

            preçooferta: precoOferta,

            quantidadedeestoque: estoque,

            urlimagem: previewImagem.src || "",

            oferta: oferta,

            destaque: destaque
        };


        produtosSalvos.push(novoProduto);


        localStorage.setItem(
            "produtos",
            JSON.stringify(produtosSalvos)
        );


        alert("Produto cadastrado com sucesso!");
    }


    limparFormulario();

    mostrarProdutosCadastrados();

});


// ================================
// MOSTRAR PRODUTOS CADASTRADOS
// ================================

function mostrarProdutosCadastrados() {

    const produtosSalvos =
        JSON.parse(localStorage.getItem("produtos")) || [];


    listaProdutosCadastrados.innerHTML = "";


    if (produtosSalvos.length === 0) {

        listaProdutosCadastrados.innerHTML =
            "<p>Nenhum produto cadastrado.</p>";

        return;
    }


    produtosSalvos.forEach(produto => {

        listaProdutosCadastrados.innerHTML += `
            <div class="produto-cadastrado">

                <img
                    src="${produto.urlimagem}"
                    alt="${produto.nome}"
                >

                <div class="produto-cadastrado-info">

                    <strong>
                        ${produto.nome}
                    </strong>

                    <span>
                        R$ ${produto.preço
                            .toFixed(2)
                            .replace(".", ",")}
                    </span>

                </div>

                <div class="acoes-produto">

                    <button
                        type="button"
                        class="btn-editar"
                        onclick="editarProduto(${produto.id})"
                    >
                        <i class="fa-solid fa-pen"></i>
                        Editar
                    </button>

                    <button
                        type="button"
                        class="btn-excluir"
                        onclick="excluirProduto(${produto.id})"
                    >
                        <i class="fa-solid fa-trash"></i>
                        Excluir
                    </button>

                </div>

            </div>
        `;
    });
}


// ================================
// EDITAR PRODUTO
// ================================

function editarProduto(id) {

    const produtosSalvos =
        JSON.parse(localStorage.getItem("produtos")) || [];


    const produto =
        produtosSalvos.find(
            produto => produto.id === id
        );


    if (!produto) {
        return;
    }


    produtoEmEdicao = id;


    // Preenche o formulário

    document.getElementById("nome").value =
        produto.nome;

    document.getElementById("descricao").value =
        produto.descrição;

    document.getElementById("categoria").value =
        produto.idcategoria;

    document.getElementById("preco").value =
        produto.preço;

    document.getElementById("precoOferta").value =
        produto.preçooferta;

    document.getElementById("estoque").value =
        produto.quantidadedeestoque;

    document.getElementById("oferta").checked =
        produto.oferta;

    document.getElementById("destaque").checked =
        produto.destaque;


    // Mostra a imagem atual

    if (produto.urlimagem) {

        previewImagem.src =
            produto.urlimagem;

        previewImagem.style.display =
            "block";
    }


    // Muda o texto do botão

    btnSalvar.textContent =
        "Salvar alterações";


    // Volta para o formulário

    document
        .querySelector(".formulario-produto")
        .scrollIntoView({
            behavior: "smooth"
        });
}


// ================================
// EXCLUIR PRODUTO
// ================================

function excluirProduto(id) {

    const confirmar =
        confirm("Deseja excluir este produto?");


    if (!confirmar) {
        return;
    }


    let produtosSalvos =
        JSON.parse(localStorage.getItem("produtos")) || [];


    produtosSalvos =
        produtosSalvos.filter(
            produto => produto.id !== id
        );


    localStorage.setItem(
        "produtos",
        JSON.stringify(produtosSalvos)
    );


    // Se estiver editando justamente
    // o produto excluído

    if (produtoEmEdicao === id) {

        produtoEmEdicao = null;

        btnSalvar.textContent = "Salvar";

        limparFormulario();
    }


    mostrarProdutosCadastrados();
}


// ================================
// LIMPAR FORMULÁRIO
// ================================

function limparFormulario() {

    document.getElementById("nome").value = "";

    document.getElementById("descricao").value = "";

    document.getElementById("categoria").value = "";

    document.getElementById("preco").value = "";

    document.getElementById("precoOferta").value = "";

    document.getElementById("estoque").value = "";

    document.getElementById("oferta").checked = false;

    document.getElementById("destaque").checked = false;


    inputImagem.value = "";

    previewImagem.src = "";

    previewImagem.style.display = "none";
}


// ================================
// MOSTRA A LISTA AO ABRIR A PÁGINA
// ================================

mostrarProdutosCadastrados();


/* =========================================
   NOTIFICAÇÃO PERSONALIZADA - SPAN GAMES
========================================= */

let temporizadorNotificacao;

function mostrarNotificacao(mensagem, tipo = "sucesso") {

    let notificacao =
        document.getElementById("notificacaoProduto");

    if (!notificacao) {
        notificacao = document.createElement("div");
        notificacao.id = "notificacaoProduto";
        notificacao.className = "notificacao-produto";
        notificacao.setAttribute("role", "status");
        notificacao.setAttribute("aria-live", "polite");
        document.body.appendChild(notificacao);
    }

    notificacao.textContent = mensagem;

    notificacao.className =
        `notificacao-produto ${tipo} mostrar`;

    clearTimeout(temporizadorNotificacao);

    temporizadorNotificacao = setTimeout(() => {
        notificacao.classList.remove("mostrar");
    }, 3000);
}
