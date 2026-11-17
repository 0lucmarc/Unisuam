/* =========================================
   LOGIN - SPAN GAMES
========================================= */

const formLogin =
    document.getElementById("formLogin");

const inputLogin =
    document.getElementById("login");

const inputSenha =
    document.getElementById("senha");

const erroLogin =
    document.getElementById("erroLogin");

const erroSenha =
    document.getElementById("erroSenha");

const erroGeral =
    document.getElementById("erroGeral");

const mostrarSenha =
    document.getElementById("mostrarSenha");


/* =========================================
   CRIAR USUÁRIO DE TESTE NO LOCALSTORAGE
========================================= */

function criarUsuarioTeste() {

    const usuarios =
        JSON.parse(
            localStorage.getItem("usuarios")
        ) || [];


    /* =====================================
       VERIFICAR SE TESTER JÁ EXISTE
    ===================================== */

    const testerExiste =
        usuarios.some(function (usuario) {

            return usuario.login === "tester";

        });


    /* =====================================
       CRIAR TESTER SOMENTE UMA VEZ
    ===================================== */

    if (!testerExiste) {

        const usuarioTeste = {

            id: Date.now(),

            nome: "Usuário Teste",

            cpf: "000.000.000-00",

            email: "teste@spangames.com",

            celular: "(21) 99999-9999",

            telefone: "",

            cep: "00000-000",

            rua: "Rua de Teste",

            bairro: "Centro",

            cidade: "Rio de Janeiro",

            uf: "RJ",

            login: "tester",

            senha: "teste123"

        };


        usuarios.push(usuarioTeste);


        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuarios)
        );

    }

}


/* =========================================
   INICIAR USUÁRIO DE TESTE
========================================= */

criarUsuarioTeste();


/* =========================================
   LIMPAR ERROS
========================================= */

function limparErros() {

    erroLogin.textContent = "";

    erroSenha.textContent = "";

    erroGeral.textContent = "";

    erroGeral.classList.remove(
        "exibir"
    );

}


/* =========================================
   MOSTRAR / ESCONDER SENHA
========================================= */

mostrarSenha.addEventListener(
    "click",
    function () {

        const icone =
            mostrarSenha.querySelector("i");


        if (inputSenha.type === "password") {

            inputSenha.type = "text";


            icone.classList.remove(
                "fa-eye"
            );

            icone.classList.add(
                "fa-eye-slash"
            );

        } else {

            inputSenha.type = "password";


            icone.classList.remove(
                "fa-eye-slash"
            );

            icone.classList.add(
                "fa-eye"
            );

        }

    }
);


/* =========================================
   LOGIN
========================================= */

formLogin.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();


        /* =====================================
           LIMPAR MENSAGENS
        ===================================== */

        limparErros();


        /* =====================================
           PEGAR DADOS
        ===================================== */

        const login =
            inputLogin.value.trim();

        const senha =
            inputSenha.value;


        let formularioValido = true;


        /* =====================================
           VALIDAR LOGIN
        ===================================== */

        if (!login) {

            erroLogin.textContent =
                "Digite seu login.";

            formularioValido = false;

        }


        /* =====================================
           VALIDAR SENHA
        ===================================== */

        if (!senha) {

            erroSenha.textContent =
                "Digite sua senha.";

            formularioValido = false;

        }


        if (!formularioValido) {
            return;
        }


        /* =====================================
           PEGAR USUÁRIOS DO LOCALSTORAGE
        ===================================== */

        const usuarios =
            JSON.parse(
                localStorage.getItem("usuarios")
            ) || [];


        /* =====================================
           PROCURAR USUÁRIO
        ===================================== */

        const usuarioEncontrado =
            usuarios.find(
                function (usuario) {

                    return (

                        usuario.login === login &&

                        usuario.senha === senha

                    );

                }
            );


        /* =====================================
           LOGIN INCORRETO
        ===================================== */

        if (!usuarioEncontrado) {

            erroGeral.textContent =
                "Login ou senha incorretos.";

            erroGeral.classList.add(
                "exibir"
            );

            return;

        }


        /* =====================================
           CRIAR SESSÃO
        ===================================== */

        const usuarioLogado = {

            id:
                usuarioEncontrado.id,

            nome:
                usuarioEncontrado.nome ||
                usuarioEncontrado.login,

            cpf:
                usuarioEncontrado.cpf || "",

            email:
                usuarioEncontrado.email || "",

            celular:
                usuarioEncontrado.celular || "",

            telefone:
                usuarioEncontrado.telefone || "",

            cep:
                usuarioEncontrado.cep || "",

            rua:
                usuarioEncontrado.rua || "",

            bairro:
                usuarioEncontrado.bairro || "",

            cidade:
                usuarioEncontrado.cidade || "",

            uf:
                usuarioEncontrado.uf || "",

            login:
                usuarioEncontrado.login

        };


        /* =====================================
           SALVAR USUÁRIO LOGADO
        ===================================== */

        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify(usuarioLogado)
        );


        /* =====================================
           ENTRAR NO SITE
        ===================================== */

        window.location.href =
            "index.html";

    }
);


/* =========================================
   REMOVER ERRO AO DIGITAR LOGIN
========================================= */

inputLogin.addEventListener(
    "input",
    function () {

        erroLogin.textContent = "";

        erroGeral.textContent = "";

        erroGeral.classList.remove(
            "exibir"
        );

    }
);


/* =========================================
   REMOVER ERRO AO DIGITAR SENHA
========================================= */

inputSenha.addEventListener(
    "input",
    function () {

        erroSenha.textContent = "";

        erroGeral.textContent = "";

        erroGeral.classList.remove(
            "exibir"
        );

    }
);