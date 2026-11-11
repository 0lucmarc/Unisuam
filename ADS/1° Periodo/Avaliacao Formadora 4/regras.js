/* ==========================================================
    Regras de validação com Regex
   ========================================================== */

/* ---------- 1. VALIDADORES (um por campo) ---------- */

// Nome e Nome Materno: mínimo 10 caracteres alfabéticos (com espaços), 1º caractere maiúsculo.
const validarNome = (v) => {
    const valor = v.trim();
    const regex = /^[A-ZÀ-Ý][A-Za-zÀ-ÿ\s]{9,}$/;
    if (!valor) return 'Informe o nome.';
    if (!regex.test(valor)) return 'Deve começar com maiúscula e ter no mínimo 10 letras (incluindo espaços).';
    return '';
};

const validarNomeMaterno = (v) => {
    const valor = v.trim();
    const regex = /^[A-ZÀ-Ý][A-Za-zÀ-ÿ\s]{9,}$/;
    if (!valor) return 'Informe o nome materno.';
    if (!regex.test(valor)) return 'Deve começar com maiúscula e ter no mínimo 10 letras (incluindo espaços).';
    return '';
};

// CPF: formato 000.000.000-00 (Aceita qualquer número, sem validar o dígito)
const validarCPF = (v) => {
    const regexFormato = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!v.trim()) return 'Informe o CPF.';
    if (!regexFormato.test(v)) return 'Formato inválido. Use 000.000.000-00.';
    return '';
};

// Telefone Celular: +55(21)99565-1622
const validarTelefoneCelular = (v) => {
  // ^\+55 -> Começa com +55
  // \(\d{2}\) -> DDD entre parênteses
  // \d{5} -> 5 números
  // - -> Hífen
  // \d{4}$ -> 4 números finais
    const regex = /^\+55\(\d{2}\)\d{5}-\d{4}$/;
    if (!v.trim()) return 'Informe o celular.';
    if (!regex.test(v)) return 'Formato inválido. Use +55(DD)99999-9999.';
    return '';
};

// Telefone Fixo: +55(21)29565-1622 (Primeiro número da sequência de 5 deve ser 2, 3, 4 ou 5)
const validarTelefoneFixo = (v) => {
  // [2-5] -> Garante que o primeiro dos 5 dígitos seja 2, 3, 4 ou 5.
    const regex = /^\+55\(\d{2}\)[2-5]\d{4}-\d{4}$/;
    if (!v.trim()) return 'Informe o telefone fixo.';
    if (!regex.test(v)) return 'Formato inválido. Use +55(DD)29999-9999 (iniciando com 2 a 5).';
    return '';
};

// Endereço Completo: Inicia com Rua/Avenida/Travessa/Av. (case-insensitive) + min 10 caracteres alfanuméricos
const validarEndereco = (v) => {
    const valor = v.trim();
  // (Rua|Avenida|Travessa|Av\.) -> Uma das palavras iniciais
  // \s+ -> Pelo menos um espaço
  // [a-zA-Z0-9À-ÿ\s]{10,} -> Pelo menos 10 caracteres alfanuméricos ou espaços
  // flag "i" -> Case-insensitive (aceita 'rua' ou 'Rua')
    const regex = /^(Rua|Avenida|Travessa|Av\.)\s+[a-zA-Z0-9À-ÿ\s]{10,}$/i;
    if (!valor) return 'Informe o endereço.';
    if (!regex.test(valor)) return 'Deve iniciar com Rua, Avenida, Travessa ou Av. e ter no mínimo 10 caracteres.';
    return '';
};

// Login: Exatamente 5 letras maiúsculas
const validarLogin = (v) => {
    const regex = /^[A-Z]{5}$/;
    if (!v.trim()) return 'Informe o login.';
    if (!regex.test(v)) return 'O login deve ter exatamente 5 letras maiúsculas.';
    return '';
};

// Senha: Exatamente 7 caracteres alfanuméricos (letras e/ou números)
const validarSenha = (v) => {
    const regex = /^[A-Za-z0-9]{7}$/;
    if (!v) return 'Informe a senha.';
    if (!regex.test(v)) return 'A senha deve ter exatamente 7 caracteres alfanuméricos (letras e números).';
    return '';
};

// Confirmar Senha: Deve ser igual à senha
const validarConfirmarSenha = (v) => {
    if (!v) return 'Confirme a senha.';
    if (v !== document.getElementById('senha').value) return 'As senhas não coincidem.';
    return '';
};

/* ---------- 2. MAPA DE CAMPOS ---------- */
const campos = {
    'nome':              { erro: 'erroNome',             validar: validarNome },
    'data-nascimento':   { erro: 'erroDataNascimento',   validar: (v) => !v ? 'Informe a data.' : '' }, // Regra padrão
    'sexo':              { erro: 'erroSexo',             validar: (v) => !v ? 'Selecione o sexo.' : '' },
    'nome-materno':      { erro: 'erroNomeMaterno',      validar: validarNomeMaterno },
    'cpf':               { erro: 'erroCPF',              validar: validarCPF },
    'telefone-celular':  { erro: 'erroTelefoneCelular',  validar: validarTelefoneCelular },
    'telefone-fixo':     { erro: 'erroTelefoneFixo',     validar: validarTelefoneFixo },
    'endereco-completo': { erro: 'erroEnderecoCompleto', validar: validarEndereco },
    'login':             { erro: 'erroLogin',            validar: validarLogin },
    'senha':             { erro: 'erroSenha',            validar: validarSenha },
    'confirmar-senha':   { erro: 'erroConfirmarSenha',   validar: validarConfirmarSenha },
};

/* ---------- 3. EXIBIÇÃO E VALIDAÇÃO ---------- */
function exibirErro(spanId, msg) {
    const span = document.getElementById(spanId);
    if (!span) return;
    span.textContent = msg;
    const input = span.previousElementSibling;
    if (input && 'classList' in input) {
    input.classList.toggle('invalido', Boolean(msg));
}
}

function validarCampo(id) {
    const cfg = campos[id];
    const el = document.getElementById(id);
    if (!cfg || !el) return true;
    const msg = cfg.validar(el.value);
    exibirErro(cfg.erro, msg);
    return !msg;
}

function validarFormulario() {
    let ok = true;
    for (const id of Object.keys(campos)) {
    if (!validarCampo(id)) ok = false;
}
    return ok;
}

/* ---------- 4. BINDING DOS EVENTOS ---------- */
document.addEventListener('DOMContentLoaded', () => {
    for (const [id, cfg] of Object.entries(campos)) {
    const el = document.getElementById(id);
    if (!el) continue;
    el.addEventListener('blur', () => validarCampo(id));
    el.addEventListener('change', () => validarCampo(id));
    el.addEventListener('input', () => {
    const span = document.getElementById(cfg.erro);
    if (span && span.textContent) validarCampo(id);
    });
}

  // Certifique-se de que o HTML tenha <form id="formCadastro"> envolvendo os inputs
    const form = document.getElementById('formCadastro');
    if (form) {
    form.addEventListener('submit', (e) => {
        if (!validarFormulario()) {
        e.preventDefault();
        const primeiro = form.querySelector('.invalido');
        if (primeiro) primeiro.focus();
    }
    });

    form.addEventListener('reset', () => {
    document.querySelectorAll('span[id^="erro"]').forEach(s => (s.textContent = ''));
    form.querySelectorAll('input, select').forEach(el => el.classList.remove('invalido'));
    });
}
});