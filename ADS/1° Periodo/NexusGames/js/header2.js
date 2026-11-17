/* =========================================
   HEADER - SPAN GAMES
========================================= */

fetch("header2.html")

    .then(response => response.text())

    .then(data => {

        /* =====================================
           COLOCAR HEADER NA PÁGINA
        ===================================== */

        const header =
            document.getElementById("header");

        header.innerHTML = data;


        /* =====================================
           ELEMENTOS DO USUÁRIO
        ===================================== */

        const usuarioLogado =
            JSON.parse(
                localStorage.getItem("usuarioLogado")
            );

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