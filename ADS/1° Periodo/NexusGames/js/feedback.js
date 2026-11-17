/* =========================================
   FEEDBACK - SPAN GAMES
========================================= */


/* =========================================
   ELEMENTOS
========================================= */

const formFeedback =
    document.getElementById("formFeedback");

const telaFormulario =
    document.getElementById("telaFormulario");

const telaConfirmacao =
    document.getElementById("telaConfirmacao");

const feedbackMensagem =
    document.getElementById("feedbackMensagem");

const estrelas =
    document.querySelectorAll(".estrela");

const btnEditarFeedback =
    document.getElementById("btnEditarFeedback");


/* =========================================
   CONFIRMAÇÃO
========================================= */

const confirmacaoCategorias =
    document.getElementById(
        "confirmacaoCategorias"
    );

const confirmacaoInteresses =
    document.getElementById(
        "confirmacaoInteresses"
    );

const confirmacaoGostou =
    document.getElementById(
        "confirmacaoGostou"
    );

const confirmacaoAvaliacao =
    document.getElementById(
        "confirmacaoAvaliacao"
    );


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
   AVALIAÇÃO
========================================= */

let avaliacaoSelecionada = 0;


/* =========================================
   CONTROLAR ESTRELAS
========================================= */

function atualizarEstrelas(valor) {

    estrelas.forEach(function (estrela) {

        const valorEstrela =
            Number(
                estrela.dataset.valor
            );


        if (
            valorEstrela <= valor
        ) {

            estrela.classList.add(
                "ativa"
            );

        } else {

            estrela.classList.remove(
                "ativa"
            );

        }

    });

}


/* =========================================
   CLIQUE NAS ESTRELAS
========================================= */

estrelas.forEach(
    function (estrela) {

        estrela.addEventListener(
            "click",
            function () {

                avaliacaoSelecionada =
                    Number(
                        estrela.dataset.valor
                    );

                atualizarEstrelas(
                    avaliacaoSelecionada
                );

                feedbackMensagem.textContent =
                    "";

            }
        );

    }
);


/* =========================================
   HOVER NAS ESTRELAS
========================================= */

estrelas.forEach(
    function (estrela) {

        estrela.addEventListener(
            "mouseenter",
            function () {

                const valor =
                    Number(
                        estrela.dataset.valor
                    );

                atualizarEstrelas(
                    valor
                );

            }
        );


        estrela.addEventListener(
            "mouseleave",
            function () {

                atualizarEstrelas(
                    avaliacaoSelecionada
                );

            }
        );

    }
);


/* =========================================
   PEGAR CHECKBOX MARCADOS
========================================= */

function pegarSelecionados(nome) {

    const selecionados =
        document.querySelectorAll(
            `input[name="${nome}"]:checked`
        );


    return Array.from(
        selecionados
    ).map(
        function (input) {

            return input.value;

        }
    );

}


/* =========================================
   PEGAR RADIO
========================================= */

function pegarRadioSelecionado() {

    const selecionado =
        document.querySelector(
            'input[name="maisGostou"]:checked'
        );


    if (selecionado) {

        return selecionado.value;

    }


    return "";

}


/* =========================================
   PEGAR FEEDBACKS
========================================= */

function pegarFeedbacks() {

    return (
        JSON.parse(
            localStorage.getItem(
                "feedbacks"
            )
        ) || []
    );

}


/* =========================================
   IDENTIFICADOR DO USUÁRIO
========================================= */

function identificarUsuario() {

    /*
       Usamos o login porque cada conta
       possui um login diferente.
    */

    return usuarioLogado.login;

}


/* =========================================
   PROCURAR FEEDBACK DO USUÁRIO
========================================= */

function procurarFeedbackUsuario() {

    const feedbacks =
        pegarFeedbacks();

    const identificador =
        identificarUsuario();


    return feedbacks.find(
        function (feedback) {

            return (
                feedback.usuario ===
                identificador
            );

        }
    );

}


/* =========================================
   SALVAR FEEDBACK
========================================= */

function salvarFeedback(dados) {

    const feedbacks =
        pegarFeedbacks();

    const identificador =
        identificarUsuario();


    const indice =
        feedbacks.findIndex(
            function (feedback) {

                return (
                    feedback.usuario ===
                    identificador
                );

            }
        );


    /*
       Se já existir feedback desse usuário,
       atualizamos em vez de duplicar.
    */

    if (indice !== -1) {

        feedbacks[indice] =
            dados;

    } else {

        feedbacks.push(
            dados
        );

    }


    localStorage.setItem(
        "feedbacks",
        JSON.stringify(feedbacks)
    );

}


/* =========================================
   CRIAR ITEM DE CONFIRMAÇÃO
========================================= */

function criarItensConfirmacao(
    elemento,
    itens
) {

    elemento.innerHTML = "";


    if (itens.length === 0) {

        elemento.innerHTML = `
            <div class="confirmacao-item">
                Nenhuma opção selecionada
            </div>
        `;

        return;

    }


    itens.forEach(
        function (item) {

            const div =
                document.createElement(
                    "div"
                );

            div.classList.add(
                "confirmacao-item"
            );

            div.textContent =
                item;

            elemento.appendChild(
                div
            );

        }
    );

}


/* =========================================
   MOSTRAR CONFIRMAÇÃO
========================================= */

function mostrarConfirmacao(
    feedback
) {

    criarItensConfirmacao(
        confirmacaoCategorias,
        feedback.categorias
    );


    criarItensConfirmacao(
        confirmacaoInteresses,
        feedback.interesses
    );


    confirmacaoGostou.textContent =
        feedback.maisGostou;


    /* =====================================
       ESTRELAS DA CONFIRMAÇÃO
    ===================================== */

    let estrelasHTML = "";


    for (
        let i = 1;
        i <= 5;
        i++
    ) {

        if (
            i <= feedback.avaliacao
        ) {

            estrelasHTML += "★";

        } else {

            estrelasHTML += "☆";

        }

    }


    confirmacaoAvaliacao.textContent =
        estrelasHTML;


    /* =====================================
       TROCAR TELA
    ===================================== */

    telaFormulario.hidden =
        true;

    telaConfirmacao.hidden =
        false;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================
   SALVAR FORMULÁRIO
========================================= */

formFeedback.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();


        feedbackMensagem.textContent =
            "";


        /* =====================================
           PEGAR DADOS
        ===================================== */

        const categorias =
            pegarSelecionados(
                "categorias"
            );

        const interesses =
            pegarSelecionados(
                "interesses"
            );

        const maisGostou =
            pegarRadioSelecionado();


        /* =====================================
           VALIDAR
        ===================================== */

        if (
            categorias.length === 0
        ) {

            feedbackMensagem.textContent =
                "Selecione pelo menos uma categoria.";

            return;

        }


        if (
            interesses.length === 0
        ) {

            feedbackMensagem.textContent =
                "Selecione pelo menos um interesse.";

            return;

        }


        if (
            avaliacaoSelecionada === 0
        ) {

            feedbackMensagem.textContent =
                "Selecione uma avaliação.";

            return;

        }


        if (!maisGostou) {

            feedbackMensagem.textContent =
                "Selecione o que você mais gostou.";

            return;

        }


        /* =====================================
           MONTAR FEEDBACK
        ===================================== */

        const feedback = {

            usuario:
                identificarUsuario(),

            categorias:
                categorias,

            interesses:
                interesses,

            avaliacao:
                avaliacaoSelecionada,

            maisGostou:
                maisGostou,

            dataAtualizacao:
                new Date().toISOString()

        };


        /* =====================================
           SALVAR
        ===================================== */

        salvarFeedback(
            feedback
        );


        /* =====================================
           MOSTRAR CONFIRMAÇÃO
        ===================================== */

        mostrarConfirmacao(
            feedback
        );

    }
);


/* =========================================
   MARCAR CHECKBOXES SALVOS
========================================= */

function marcarCheckboxes(
    nome,
    valores
) {

    const inputs =
        document.querySelectorAll(
            `input[name="${nome}"]`
        );


    inputs.forEach(
        function (input) {

            input.checked =
                valores.includes(
                    input.value
                );

        }
    );

}


/* =========================================
   CARREGAR FEEDBACK NO FORMULÁRIO
========================================= */

function carregarFeedbackFormulario(
    feedback
) {

    marcarCheckboxes(
        "categorias",
        feedback.categorias || []
    );


    marcarCheckboxes(
        "interesses",
        feedback.interesses || []
    );


    /* =====================================
       RADIO
    ===================================== */

    const radios =
        document.querySelectorAll(
            'input[name="maisGostou"]'
        );


    radios.forEach(
        function (radio) {

            radio.checked =
                radio.value ===
                feedback.maisGostou;

        }
    );


    /* =====================================
       ESTRELAS
    ===================================== */

    avaliacaoSelecionada =
        Number(
            feedback.avaliacao
        ) || 0;


    atualizarEstrelas(
        avaliacaoSelecionada
    );

}


/* =========================================
   EDITAR PREFERÊNCIAS
========================================= */

btnEditarFeedback.addEventListener(
    "click",
    function () {

        const feedback =
            procurarFeedbackUsuario();


        if (feedback) {

            carregarFeedbackFormulario(
                feedback
            );

        }


        telaConfirmacao.hidden =
            true;

        telaFormulario.hidden =
            false;


        feedbackMensagem.textContent =
            "";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);


/* =========================================
   CARREGAR PÁGINA
========================================= */

function iniciarFeedback() {

    const feedback =
        procurarFeedbackUsuario();


    /*
       Se o usuário já respondeu antes,
       mostramos a confirmação.
    */

    if (feedback) {

        carregarFeedbackFormulario(
            feedback
        );

        mostrarConfirmacao(
            feedback
        );

    }

}


/* =========================================
   INICIAR
========================================= */

if (usuarioLogado) {

    iniciarFeedback();

}