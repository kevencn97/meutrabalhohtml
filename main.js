// --- Funções de Utilitário ---

// Função para fazer requisições GET
async function fazGet(url) {
    try {
        const response = await fetch(url);
        // Verifica se a resposta HTTP foi bem-sucedida (status 200-299)
        if (!response.ok) {
            // Lança um erro se a resposta não for OK
            throw new Error(`Erro HTTP! Status: ${response.status} para ${url}`);
        }
        return await response.json(); // Retorna os dados JSON
    } catch (error) {
        // Captura e loga qualquer erro durante a requisição
        console.error('Erro na requisição fazGet:', error);
        return null; // Retorna null para indicar falha na requisição
    }
}

// --- Funções da Tabela ---

// Função para criar as linhas da tabela
function criaLinha(dadosCachorro) {
    let linha = document.createElement("tr");

    // Adiciona o atributo data-label para responsividade
    linha.innerHTML = `
        <td data-label="Imagem"><img src="${dadosCachorro.imagem || 'https://via.placeholder.com/100x100?text=Sem+Imagem'}" alt="Imagem do ${dadosCachorro.cachorro || 'cachorro'}"></td>
        <td data-label="Cachorro">${dadosCachorro.cachorro}</td>
        <td data-label="Dono">${dadosCachorro.dono}</td>
        <td data-label="Telefone">${dadosCachorro.telefone}</td>
        <td data-label="Email">${dadosCachorro.email}</td>
        <td data-label="Ações">
            <button class="edit-btn">Editar</button>
            <button class="delete-btn">Excluir</button>
        </td>
    `;

    // Seleciona os botões dentro da nova linha
    let btnEditar = linha.querySelector(".edit-btn");
    let btnExcluir = linha.querySelector(".delete-btn");

    // Atribui os eventos aos botões
    btnEditar.onclick = function() {
        const tdCachorro = linha.querySelector('td[data-label="Cachorro"]');
        const tdDono = linha.querySelector('td[data-label="Dono"]');
        const tdTelefone = linha.querySelector('td[data-label="Telefone"]');
        const tdEmail = linha.querySelector('td[data-label="Email"]');
        const tdImagem = linha.querySelector('td[data-label="Imagem"]'); // Passa o tdImagem
        editarLinha(linha, tdCachorro, tdDono, tdTelefone, tdEmail, tdImagem);
    };

    btnExcluir.onclick = function() { excluirLinha(btnExcluir); };

    return linha;
}

// Função para excluir a linha da tabela
function excluirLinha(botao) {
    let linha = botao.closest("tr");
    linha.remove();
}

// Função para editar a linha
function editarLinha(linha, tdCachorro, tdDono, tdTelefone, tdEmail, tdImagem) {
    // Pega o valor atual da imagem (src da img dentro do tdImagem)
    const imagemElement = tdImagem.querySelector("img");
    const imagemAtualSrc = imagemElement ? imagemElement.src : '';

    tdCachorro.innerHTML = `<input type="text" class="edit-input" value="${tdCachorro.textContent}" />`;
    tdDono.innerHTML = `<input type="text" class="edit-input" value="${tdDono.textContent}" />`;
    tdTelefone.innerHTML = `<input type="text" class="edit-input" value="${tdTelefone.textContent}" />`;
    tdEmail.innerHTML = `<input type="text" class="edit-input" value="${tdEmail.textContent}" />`;
    tdImagem.innerHTML = `<input type="url" class="edit-input" value="${imagemAtualSrc}" />`;

    let btnEditar = linha.querySelector(".edit-btn");
    btnEditar.innerText = "Salvar";
    // Atualiza o onclick para chamar salvarEdicao
    btnEditar.onclick = function() { salvarEdicao(linha, tdCachorro, tdDono, tdTelefone, tdEmail, tdImagem); };
}

// Função para salvar a edição da linha
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
    if (!imgElement) { // Se não encontrou a imagem (ex: tdImagem tinha apenas o input)
        imgElement = document.createElement("img");
        tdImagem.innerHTML = ''; // Limpa o conteúdo (o input)
        tdImagem.appendChild(imgElement); // Adiciona a tag img
    }
    imgElement.src = novaImagemUrl;
    imgElement.alt = `Imagem do ${novoCachorro}`; // Atualiza o alt text
    // Garante que os estilos da imagem sejam aplicados mesmo após a edição
    imgElement.style.maxWidth = "100px"; 
    imgElement.style.height = "100px"; 
    imgElement.style.objectFit = "cover";
    imgElement.style.borderRadius = "5px";

    let btnSalvar = linha.querySelector(".edit-btn");
    btnSalvar.innerText = "Editar";
    // Retorna o onclick para chamar editarLinha
    btnSalvar.onclick = function() { editarLinha(linha, tdCachorro, tdDono, tdTelefone, tdEmail, tdImagem); };
}


// --- Lógica Principal de Carregamento da API ---

// Função principal para carregar os dados de cachorros da Dog CEO API
async function main() {
    const breedsData = await fazGet("https://dog.ceo/api/breeds/list/all");
    const tabelaBody = document.getElementById("tbodyCachorros");

    if (breedsData && breedsData.status === "success") {
        const breeds = breedsData.message;
        const breedNames = Object.keys(breeds);

        const limit = 20; // Limite de raças para exibir inicialmente
        const breedsToDisplay = breedNames.slice(0, limit);

        for (const raca of breedsToDisplay) {
            const imageUrlData = await fazGet(`https://dog.ceo/api/breed/${raca}/images/random`);
            if (imageUrlData && imageUrlData.status === "success" && imageUrlData.message) { // Garante que a URL da imagem existe
                const cachorro = {
                    cachorro: raca.charAt(0).toUpperCase() + raca.slice(1), // Capitaliza a primeira letra
                    imagem: imageUrlData.message, // URL da imagem
                    dono: "Dono Fictício", // Dado padrão
                    telefone: "(XX) XXXXX-XXXX", // Dado padrão
                    email: "email@ficticio.com" // Dado padrão
                };
                let linha = criaLinha(cachorro);
                tabelaBody.appendChild(linha);
            }
        }
    } else {
        console.error("Não foi possível carregar as raças da API. Verifique a conexão ou o console para erros HTTP.");
    }
}

// --- Funções de Adição Manual ---

// Adiciona um cachorro à tabela via formulário
document.addEventListener("DOMContentLoaded", () => {
    const formAdicionarCachorro = document.getElementById("formAdicionarCachorro");
    if (formAdicionarCachorro) {
        formAdicionarCachorro.addEventListener("submit", function(event) {
            event.preventDefault();

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
                imagem: imagem
            };

            // Criando a linha na tabela e a adiciona
            let tabelaBody = document.getElementById("tbodyCachorros");
            let linha = criaLinha(novoCachorro);
            tabelaBody.appendChild(linha);

            // Limpando o formulário após adicionar o cachorro
            formAdicionarCachorro.reset();
        });
    } else {
        console.error("Erro: Formulário de adição não encontrado! Verifique o ID 'formAdicionarCachorro'.");
    }
});

// Chama a função principal para carregar os dados ao carregar a página
main();
