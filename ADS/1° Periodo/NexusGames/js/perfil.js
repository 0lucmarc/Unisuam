
/* =========================================
   EDITAR PERFIL - SPAN GAMES
========================================= */

/* =========================================
   ELEMENTOS DO FORMULÁRIO
========================================= */

const formPerfil =
    document.getElementById("formPerfil");

const perfilNome =
    document.getElementById("perfilNome");

const perfilCpf =
    document.getElementById("perfilCpf");

const perfilEmail =
    document.getElementById("perfilEmail");

const perfilCep =
    document.getElementById("perfilCep");

const perfilRua =
    document.getElementById("perfilRua");

const perfilBairro =
    document.getElementById("perfilBairro");

const perfilCidade =
    document.getElementById("perfilCidade");

const perfilUf =
    document.getElementById("perfilUf");

const perfilNumero =
    document.getElementById("perfilNumero");

const perfilCelular =
    document.getElementById("perfilCelular");

const perfilLogin =
    document.getElementById("perfilLogin");

const perfilSenha =
    document.getElementById("perfilSenha");

const perfilConfirmarSenha =
    document.getElementById("perfilConfirmarSenha");

const perfilMensagem =
    document.getElementById("perfilMensagem");


/* =========================================
   PEGAR USUÁRIO LOGADO
========================================= */

let usuarioLogado =
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
   PEGAR USUÁRIOS CADASTRADOS
========================================= */

let usuarios =
    JSON.parse(
        localStorage.getItem("usuarios")
    ) || [];


/* =========================================
   PROCURAR USUÁRIO CADASTRADO
========================================= */

let indiceUsuario = usuarioLogado
    ? usuarios.findIndex(
        function (usuario) {
            return (
                usuario.login ===
                usuarioLogado.login
            );
        }
    )
    : -1;

let usuarioCompleto = null;


/* =========================================
   USUÁRIO REAL CADASTRADO
========================================= */

if (indiceUsuario !== -1) {

    usuarioCompleto =
        usuarios[indiceUsuario];

}

/* =========================================
   CONTA TESTER
========================================= */

else if (usuarioLogado) {

    usuarioCompleto = {

        nome:
            usuarioLogado.nome || "",

        cpf:
            "000.000.000-00",

        email:
            usuarioLogado.email || "",

        cep:
            "",

        rua:
            "",

        bairro:
            "",

        cidade:
            "",

        uf:
            "",

        numero:
            usuarioLogado.numero || "",

        celular:
            "",

        login:
            usuarioLogado.login || "",

        senha:
            ""

    };

}


/* =========================================
   PREENCHER FORMULÁRIO
========================================= */

if (usuarioCompleto) {

    if (perfilNome) {
        perfilNome.value =
            usuarioCompleto.nome || "";
    }

    if (perfilCpf) {

        perfilCpf.value =
            usuarioCompleto.cpf || "";

        // CPF não pode ser alterado
        perfilCpf.readOnly = true;
    }

    if (perfilEmail) {
        perfilEmail.value =
            usuarioCompleto.email || "";
    }

    if (perfilCep) {
        perfilCep.value =
            usuarioCompleto.cep || "";
    }

    if (perfilRua) {
        perfilRua.value =
            usuarioCompleto.rua || "";
    }

    if (perfilBairro) {
        perfilBairro.value =
            usuarioCompleto.bairro || "";
    }

    if (perfilCidade) {
        perfilCidade.value =
            usuarioCompleto.cidade || "";
    }

    if (perfilUf) {
        perfilUf.value =
            usuarioCompleto.uf || "";
    }

    /* NÚMERO DA RESIDÊNCIA */

    if (perfilNumero) {
        perfilNumero.value =
            usuarioCompleto.numero ?? "";
    }

    if (perfilCelular) {
        perfilCelular.value =
            usuarioCompleto.celular || "";
    }

    if (perfilLogin) {
        perfilLogin.value =
            usuarioCompleto.login || "";
    }

    /*
       Não mostramos a senha antiga.
       Os campos ficam vazios.
    */

    if (perfilSenha) {
        perfilSenha.value = "";
    }

    if (perfilConfirmarSenha) {
        perfilConfirmarSenha.value = "";
    }

}


/* =========================================
   SALVAR ALTERAÇÕES
========================================= */

if (formPerfil) {

    formPerfil.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();

            /* =================================
               PEGAR NOVOS DADOS
            ================================= */

            const novoNome =
                perfilNome
                    ? perfilNome.value.trim()
                    : "";

            const novoEmail =
                perfilEmail
                    ? perfilEmail.value.trim()
                    : "";

            const novoCep =
                perfilCep
                    ? perfilCep.value.trim()
                    : "";

            const novaRua =
                perfilRua
                    ? perfilRua.value.trim()
                    : "";

            const novoBairro =
                perfilBairro
                    ? perfilBairro.value.trim()
                    : "";

            const novaCidade =
                perfilCidade
                    ? perfilCidade.value.trim()
                    : "";

            const novaUf =
                perfilUf
                    ? perfilUf.value.trim()
                    : "";

            /* NÚMERO DA RESIDÊNCIA */

            const novoNumero =
                perfilNumero
                    ? perfilNumero.value.trim()
                    : (usuarioCompleto.numero ?? "");

            const novoCelular =
                perfilCelular
                    ? perfilCelular.value.trim()
                    : "";

            const novoLogin =
                perfilLogin
                    ? perfilLogin.value.trim()
                    : "";

            const novaSenha =
                perfilSenha
                    ? perfilSenha.value
                    : "";

            const confirmarSenha =
                perfilConfirmarSenha
                    ? perfilConfirmarSenha.value
                    : "";


            /* =================================
               VALIDAR CAMPOS PRINCIPAIS
            ================================= */

            if (
                !novoNome ||
                !novoEmail ||
                !novoLogin
            ) {

                mostrarMensagem(
                    "Preencha nome, e-mail e login.",
                    "erro"
                );

                return;
            }

            /* =================================
               VALIDAR NÚMERO DA RESIDÊNCIA
            ================================= */

            if (
                perfilNumero &&
                !/^\d{1,10}$/.test(novoNumero)
            ) {

                mostrarMensagem(
                    "Informe um número de residência válido.",
                    "erro"
                );

                return;
            }

            /* =================================
               VERIFICAR LOGIN REPETIDO
            ================================= */

            const loginJaExiste =
                usuarios.some(
                    function (usuario, indice) {

                        return (
                            usuario.login === novoLogin &&
                            indice !== indiceUsuario
                        );

                    }
                );

            if (loginJaExiste) {

                mostrarMensagem(
                    "Esse login já está sendo utilizado.",
                    "erro"
                );

                return;
            }

            /* =================================
               VALIDAR NOVA SENHA
            ================================= */

            if (
                novaSenha ||
                confirmarSenha
            ) {

                if (
                    novaSenha !==
                    confirmarSenha
                ) {

                    mostrarMensagem(
                        "As senhas não são iguais.",
                        "erro"
                    );

                    return;
                }

                if (novaSenha.length < 6) {

                    mostrarMensagem(
                        "A nova senha deve ter pelo menos 6 caracteres.",
                        "erro"
                    );

                    return;
                }

            }

            /* =================================
               ATUALIZAR DADOS
            ================================= */

            usuarioCompleto.nome =
                novoNome;

            usuarioCompleto.email =
                novoEmail;

            usuarioCompleto.cep =
                novoCep;

            usuarioCompleto.rua =
                novaRua;

            usuarioCompleto.bairro =
                novoBairro;

            usuarioCompleto.cidade =
                novaCidade;

            usuarioCompleto.uf =
                novaUf;

            usuarioCompleto.numero =
                novoNumero;

            usuarioCompleto.celular =
                novoCelular;

            usuarioCompleto.login =
                novoLogin;

            /*
               Não alteramos o CPF.
            */

            /* =================================
               ALTERAR SENHA SE PREENCHIDA
            ================================= */

            if (novaSenha) {

                usuarioCompleto.senha =
                    novaSenha;

            }

            /* =================================
               SALVAR USUÁRIO CADASTRADO
            ================================= */

            if (indiceUsuario !== -1) {

                usuarios[indiceUsuario] =
                    usuarioCompleto;

                localStorage.setItem(
                    "usuarios",
                    JSON.stringify(usuarios)
                );

            }

            /* =================================
               ATUALIZAR SESSÃO
            ================================= */

            usuarioLogado = {

                ...usuarioLogado,

                nome:
                    novoNome,

                email:
                    novoEmail,

                login:
                    novoLogin,

                numero:
                    novoNumero

            };

            localStorage.setItem(
                "usuarioLogado",
                JSON.stringify(usuarioLogado)
            );

            /* =================================
               ATUALIZAR HEADER
            ================================= */

            const textoUsuario =
                document.getElementById(
                    "textoUsuario"
                );

            if (textoUsuario) {

                textoUsuario.textContent =
                    `Olá, ${novoNome}`;

            }

            /* =================================
               LIMPAR CAMPOS DE SENHA
            ================================= */

            if (perfilSenha) {
                perfilSenha.value = "";
            }

            if (perfilConfirmarSenha) {
                perfilConfirmarSenha.value = "";
            }

            /* =================================
               SUCESSO
            ================================= */

            mostrarMensagem(
                "Perfil atualizado com sucesso!",
                "sucesso"
            );

        }
    );

}


/* =========================================
   MENSAGEM
========================================= */

function mostrarMensagem(
    mensagem,
    tipo
) {

    if (!perfilMensagem) {
        return;
    }

    perfilMensagem.textContent =
        mensagem;

    if (tipo === "erro") {

        perfilMensagem.style.color =
            "#ef7777";

    } else {

        perfilMensagem.style.color =
            "#78d69b";

    }

}


/* =========================================
   EXCLUIR CONTA - SPAN GAMES
========================================= */

const btnExcluirConta =
    document.getElementById("btnExcluirConta");

const modalExcluirConta =
    document.getElementById("modalExcluirConta");

const btnCancelarExclusao =
    document.getElementById("btnCancelarExclusao");

const btnConfirmarExclusao =
    document.getElementById("btnConfirmarExclusao");

let elementoAnterior = null;


/* ABRIR MODAL */

function abrirModalExclusao() {

    if (!modalExcluirConta) return;

    elementoAnterior = document.activeElement;

    modalExcluirConta.hidden = false;

    btnCancelarExclusao?.focus();
}


/* FECHAR MODAL */

function fecharModalExclusao() {

    if (!modalExcluirConta) return;

    modalExcluirConta.hidden = true;

    elementoAnterior?.focus();
}


/* EVENTOS */

btnExcluirConta?.addEventListener(
    "click",
    abrirModalExclusao
);

btnCancelarExclusao?.addEventListener(
    "click",
    fecharModalExclusao
);

modalExcluirConta?.addEventListener(
    "click",
    evento => {

        if (evento.target === modalExcluirConta) {
            fecharModalExclusao();
        }

    }
);

document.addEventListener("keydown", evento => {

    if (
        evento.key === "Escape" &&
        modalExcluirConta &&
        !modalExcluirConta.hidden
    ) {
        fecharModalExclusao();
    }

});


/* =========================================
   CONFIRMAR EXCLUSÃO
========================================= */

btnConfirmarExclusao?.addEventListener(
    "click",
    () => {

        const sessao = JSON.parse(
            localStorage.getItem("usuarioLogado") || "null"
        );

        if (!sessao || !sessao.login) {

            window.location.href = "login.html";
            return;
        }

        const listaUsuarios = JSON.parse(
            localStorage.getItem("usuarios") || "[]"
        );

        const indice = listaUsuarios.findIndex(
            usuario => usuario.login === sessao.login
        );

        /*
           A conta tester pode ser uma conta
           de demonstração, sem registro em usuarios.
        */

        if (indice === -1) {

            mostrarMensagem(
                "Esta conta não possui um cadastro que possa ser excluído.",
                "erro"
            );

            fecharModalExclusao();
            return;
        }

        /*
           Remove somente o usuário identificado
           pela sessão atual.
        */

        listaUsuarios.splice(indice, 1);

        localStorage.setItem(
            "usuarios",
            JSON.stringify(listaUsuarios)
        );

        /*
           Encerra a sessão.
           Não apaga produtos nem outras contas.
        */

        localStorage.removeItem("usuarioLogado");

        window.location.href = "login.html";

    }
);


/* =========================================
   MOSTRAR / ESCONDER SENHAS
   SPAN GAMES
========================================= */

document.querySelectorAll(".perfil-toggle-senha")
    .forEach(function (botao) {

        botao.addEventListener("click", function () {

            /* PEGAR O CAMPO DE SENHA */

            const idCampo = botao.dataset.alvo;

            const campo = document.getElementById(idCampo);

            if (!campo) return;

            /* VERIFICAR SE A SENHA ESTÁ VISÍVEL */

            const senhaVisivel = campo.type === "text";

            /* MOSTRAR OU ESCONDER */

            campo.type = senhaVisivel
                ? "password"
                : "text";

            /* ALTERAR ÍCONE */

            const icone = botao.querySelector("i");

            if (icone) {

                icone.classList.toggle(
                    "fa-eye",
                    senhaVisivel
                );

                icone.classList.toggle(
                    "fa-eye-slash",
                    !senhaVisivel
                );

            }

            /* ACESSIBILIDADE */

            botao.setAttribute(
                "aria-pressed",
                String(!senhaVisivel)
            );

            botao.setAttribute(
                "aria-label",
                senhaVisivel
                    ? "Mostrar senha"
                    : "Ocultar senha"
            );

        });

    });
