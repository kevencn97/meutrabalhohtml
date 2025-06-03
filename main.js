// --- Funções de Utilitário ---

// Função para fazer requisições GET
async function fazGet(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro na requisição:', error);
        return null; // Retorna null em caso de erro para não quebrar o fluxo
    }
}

// --- Funções da Tabela ---

// Função para criar as linhas da tabela
function criaLinha(dadosCachorro) {
    let linha = document.createElement("tr");

    // Imagem do cachorro
    let tdImagem = document.createElement("td");
    let img = document.createElement("img");
    img.src = dadosCachorro.imagem || 'https://via.placeholder.com/100x100?text=Sem+Imagem'; // Imagem padrão se não houver
    img.alt = dadosCachorro.cachorro ? `Imagem de um ${dadosCachorro.cachorro}` : "Imagem do cachorro";
    tdImagem.appendChild(img);

    // Nome do cachorro
    let tdCachorro = document.createElement("td");
    tdCachorro.innerHTML = dadosCachorro.cachorro;

    // Nome do dono
    let tdDono = document.createElement("td");
    tdDono.innerHTML = dadosCachorro.dono;

    // Telefone do dono
    let tdTelefone = document.createElement("td");
    tdTelefone.innerHTML = dadosCachorro.telefone;

    // Email do dono
    let tdEmail = document.createElement("td");
    tdEmail.innerHTML = dadosCachorro.email;

    // Ações : editar e excluir
    let tdAcoes = document.createElement("td");

    // Botão de editar
    let btnEditar = document.createElement("button");
    btnEditar.innerText = "Editar";
    btnEditar.className = "edit-btn"; // Adiciona classe para estilização
    btnEditar.onclick = function() { editarLinha(linha, tdCachorro, tdDono, tdTelefone, tdEmail, tdImagem); };

    // Botão de Excluir
    let btnExcluir = document.createElement("button");
    btnExcluir.innerText = "Excluir";
    btnExcluir.className = "delete-btn"; // Adiciona classe para estilização
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

// Função para excluir a linha da tabela (sem mudanças)
function excluirLinha(botao) {
    let linha = botao.closest("tr");
    linha.remove();
}

// Função para editar a linha (adaptada para incluir a imagem)
function editarLinha(linha, tdCachorro, tdDono, tdTelefone, tdEmail, tdImagem) {
    const imagemAtual = tdImagem.querySelector("img").src;

    tdCachorro.innerHTML = `<input type="text" class="edit-input" value="${tdCachorro.innerHTML}" />`;
    tdDono.innerHTML = `<input type="text" class="edit-input" value="${tdDono.innerHTML}" />`;
    tdTelefone.innerHTML = `<input type="text" class="edit-input" value="${tdTelefone.innerHTML}" />`;
    tdEmail.innerHTML = `<input type="text" class="edit-input" value="${tdEmail.innerHTML}" />`;
    tdImagem.innerHTML = `<input type="url" class="edit-input" value="${imagemAtual}" />`; // Input para URL da imagem

    let btnEditar = linha.querySelector(".edit-btn"); // Usa a classe para selecionar
    btnEditar.innerText = "Salvar";
    btnEditar.onclick = function() { salvarEdicao(linha, tdCachorro, tdDono, tdTelefone, tdEmail, tdImagem); };
}

// Função para salvar a edição da linha (adaptada para incluir a imagem)
function salvarEdicao(linha, tdCachorro, tdDono, tdTelefone, tdEmail, tdImagem) {
    let novoCachorro = tdCachorro.querySelector("input").value;
    let novoDono = tdDono.querySelector("input").value;
    let novoTelefone = tdTelefone.querySelector("input").value;
    let novoEmail = tdEmail.querySelector("input").value;
    let novaImagemUrl = tdImagem.querySelector("input").value;

    tdCachorro.innerHTML = novoCachorro;
    tdDono.innerHTML = novoDono;
    tdTelefone.innerHTML = novoTelefone;
    tdEmail.innerHTML = novoEmail;
    
    // Atualiza a imagem no TD da imagem
    let imgElement = tdImagem.querySelector("img");
    if (imgElement) { // Se já existe uma imagem
        imgElement.src = novaImagemUrl;
    } else { // Se não existe (caso de algum erro na criação inicial)
        let newImg = document.createElement("img");
        newImg.src = novaImagemUrl;
        newImg.alt = `Imagem de um ${novoCachorro}`;
        newImg.style.width = "100px";
        newImg.style.height = "100px";
        newImg.style.objectFit = "cover";
        tdImagem.innerHTML = ''; // Limpa o input
        tdImagem.appendChild(newImg); // Adiciona a nova imagem
    }

    let btnSalvar = linha.querySelector(".edit-btn");
    btnSalvar.innerText = "Editar";
    btnSalvar.onclick = function() { editarLinha(linha, tdCachorro, tdDono, tdTelefone, tdEmail, tdImagem); };
}

// --- Lógica Principal de Carregamento da API ---

// Função principal para carregar os dados de cachorros da Dog CEO API
async function main() {
    const breedsData = await fazGet("https://dog.ceo/api/breeds/list/all");
    const tabelaBody = document.getElementById("tbodyCachorros");

    if (breedsData && breedsData.status === "success") {
        const breeds = breedsData.message;
        const breedNames = Object.keys(breeds); // Pega apenas os nomes das raças

        // Para evitar sobrecarga na API e carregar muitos dados de uma vez,
        // vamos limitar a um número razoável de raças para começar (ex: 20)
        const limit = 20;
        const breedsToDisplay = breedNames.slice(0, limit);

        for (const raca of breedsToDisplay) {
            const imageUrlData = await fazGet(`https://dog.ceo/api/breed/${raca}/images/random`);
            if (imageUrlData && imageUrlData.status === "success") {
                const cachorro = {
                    cachorro: raca.charAt(0).toUpperCase() + raca.slice(1), // Capitaliza a primeira letra da raça
                    imagem: imageUrlData.message,
                    dono: "Dono Fictício", // Preenche com dado padrão
                    telefone: "(XX) XXXXX-XXXX", // Preenche com dado padrão
                    email: "email@ficticio.com" // Preenche com dado padrão
                };
                let linha = criaLinha(cachorro);
                tabelaBody.appendChild(linha);
            }
        }
    } else {
        console.error("Não foi possível carregar as raças da API.");
    }
}

// --- Funções de Adição Manual ---

// Adiciona um cachorro à tabela via formulário
document.addEventListener("DOMContentLoaded", () => { // Garante que o DOM está carregado
    const formAdicionarCachorro = document.getElementById("formAdicionarCachorro");
    if (formAdicionarCachorro) {
        formAdicionarCachorro.addEventListener("submit", function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            // Pega os dados dos campos do formulário
            let nomeCachorro = document.getElementById("nomeCachorro").value;
            let imagem = document.getElementById("imagem").value;
            let nomeDono = document.getElementById("nomeDono").value;
            let telefone = document.getElementById("telefone").value;
            let email = document.getElementById("email").value;

            // Criando o objeto com os dados do novo cachorro
            let novoCachorro = {
                cachorro: nomeCachorro,
                dono: nomeDono,
                telefone: telefone,
                email: email,
                imagem: imagem // A URL da imagem fornecida
            };

            // Criando a linha na tabela e a adiciona
            let tabelaBody = document.getElementById("tbodyCachorros");
            let linha = criaLinha(novoCachorro);
            tabelaBody.appendChild(linha);

            // Limpando o formulário após adicionar o cachorro
            formAdicionarCachorro.reset();
        });
    }
});

// Chama a função principal para carregar os dados ao carregar a página
main();
