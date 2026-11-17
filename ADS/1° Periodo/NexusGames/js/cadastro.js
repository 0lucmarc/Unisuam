// ==============================
// CAMPOS
// ==============================

const formulario = document.getElementById("formCadastro");

const nome = document.getElementById("nome");
const cpfInput = document.getElementById("cpf");
const email = document.getElementById("email");
const celular = document.getElementById("celular");
const telefone = document.getElementById("telefone");
const cepInput = document.getElementById("cep");
const rua = document.getElementById("rua");
const bairro = document.getElementById("bairro");
const cidade = document.getElementById("cidade");
const uf = document.getElementById("uf");
const numero = document.getElementById("numero");
const login = document.getElementById("login");
const senha = document.getElementById("senha");
const confirmacao = document.getElementById("confirmacao");
const termos = document.getElementById("termos");

const botaoCadastrar = document.querySelector(".botao-cadastrar");
const mensagemSucesso = document.getElementById("mensagemSucesso");

let cadastroEnviado = false;


// ==============================
// BOTÕES DOS OLHOS
// ==============================

const mostrarSenha = document.getElementById("mostrarSenha");
const mostrarConfirmacao = document.getElementById("mostrarConfirmacao");


// ==============================
// MENSAGENS DE ERRO
// ==============================

const erroNome = document.getElementById("erroNome");
const erroCpf = document.getElementById("erroCpf");
const erroEmail = document.getElementById("erroEmail");
const erroCelular = document.getElementById("erroCelular");
const erroTelefone = document.getElementById("erroTelefone");
const erroCep = document.getElementById("erroCep");
const erroRua = document.getElementById("erroRua");
const erroBairro = document.getElementById("erroBairro");
const erroCidade = document.getElementById("erroCidade");
const erroUf = document.getElementById("erroUf");
const erroNumero = document.getElementById("erroNumero");
const erroLogin = document.getElementById("erroLogin");
const erroSenha = document.getElementById("erroSenha");
const erroConfirmacao = document.getElementById("erroConfirmacao");
const erroTermos = document.getElementById("erroTermos");


// ==============================
// LABELS DOS CAMPOS
// ==============================

const campos = document.querySelectorAll(".campo input");

function atualizarLabel(input) {
    const campo = input.closest(".campo");

    if (!campo) {
        return;
    }

    if (
        input.value.trim() !== "" ||
        document.activeElement === input
    ) {
        campo.classList.add("campo-preenchido");
    } else {
        campo.classList.remove("campo-preenchido");
    }
}

campos.forEach(function (input) {

    input.addEventListener("focus", function () {
        atualizarLabel(input);
    });

    input.addEventListener("blur", function () {
        atualizarLabel(input);
    });

    input.addEventListener("input", function () {
        atualizarLabel(input);
    });

    atualizarLabel(input);
});

window.addEventListener("pageshow", function () {
    campos.forEach(function (input) {
        atualizarLabel(input);
    });
});


// ==============================
// NOME
// ==============================

nome.addEventListener("input", function () {

    let texto = nome.value;

    texto = texto.replace(/\s+/g, " ");
    texto = texto.replace(/^\s+/, "");
    texto = texto.toLowerCase();

    let palavras = texto.split(" ");

    const preposicoes = [
        "da",
        "de",
        "do",
        "das",
        "dos"
    ];

    palavras = palavras.map(function (palavra) {

        if (preposicoes.includes(palavra)) {
            return palavra;
        }

        return (
            palavra.charAt(0).toUpperCase() +
            palavra.slice(1)
        );
    });

    nome.value = palavras.join(" ");

    atualizarLabel(nome);
    validarNome(false);
});

nome.addEventListener("blur", function () {
    validarNome(true);
});

function validarNome(mostrarValido) {

    const valor = nome.value.trim();

    erroNome.classList.remove("valido");

    if (valor.length === 0) {
        erroNome.textContent = "Preenchimento obrigatório*";
        return false;
    }

    if (valor.length < 15 || valor.length > 80) {
        erroNome.textContent =
            "O nome deve possuir entre 15 e 80 caracteres.";
        return false;
    }

    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/.test(valor)) {
        erroNome.textContent = "Digite apenas letras.";
        return false;
    }

    if (!mostrarValido) {
        erroNome.textContent = "";
        return true;
    }

    erroNome.textContent = "Nome válido.";
    erroNome.classList.add("valido");

    return true;
}


// ==============================
// CPF
// ==============================

cpfInput.addEventListener("input", function () {

    let valor = cpfInput.value;

    valor = valor.replace(/\D/g, "");
    valor = valor.substring(0, 11);

    if (valor.length > 9) {

        valor = valor.replace(
            /^(\d{3})(\d{3})(\d{3})(\d{1,2})$/,
            "$1.$2.$3-$4"
        );

    } else if (valor.length > 6) {

        valor = valor.replace(
            /^(\d{3})(\d{3})(\d{1,3})$/,
            "$1.$2.$3"
        );

    } else if (valor.length > 3) {

        valor = valor.replace(
            /^(\d{3})(\d{1,3})$/,
            "$1.$2"
        );
    }

    cpfInput.value = valor;

    atualizarLabel(cpfInput);
    validarCPF(false);
});

cpfInput.addEventListener("blur", function () {
    validarCPF(true);
});

function validarCPF(mostrarValido) {

    const valor = cpfInput.value;
    const cpf = valor.replace(/\D/g, "");

    erroCpf.classList.remove("valido");

    if (cpf.length === 0) {
        erroCpf.textContent = "Preenchimento obrigatório*";
        return false;
    }

    if (cpf.length !== 11) {
        erroCpf.textContent = "Informe um CPF completo.";
        return false;
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
        erroCpf.textContent = "CPF inválido.";
        return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i);
    }

    let resto = soma % 11;

    let primeiroDigito =
        resto < 2
            ? 0
            : 11 - resto;

    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i);
    }

    resto = soma % 11;

    let segundoDigito =
        resto < 2
            ? 0
            : 11 - resto;

    if (
        primeiroDigito !== Number(cpf[9]) ||
        segundoDigito !== Number(cpf[10])
    ) {
        erroCpf.textContent = "CPF inválido.";
        return false;
    }


    // Verifica se o CPF já está cadastrado

    const usuarios =
        JSON.parse(localStorage.getItem("usuarios")) || [];

    const cpfEmUso = usuarios.some(function (usuario) {

        return (
            usuario.cpf &&
            usuario.cpf.replace(/\D/g, "") === cpf
        );
    });

    if (cpfEmUso) {
        erroCpf.textContent = "Este CPF já está cadastrado.";
        return false;
    }

    if (!mostrarValido) {
        erroCpf.textContent = "";
        return true;
    }

    erroCpf.textContent = "CPF válido.";
    erroCpf.classList.add("valido");

    return true;
}


// ==============================
// E-MAIL
// ==============================

email.addEventListener("input", function () {

    atualizarLabel(email);
    validarEmail(false);
});

email.addEventListener("blur", function () {
    validarEmail(true);
});

function validarEmail(mostrarValido) {

    const valor = email.value.trim();

    erroEmail.classList.remove("valido");

    if (valor.length === 0) {
        erroEmail.textContent = "Preenchimento obrigatório*";
        return false;
    }

    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(valor)) {
        erroEmail.textContent = "Informe um e-mail válido.";
        return false;
    }


    // Verifica se o e-mail já está cadastrado

    const usuarios =
        JSON.parse(localStorage.getItem("usuarios")) || [];

    const emailEmUso = usuarios.some(function (usuario) {

        return (
            usuario.email &&
            usuario.email.toLowerCase() === valor.toLowerCase()
        );
    });

    if (emailEmUso) {
        erroEmail.textContent = "Este e-mail já está cadastrado.";
        return false;
    }

    if (!mostrarValido) {
        erroEmail.textContent = "";
        return true;
    }

    erroEmail.textContent = "E-mail válido.";
    erroEmail.classList.add("valido");

    return true;
}


// ==============================
// CEP
// ==============================

let cepValido = false;

cepInput.addEventListener("input", function () {

    cepValido = false;

    erroCep.classList.remove("valido");

    let valor = cepInput.value;

    valor = valor.replace(/\D/g, "");
    valor = valor.substring(0, 8);

    if (valor.length > 5) {
        valor = valor.replace(
            /^(\d{5})(\d{1,3})$/,
            "$1-$2"
        );
    }

    cepInput.value = valor;

    if (valor.length === 0) {

        erroCep.textContent = "Preenchimento obrigatório*";

    } else if (valor.length < 9) {

        erroCep.textContent = "Informe um CEP completo.";

    } else {

        erroCep.textContent = "";
    }

    atualizarLabel(cepInput);
});

cepInput.addEventListener("blur", buscarCEP);

async function buscarCEP() {

    cepValido = false;

    erroCep.classList.remove("valido");

    const cep = cepInput.value.replace(/\D/g, "");

    if (cep.length === 0) {

        erroCep.textContent = "Preenchimento obrigatório*";
        limparEndereco();

        return;
    }

    if (cep.length !== 8) {

        erroCep.textContent = "Informe um CEP completo.";
        limparEndereco();

        return;
    }

    try {

        const resposta = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`
        );

        if (!resposta.ok) {

            erroCep.textContent =
                "Não foi possível consultar o CEP.";

            return;
        }

        const dados = await resposta.json();

        if (dados.erro) {

            erroCep.textContent = "CEP não encontrado.";
            limparEndereco();

            return;
        }

        rua.value = dados.logradouro;
        bairro.value = dados.bairro;
        cidade.value = dados.localidade;
        uf.value = dados.uf;

        cepValido = true;

        erroCep.textContent = "CEP válido.";
        erroCep.classList.add("valido");

        atualizarLabel(rua);
        atualizarLabel(bairro);
        atualizarLabel(cidade);
        atualizarLabel(uf);

    } catch (erro) {

        erroCep.textContent = "Erro ao consultar o CEP.";
    }
}

function limparEndereco() {

    rua.value = "";
    bairro.value = "";
    cidade.value = "";
    uf.value = "";

    atualizarLabel(rua);
    atualizarLabel(bairro);
    atualizarLabel(cidade);
    atualizarLabel(uf);
}

function validarCEP(mostrarValido) {

    const valor = cepInput.value.replace(/\D/g, "");

    erroCep.classList.remove("valido");

    if (valor.length === 0) {

        erroCep.textContent = "Preenchimento obrigatório*";
        return false;
    }

    if (valor.length !== 8) {

        erroCep.textContent = "Informe um CEP completo.";
        return false;
    }

    if (!cepValido) {

        erroCep.textContent = "Informe um CEP válido.";
        return false;
    }

    if (!mostrarValido) {

        erroCep.textContent = "";
        return true;
    }

    erroCep.textContent = "CEP válido.";
    erroCep.classList.add("valido");

    return true;
}


// ==============================
// NÚMERO DA RESIDÊNCIA
// ==============================

numero.addEventListener("input", function () {

    numero.value = numero.value.replace(/\D/g, "").substring(0, 10);

    atualizarLabel(numero);

    erroNumero.classList.remove("valido");

    validarNumero(false);
});

numero.addEventListener("blur", function () {
    validarNumero(true);
});


function validarNumero(mostrarValido) {

    const valor = numero.value.trim();

    erroNumero.classList.remove("valido");

    if (valor.length === 0) {

        erroNumero.textContent = "Preenchimento obrigatório*";
        return false;
    }

    if (!/^\d+$/.test(valor)) {

        erroNumero.textContent = "Informe apenas números.";
        return false;
    }

    if (!mostrarValido) {

        erroNumero.textContent = "";
        return true;
    }

    erroNumero.textContent = "Número válido.";
    erroNumero.classList.add("valido");

    return true;
}


// ==============================
// TELEFONES
// ==============================

function aplicarMascaraTelefone(input) {

    let valor = input.value;

    valor = valor.replace(/\D/g, "");

    if (valor.startsWith("55")) {
        valor = valor.substring(2);
    }

    // Celular: 11 números
    // Telefone fixo: 10 números

    const limite =
        input.id === "celular"
            ? 11
            : 10;

    valor = valor.substring(0, limite);

    if (valor.length > 0) {
        valor = "(+55)" + valor;
    }

    if (valor.length > 5) {

        valor = valor.replace(
            /^\(\+55\)(\d{2})(\d+)$/,
            "(+55) $1-$2"
        );
    }

    input.value = valor;

    atualizarLabel(input);
}

function validarTelefone(
    input,
    mensagem,
    mostrarValido
) {

    const valor = input.value;

    mensagem.classList.remove("valido");

    if (valor.length === 0) {

        mensagem.textContent = "";
        return false;
    }

    let valido;

    if (input.id === "celular") {

        valido =
            /^\(\+55\) \d{2}-\d{9}$/.test(valor);

    } else {

        valido =
            /^\(\+55\) \d{2}-\d{8}$/.test(valor);
    }

    if (!valido) {

        mensagem.textContent =
            "Informe um telefone completo.";

        return false;
    }


    // Verifica se o telefone já está cadastrado

    const usuarios =
        JSON.parse(localStorage.getItem("usuarios")) || [];

    const telefoneEmUso = usuarios.some(function (usuario) {

        return (
            usuario.telefone &&
            usuario.telefone === valor
        );
    });

    const celularEmUso = usuarios.some(function (usuario) {

        return (
            usuario.celular &&
            usuario.celular === valor
        );
    });

    if (input.id === "celular") {

        if (celularEmUso) {

            mensagem.textContent =
                "Este celular já está cadastrado.";

            return false;
        }

        if (telefoneEmUso) {

            mensagem.textContent =
                "Este número já está cadastrado.";

            return false;
        }

    } else {

        if (telefoneEmUso) {

            mensagem.textContent =
                "Este telefone já está cadastrado.";

            return false;
        }

        if (celularEmUso) {

            mensagem.textContent =
                "Este número já está cadastrado.";

            return false;
        }
    }

    if (!mostrarValido) {

        mensagem.textContent = "";
        return true;
    }

    mensagem.textContent = "Telefone válido.";
    mensagem.classList.add("valido");

    return true;
}

telefone.addEventListener("input", function () {

    aplicarMascaraTelefone(telefone);

    validarTelefone(
        telefone,
        erroTelefone,
        false
    );
});

telefone.addEventListener("blur", function () {

    validarTelefone(
        telefone,
        erroTelefone,
        true
    );
});

celular.addEventListener("input", function () {

    aplicarMascaraTelefone(celular);

    validarTelefone(
        celular,
        erroCelular,
        false
    );
});

celular.addEventListener("blur", function () {

    validarTelefone(
        celular,
        erroCelular,
        true
    );
});

function validarTelefones() {

    const valorTelefone = telefone.value;
    const valorCelular = celular.value;

    if (
        valorTelefone.length === 0 &&
        valorCelular.length === 0
    ) {

        erroTelefone.classList.remove("valido");
        erroCelular.classList.remove("valido");

        erroTelefone.textContent =
            "Informe pelo menos um telefone.";

        erroCelular.textContent =
            "Informe pelo menos um telefone.";

        return false;
    }

    if (valorTelefone.length > 0) {

        if (
            !validarTelefone(
                telefone,
                erroTelefone,
                true
            )
        ) {
            return false;
        }

    } else {

        erroTelefone.classList.remove("valido");
        erroTelefone.textContent = "";
    }

    if (valorCelular.length > 0) {

        if (
            !validarTelefone(
                celular,
                erroCelular,
                true
            )
        ) {
            return false;
        }

    } else {

        erroCelular.classList.remove("valido");
        erroCelular.textContent = "";
    }

    return true;
}


// ==============================
// LOGIN
// ==============================

login.addEventListener("input", function () {

    let valor = login.value;

    erroLogin.classList.remove("valido");

    valor = valor.replace(
        /[^A-Za-zÀ-ÖØ-öø-ÿ]/g,
        ""
    );

    valor = valor.substring(0, 6);

    login.value = valor;

    if (valor.length === 0) {

        erroLogin.textContent =
            "Preenchimento obrigatório*";

    } else if (valor.length < 6) {

        erroLogin.textContent =
            "Digite exatamente 6 letras.";

    } else {

        erroLogin.textContent = "";
    }

    atualizarLabel(login);
});

login.addEventListener("focus", function () {

    erroLogin.classList.remove("valido");

    if (login.value.length < 6) {

        erroLogin.textContent =
            "Digite exatamente 6 letras.";

    } else {

        erroLogin.textContent = "";
    }
});

login.addEventListener("blur", function () {
    validarLogin(true);
});

function validarLogin(mostrarValido) {

    const valor = login.value;

    erroLogin.classList.remove("valido");

    if (valor.length === 0) {

        erroLogin.textContent =
            "Preenchimento obrigatório*";

        return false;
    }

    if (
        valor.length !== 6 ||
        !/^[A-Za-zÀ-ÖØ-öø-ÿ]+$/.test(valor)
    ) {

        erroLogin.textContent =
            "Digite exatamente 6 letras.";

        return false;
    }


    // Verifica se o login já está cadastrado

    const usuarios =
        JSON.parse(localStorage.getItem("usuarios")) || [];

    const loginEmUso = usuarios.some(function (usuario) {

        return (
            usuario.login &&
            usuario.login.toLowerCase() ===
            valor.toLowerCase()
        );
    });

    if (loginEmUso) {

        erroLogin.textContent =
            "Esse nome já está em uso.";

        return false;
    }

    if (!mostrarValido) {

        erroLogin.textContent = "";
        return true;
    }

    erroLogin.textContent = "Login válido.";
    erroLogin.classList.add("valido");

    return true;
}


// ==============================
// SENHA
// ==============================

senha.addEventListener("input", function () {

    let valor = senha.value;

    erroSenha.classList.remove("valido");

    valor = valor.replace(
        /[^A-Za-zÀ-ÖØ-öø-ÿ]/g,
        ""
    );

    valor = valor.substring(0, 8);

    senha.value = valor;

    if (valor.length === 0) {

        erroSenha.textContent =
            "Preenchimento obrigatório*";

    } else if (valor.length < 8) {

        erroSenha.textContent =
            "Digite exatamente 8 letras.";

    } else {

        erroSenha.textContent = "";
    }

    atualizarLabel(senha);
    validarConfirmacao(false);
});

senha.addEventListener("focus", function () {

    erroSenha.classList.remove("valido");

    if (senha.value.length < 8) {

        erroSenha.textContent =
            "Digite exatamente 8 letras.";

    } else {

        erroSenha.textContent = "";
    }
});

senha.addEventListener("blur", function () {
    validarSenha(true);
});

function validarSenha(mostrarValido) {

    const valor = senha.value;

    erroSenha.classList.remove("valido");

    if (valor.length === 0) {

        erroSenha.textContent =
            "Preenchimento obrigatório*";

        return false;
    }

    if (
        valor.length !== 8 ||
        !/^[A-Za-zÀ-ÖØ-öø-ÿ]+$/.test(valor)
    ) {

        erroSenha.textContent =
            "Digite exatamente 8 letras.";

        return false;
    }

    if (!mostrarValido) {

        erroSenha.textContent = "";
        return true;
    }

    erroSenha.textContent = "Senha válida.";
    erroSenha.classList.add("valido");

    return true;
}


// ==============================
// CONFIRMAÇÃO DE SENHA
// ==============================

confirmacao.addEventListener("input", function () {

    let valor = confirmacao.value;

    erroConfirmacao.classList.remove("valido");

    valor = valor.replace(
        /[^A-Za-zÀ-ÖØ-öø-ÿ]/g,
        ""
    );

    valor = valor.substring(0, 8);

    confirmacao.value = valor;

    if (valor.length === 0) {

        erroConfirmacao.textContent =
            "Preenchimento obrigatório*";

    } else if (valor.length < 8) {

        erroConfirmacao.textContent =
            "Digite exatamente 8 letras.";

    } else if (valor !== senha.value) {

        erroConfirmacao.textContent =
            "A confirmação deve ser igual à senha.";

    } else {

        erroConfirmacao.textContent = "";
    }

    atualizarLabel(confirmacao);
});

confirmacao.addEventListener("focus", function () {

    erroConfirmacao.classList.remove("valido");

    if (confirmacao.value.length < 8) {

        erroConfirmacao.textContent =
            "Digite exatamente 8 letras.";

    } else if (confirmacao.value !== senha.value) {

        erroConfirmacao.textContent =
            "A confirmação deve ser igual à senha.";

    } else {

        erroConfirmacao.textContent = "";
    }
});

confirmacao.addEventListener("blur", function () {
    validarConfirmacao(true);
});

function validarConfirmacao(mostrarValido) {

    const valor = confirmacao.value;

    erroConfirmacao.classList.remove("valido");

    if (valor.length === 0) {

        erroConfirmacao.textContent =
            "Preenchimento obrigatório*";

        return false;
    }

    if (valor.length !== 8) {

        erroConfirmacao.textContent =
            "Digite exatamente 8 letras.";

        return false;
    }

    if (valor !== senha.value) {

        erroConfirmacao.textContent =
            "A confirmação deve ser igual à senha.";

        return false;
    }

    if (!mostrarValido) {

        erroConfirmacao.textContent = "";
        return true;
    }

    erroConfirmacao.textContent =
        "Senha confirmada.";

    erroConfirmacao.classList.add("valido");

    return true;
}


// ==============================
// MOSTRAR / ESCONDER SENHA
// ==============================

mostrarSenha.addEventListener("click", function () {

    const imagem = mostrarSenha.querySelector("img");

    if (senha.type === "password") {

        senha.type = "text";

        imagem.src = "assets/icones/eye.svg";
        imagem.alt = "Esconder senha";

    } else {

        senha.type = "password";

        imagem.src = "assets/icones/eyeoff.svg";
        imagem.alt = "Mostrar senha";
    }
});

mostrarConfirmacao.addEventListener("click", function () {

    const imagem =
        mostrarConfirmacao.querySelector("img");

    if (confirmacao.type === "password") {

        confirmacao.type = "text";

        imagem.src = "assets/icones/eye.svg";
        imagem.alt = "Esconder confirmação de senha";

    } else {

        confirmacao.type = "password";

        imagem.src = "assets/icones/eyeoff.svg";
        imagem.alt = "Mostrar confirmação de senha";
    }
});


// ==============================
// TERMOS
// ==============================

function validarTermos() {

    if (!termos.checked) {

        erroTermos.textContent =
            "Você precisa concordar com os termos e políticas de privacidade.";

        return false;
    }

    erroTermos.textContent = "";

    return true;
}


// ==============================
// ENVIO DO FORMULÁRIO
// ==============================

formulario.addEventListener("submit", function (event) {

    event.preventDefault();

    // Impede envio duplicado
    if (cadastroEnviado) {
        return;
    }

    if (!validarNome(true)) {
        return;
    }

    if (!validarCPF(true)) {
        return;
    }

    if (!validarEmail(true)) {
        return;
    }

    if (!validarTelefones()) {
        return;
    }

    if (!validarCEP(true)) {
        return;
    }

    if (!validarNumero(true)) {
        return;
    }

    if (!validarLogin(true)) {
        return;
    }

    if (!validarSenha(true)) {
        return;
    }

    if (!validarConfirmacao(true)) {
        return;
    }

    if (!validarTermos()) {
        return;
    }


    // ==============================
    // BLOQUEIA NOVOS ENVIOS
    // ==============================

    cadastroEnviado = true;

    botaoCadastrar.disabled = true;
    botaoCadastrar.textContent = "Cadastrando...";


    // ==============================
    // CRIA USUÁRIO
    // ==============================

    const usuario = {

        nome: nome.value,
        cpf: cpfInput.value,
        email: email.value,
        cep: cepInput.value,
        rua: rua.value,
        bairro: bairro.value,
        cidade: cidade.value,
        uf: uf.value,
        numero: numero.value,
        celular: celular.value,
        telefone: telefone.value,
        login: login.value,
        senha: senha.value
    };


    // ==============================
    // BUSCA USUÁRIOS EXISTENTES
    // ==============================

    let usuarios =
        JSON.parse(
            localStorage.getItem("usuarios")
        ) || [];


    // ==============================
    // ADICIONA NOVO USUÁRIO
    // ==============================

    usuarios.push(usuario);


    // ==============================
    // SALVA
    // ==============================

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );


    // ==============================
    // MENSAGEM DE SUCESSO
    // ==============================

    mensagemSucesso.textContent =
        "Cadastro realizado com sucesso! Redirecionando para o login...";

    mensagemSucesso.classList.add("exibir");


    // ==============================
    // REDIRECIONAMENTO
    // ==============================

    setTimeout(function () {

        window.location.href = "login.html";

    }, 2000);
});


// ==============================
// IMPEDE FOCO NOS CAMPOS AUTOMÁTICOS
// ==============================

rua.addEventListener("mousedown", function (event) {
    event.preventDefault();
});

cidade.addEventListener("mousedown", function (event) {
    event.preventDefault();
});

bairro.addEventListener("mousedown", function (event) {
    event.preventDefault();
});

uf.addEventListener("mousedown", function (event) {
    event.preventDefault();
});
