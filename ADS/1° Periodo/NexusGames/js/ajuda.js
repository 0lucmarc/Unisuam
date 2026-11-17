/* =========================================
   SPAN GAMES
   CENTRAL DE AJUDA + CONTATO
========================================= */


/* =========================================
   FAQ - ABRIR E FECHAR PERGUNTAS
========================================= */

const perguntasFAQ = document.querySelectorAll(".faq-pergunta");

perguntasFAQ.forEach(function (pergunta) {

    pergunta.addEventListener("click", function () {

        const itemAtual = pergunta.closest(".faq-item");

        /*
            Fecha as outras perguntas abertas.
            Assim fica somente uma aberta por vez.
        */

        document.querySelectorAll(".faq-item").forEach(function (item) {

            if (item !== itemAtual) {
                item.classList.remove("ativo");
            }

        });

        /*
            Abre ou fecha a pergunta clicada.
        */

        itemAtual.classList.toggle("ativo");

    });

});


/* =========================================
   PESQUISA DAS DÚVIDAS
========================================= */

const pesquisaAjuda = document.querySelector("#pesquisaAjuda");

const itensFAQ = document.querySelectorAll(".faq-item");

const semResultado = document.querySelector("#semResultado");


pesquisaAjuda.addEventListener("input", function () {

    const pesquisa = pesquisaAjuda.value
        .toLowerCase()
        .trim();

    let encontrouResultado = false;


    itensFAQ.forEach(function (item) {

        const pergunta = item
            .querySelector(".faq-pergunta")
            .textContent
            .toLowerCase();

        const resposta = item
            .querySelector(".faq-resposta")
            .textContent
            .toLowerCase();


        /*
            Pesquisa tanto na pergunta
            quanto na resposta.
        */

        const encontrou =
            pergunta.includes(pesquisa) ||
            resposta.includes(pesquisa);


        if (encontrou) {

            item.style.display = "";

            encontrouResultado = true;

        } else {

            item.style.display = "none";

            item.classList.remove("ativo");

        }

    });


    /*
        Se não encontrar nenhuma pergunta,
        mostra a mensagem.
    */

    if (encontrouResultado) {

        semResultado.classList.remove("exibir");

    } else {

        semResultado.classList.add("exibir");

    }

});


/* =========================================
   FORMULÁRIO DE CONTATO
========================================= */

const formContato = document.querySelector("#formContato");

const nomeContato = document.querySelector("#nomeContato");

const emailContato = document.querySelector("#emailContato");

const assuntoContato = document.querySelector("#assuntoContato");

const mensagemContato = document.querySelector("#mensagemContato");

const mensagemEnviada = document.querySelector("#mensagemEnviada");


/* =========================================
   LABELS FLUTUANTES
========================================= */

const camposContato = document.querySelectorAll(
    ".campo-contato input, .campo-contato textarea"
);


camposContato.forEach(function (campo) {

    /*
        Verifica o campo enquanto
        o usuário digita.
    */

    campo.addEventListener("input", function () {

        atualizarLabel(campo);

    });


    /*
        Também verifica quando o usuário
        sai do campo.
    */

    campo.addEventListener("blur", function () {

        atualizarLabel(campo);

    });


    /*
        Verifica caso o navegador já
        tenha preenchido alguma informação.
    */

    atualizarLabel(campo);

});


function atualizarLabel(campo) {

    const campoPai = campo.closest(".campo-contato");

    if (campo.value.trim() !== "") {

        campoPai.classList.add("campo-preenchido");

    } else {

        campoPai.classList.remove("campo-preenchido");

    }

}


/* =========================================
   MOSTRAR ERRO
========================================= */

function mostrarErro(campo, mensagem) {

    const campoPai = campo.closest(".campo-contato");

    const erro = campoPai.querySelector(".erro-contato");


    campoPai.classList.add("erro");

    erro.textContent = mensagem;

    erro.classList.add("exibir");

}


/* =========================================
   REMOVER ERRO
========================================= */

function removerErro(campo) {

    const campoPai = campo.closest(".campo-contato");

    const erro = campoPai.querySelector(".erro-contato");


    campoPai.classList.remove("erro");

    erro.textContent = "";

    erro.classList.remove("exibir");

}


/* =========================================
   VALIDAR E-MAIL
========================================= */

function emailValido(email) {

    const formatoEmail =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return formatoEmail.test(email);

}


/* =========================================
   VALIDAR NOME
========================================= */

function validarNome() {

    const nome = nomeContato.value.trim();


    if (nome === "") {

        mostrarErro(
            nomeContato,
            "Digite seu nome."
        );

        return false;

    }


    if (nome.length < 3) {

        mostrarErro(
            nomeContato,
            "O nome deve possuir pelo menos 3 caracteres."
        );

        return false;

    }


    removerErro(nomeContato);

    return true;

}


/* =========================================
   VALIDAR E-MAIL
========================================= */

function validarEmail() {

    const email = emailContato.value.trim();


    if (email === "") {

        mostrarErro(
            emailContato,
            "Digite seu e-mail."
        );

        return false;

    }


    if (!emailValido(email)) {

        mostrarErro(
            emailContato,
            "Digite um e-mail válido."
        );

        return false;

    }


    removerErro(emailContato);

    return true;

}


/* =========================================
   VALIDAR ASSUNTO
========================================= */

function validarAssunto() {

    const assunto = assuntoContato.value.trim();


    if (assunto === "") {

        mostrarErro(
            assuntoContato,
            "Digite o assunto da mensagem."
        );

        return false;

    }


    if (assunto.length < 3) {

        mostrarErro(
            assuntoContato,
            "O assunto deve possuir pelo menos 3 caracteres."
        );

        return false;

    }


    removerErro(assuntoContato);

    return true;

}


/* =========================================
   VALIDAR MENSAGEM
========================================= */

function validarMensagem() {

    const mensagem = mensagemContato.value.trim();


    if (mensagem === "") {

        mostrarErro(
            mensagemContato,
            "Digite sua mensagem."
        );

        return false;

    }


    if (mensagem.length < 10) {

        mostrarErro(
            mensagemContato,
            "A mensagem deve possuir pelo menos 10 caracteres."
        );

        return false;

    }


    removerErro(mensagemContato);

    return true;

}


/* =========================================
   VALIDAÇÃO ENQUANTO DIGITA
========================================= */

nomeContato.addEventListener("input", function () {

    if (nomeContato.value.trim() !== "") {
        validarNome();
    }

});


emailContato.addEventListener("input", function () {

    if (emailContato.value.trim() !== "") {
        validarEmail();
    }

});


assuntoContato.addEventListener("input", function () {

    if (assuntoContato.value.trim() !== "") {
        validarAssunto();
    }

});


mensagemContato.addEventListener("input", function () {

    if (mensagemContato.value.trim() !== "") {
        validarMensagem();
    }

});


/* =========================================
   ENVIO DO FORMULÁRIO
========================================= */

formContato.addEventListener("submit", function (evento) {

    /*
        Impede o formulário de atualizar
        a página.
    */

    evento.preventDefault();


    /*
        Faz todas as validações.
    */

    const nomeEstaValido = validarNome();

    const emailEstaValido = validarEmail();

    const assuntoEstaValido = validarAssunto();

    const mensagemEstaValida = validarMensagem();


    /*
        Se algum campo estiver errado,
        não continua.
    */

    if (
        !nomeEstaValido ||
        !emailEstaValido ||
        !assuntoEstaValido ||
        !mensagemEstaValida
    ) {

        mensagemEnviada.classList.remove("exibir");

        return;

    }


    /* =====================================
       SIMULAÇÃO DO ENVIO
    ===================================== */

    mensagemEnviada.classList.add("exibir");


    /*
        Limpa o formulário.
    */

    formContato.reset();


    /*
        Faz os labels voltarem
        para a posição inicial.
    */

    camposContato.forEach(function (campo) {

        atualizarLabel(campo);

        removerErro(campo);

    });


    /*
        Depois de alguns segundos,
        remove a mensagem de sucesso.
    */

    setTimeout(function () {

        mensagemEnviada.classList.remove("exibir");

    }, 5000);

});