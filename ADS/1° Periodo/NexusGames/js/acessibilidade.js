// =========================================
// ACESSIBILIDADE
// =========================================

const temaClaro =
    document.getElementById("temaClaro");

const temaEscuro =
    document.getElementById("temaEscuro");

const aumentarFonte =
    document.getElementById("aumentarFonte");

const diminuirFonte =
    document.getElementById("diminuirFonte");


// =========================================
// CONFIGURAÇÕES SALVAS
// =========================================

const tamanhoSalvo = Number(localStorage.getItem("tamanhoFonte"));

let tamanhoFonte =
    Number.isInteger(tamanhoSalvo) &&
    tamanhoSalvo >= 12 &&
    tamanhoSalvo <= 24
        ? tamanhoSalvo
        : 16;

const temaSalvo =
    localStorage.getItem("tema");


// =========================================
// APLICAR TAMANHO DA FONTE
// =========================================

function aplicarTamanhoFonte() {

    document.documentElement.style.fontSize =
        tamanhoFonte + "px";

    localStorage.setItem(
        "tamanhoFonte",
        tamanhoFonte
    );
}


// =========================================
// APLICAR TEMA
// =========================================

function aplicarTema(tema) {

    document.body.classList.remove(
        "tema-claro",
        "tema-escuro"
    );

    document.body.classList.add(tema);

    localStorage.setItem(
        "tema",
        tema
    );
}


// =========================================
// CARREGAR CONFIGURAÇÕES
// =========================================

aplicarTamanhoFonte();


if (
    temaSalvo === "tema-claro" ||
    temaSalvo === "tema-escuro"
) {

    aplicarTema(temaSalvo);

} else {

    aplicarTema("tema-escuro");
}


// =========================================
// TEMA CLARO
// =========================================

if (temaClaro) {

    temaClaro.addEventListener(
        "click",
        function () {

            aplicarTema("tema-claro");

        }
    );
}


// =========================================
// TEMA ESCURO
// =========================================

if (temaEscuro) {

    temaEscuro.addEventListener(
        "click",
        function () {

            aplicarTema("tema-escuro");

        }
    );
}


// =========================================
// AUMENTAR FONTE
// =========================================

if (aumentarFonte) {

    aumentarFonte.addEventListener(
        "click",
        function () {

            if (tamanhoFonte < 24) {

                tamanhoFonte += 1;

                aplicarTamanhoFonte();
            }

        }
    );
}


// =========================================
// DIMINUIR FONTE
// =========================================

if (diminuirFonte) {

    diminuirFonte.addEventListener(
        "click",
        function () {

            if (tamanhoFonte > 12) {

                tamanhoFonte -= 1;

                aplicarTamanhoFonte();
            }

        }
    );
}