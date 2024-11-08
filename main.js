// funcao get
function fazGet(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(error => console.error('Erro:', error));
}

// Função para criar as linhas da tabela 
function criaLinha(usuario) {
    let linha = document.createElement("tr");

    // Imagem do cachorro
    let tdImagem = document.createElement("td");
    let img = document.createElement("img");
    img.src = usuario.imagem;
    img.alt = "Imagem do cachorro";
    img.style.width = "100px";  
    tdImagem.appendChild(img);

    // Nome do cachorro
    let tdCachorro = document.createElement("td");
    tdCachorro.innerHTML = usuario.cachorro;

    // Nome do dono
    let tdDono = document.createElement("td");
    tdDono.innerHTML = usuario.dono;

    // Telefone do dono
    let tdTelefone = document.createElement("td");
    tdTelefone.innerHTML = usuario.telefone;

    // Email do dono
    let tdEmail = document.createElement("td");
    tdEmail.innerHTML = usuario.email;

    // Ações : editar e excluir
    let tdAcoes = document.createElement("td");

    // Botão de editar
    let btnEditar = document.createElement("button");
    btnEditar.innerText = "Editar";
    btnEditar.onclick = function() { editarLinha(linha, tdCachorro, tdDono, tdTelefone, tdEmail); };

    // Botão de Excluir
    let btnExcluir = document.createElement("button");
    btnExcluir.innerText = "Excluir";
    btnExcluir.onclick = function() { excluirLinha(btnExcluir); };

    tdAcoes.appendChild(btnEditar);
    tdAcoes.appendChild(btnExcluir);

    linha.appendChild(tdImagem);
    linha.appendChild(tdCachorro);
    linha.appendChild(tdDono);
    linha.appendChild(tdTelefone);
    linha.appendChild(tdEmail);
    linha.appendChild(tdAcoes);

    return linha;
}

// func para excluir a linha da tabela (sem mudanças)
function excluirLinha(botao) {
    let linha = botao.closest("tr");
    linha.remove();
}

// func para editar a linha
function editarLinha(linha, tdCachorro, tdDono, tdTelefone, tdEmail) {
    tdCachorro.innerHTML = `<input type="text" value="${tdCachorro.innerHTML}" />`;
    tdDono.innerHTML = `<input type="text" value="${tdDono.innerHTML}" />`;
    tdTelefone.innerHTML = `<input type="text" value="${tdTelefone.innerHTML}" />`;
    tdEmail.innerHTML = `<input type="text" value="${tdEmail.innerHTML}" />`;

    let btnEditar = linha.querySelector("button:nth-child(1)");
    btnEditar.innerText = "Salvar";
    btnEditar.onclick = function() { salvarEdicao(linha, tdCachorro, tdDono, tdTelefone, tdEmail); };
}

// func para salvar a edição da linha 
function salvarEdicao(linha, tdCachorro, tdDono, tdTelefone, tdEmail) {
    let novoCachorro = tdCachorro.querySelector("input").value;
    let novoDono = tdDono.querySelector("input").value;
    let novoTelefone = tdTelefone.querySelector("input").value;
    let novoEmail = tdEmail.querySelector("input").value;

    tdCachorro.innerHTML = novoCachorro;
    tdDono.innerHTML = novoDono;
    tdTelefone.innerHTML = novoTelefone;
    tdEmail.innerHTML = novoEmail;

    let btnSalvar = linha.querySelector("button:nth-child(1)");
    btnSalvar.innerText = "Editar";
    btnSalvar.onclick = function() { editarLinha(linha, tdCachorro, tdDono, tdTelefone, tdEmail); };
}

// func principal para carregar os dados 
function main() {
    fazGet("https://run.mocky.io/v3/404a6d49-8763-45d3-9ff0-990f51fb2eed")
    .then(usuarios => {
        let tabelaBody = document.getElementById("tbody");

        usuarios.forEach(usuario => {
            let linha = criaLinha(usuario);
            tabelaBody.appendChild(linha);
        });
    })
    .catch(error => console.error("Erro ao carregar dados", error));
}

// chama a função principal para carregar os dados ao carregar a página
main();

// add um cachorro à tabela
document.getElementById("formAdicionarCachorro").addEventListener("submit", function(event) {
    event.preventDefault();  // Impede o envio padrão do formulário

    // pega os dados dos campos do formulário
    let nomeCachorro = document.getElementById("nomeCachorro").value;
    let nomeDono = document.getElementById("nomeDono").value;
    let telefone = document.getElementById("telefone").value;
    let email = document.getElementById("email").value;
    let imagem = document.getElementById("imagem").value;

    // criando o objeto com os dados do novo cachorro
    let novoCachorro = {
        cachorro: nomeCachorro,
        dono: nomeDono,
        telefone: telefone,
        email: email,
        imagem: imagem // A URL da imagem fornecida
    };

    // criando a linha na tabela e a adiciona
    let tabelaBody = document.getElementById("tbody");
    let linha = criaLinha(novoCachorro);
    tabelaBody.appendChild(linha);

    // limpando o formulário após adicionar o cachorro
    document.getElementById("formAdicionarCachorro").reset();
});