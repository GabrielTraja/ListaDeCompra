// Seleciona os elementos do DOM
const form = document.getElementById('form');
const produtoInput = document.getElementById('produto');
const imagemInput = document.getElementById('imagem');
const lista = document.getElementById('lista');
const alertDiv = document.getElementById('alert');
const btnLimpar = document.getElementById('btnLimpar');

// Produtos pré-cadastrados com imagens
const produtosIniciais = [
    { nome: 'Arroz', imagem: 'imagens/Arroz.png' }, // Corrigido de img.src para imagem
    { nome: 'Feijão', imagem: 'imagens/Feijao.webp' }, // Exemplo de imagem interna
    { nome: 'Leite', imagem: 'imagens/Leite.jpeg' }, // Exemplo de imagem interna
    { nome: 'Ovo', imagem: 'imagens/Ovo.webp' }, // Exemplo de imagem interna
    { nome: 'Pão', imagem: 'imagens/Pao.avif' } // Exemplo de imagem interna
];

// Carrega os produtos do localStorage ao inicializar a página
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    produtosIniciais.forEach(({ nome, imagem }) => {
        if (!produtoExistente(nome)) {
            adicionarProdutoNaLista(nome, imagem, false); // Adiciona sem estar comprado
            salvarProduto(nome, imagem, false); // Salva como não comprado
        }
    });
});

// Função para carregar produtos do localStorage
function carregarProdutos() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos.sort((a, b) => a.nome.localeCompare(b.nome)); // Ordena em ordem alfabética
    const produtosComprados = produtos.filter(p => p.comprado);
    const produtosNaoComprados = produtos.filter(p => !p.comprado);

    // Adiciona produtos não comprados
    produtosNaoComprados.forEach(({ nome, imagem }) => {
        adicionarProdutoNaLista(nome, imagem, false);
    });

    // Adiciona produtos comprados
    produtosComprados.forEach(({ nome, imagem }) => {
        adicionarProdutoNaLista(nome, imagem, true);
    });
}

// Adiciona um evento de submit ao formulário
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Previne o envio padrão do formulário
    const produto = capitalize(produtoInput.value.trim()); // Obtém o valor do input e capitaliza
    const imagem = imagemInput.value.trim(); // Obtém o valor da imagem

    if (!produto || produtoExistente(produto)) {
        mostrarAlerta('Produto já cadastrado ou inválido!', 'danger'); // Alerta se o produto já existe
        return;
    }

    adicionarProdutoNaLista(produto, imagem, false); // Adiciona à lista visualmente sem estar comprado
    salvarProduto(produto, imagem, false); // Salva no localStorage como não comprado
    produtoInput.value = ''; // Limpa o input do produto
    imagemInput.value = ''; // Limpa o input da imagem
});

// Função para adicionar um produto na lista
function adicionarProdutoNaLista(produto, imagem, comprado) {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';

    // Cria um div para a imagem e o texto do produto
    const divProduto = document.createElement('div');
    divProduto.className = 'd-flex align-items-center';

    // Cria a imagem
    const img = document.createElement('img');
    img.src = imagem;
    img.alt = produto;
    img.style.width = '50px'; // Define a largura da imagem
    img.style.height = '50px'; // Define a altura da imagem
    img.className = 'mr-2'; // Margem à direita

    const nomeProduto = document.createElement('span');
    nomeProduto.textContent = produto;

    // Adiciona a imagem e o nome ao div
    divProduto.appendChild(img);
    divProduto.appendChild(nomeProduto);
    li.appendChild(divProduto);

    if (comprado) {
        li.classList.add('list-group-item-success');
        li.style.textDecoration = 'line-through'; // Riscado se comprado
    }

    // Div para os botões alinhados à direita
    const divBotoes = document.createElement('div');
    divBotoes.className = 'ml-auto';

    // Botão para marcar como comprado
    const btnComprado = document.createElement('button');
    btnComprado.textContent = 'Comprado';
    btnComprado.className = 'btn btn-success btn-sm';
    btnComprado.onclick = () => {
        li.classList.toggle('list-group-item-success'); // Marca como comprado
        li.style.textDecoration = li.style.textDecoration === 'line-through' ? 'none' : 'line-through'; // Riscado
        atualizarProduto(produto, imagem, li.classList.contains('list-group-item-success')); // Atualiza o estado no localStorage
        atualizarLista(); // Atualiza a lista na tela
    };

    // Botão para remover o produto
    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'Remover';
    btnRemover.className = 'btn btn-danger btn-sm ml-2';
    btnRemover.onclick = () => {
        lista.removeChild(li); // Remove da lista visualmente
        removerProduto(produto); // Remove do localStorage
    };

    // Adiciona os botões à div
    divBotoes.appendChild(btnComprado);
    divBotoes.appendChild(btnRemover);

    // Adiciona a div de botões ao item da lista
    li.appendChild(divBotoes);
    
    // Adiciona o item à lista no DOM
    lista.appendChild(li);
}

// Função para salvar produto no localStorage
function salvarProduto(produto, imagem, comprado) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos.push({ nome: produto, imagem, comprado }); // Salva nome, imagem e estado
    localStorage.setItem('produtos', JSON.stringify(produtos)); // Salva a lista atualizada
}

// Função para atualizar o estado do produto no localStorage
function atualizarProduto(produto, imagem, comprado) {
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos = produtos.map(p => 
        p.nome === produto ? { nome: p.nome, imagem: p.imagem, comprado } : p
    );
    localStorage.setItem('produtos', JSON.stringify(produtos)); // Salva a lista atualizada
}

// Função para remover produto do localStorage
function removerProduto(produto) {
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos = produtos.filter(p => p.nome !== produto); // Remove o produto específico
    localStorage.setItem('produtos', JSON.stringify(produtos)); // Salva a lista atualizada
}

// Função para verificar se o produto já existe
function produtoExistente(produto) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    return produtos.some(p => p.nome === produto);
}

// Função para capitalizar a primeira letra do produto
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Função para mostrar alertas na tela
function mostrarAlerta(mensagem, tipo) {
    alertDiv.innerHTML = `<div class="alert alert-${tipo}" role="alert">${mensagem}</div>`;
    setTimeout(() => {
        alertDiv.innerHTML = ''; // Limpa o alerta após 3 segundos
    }, 3000);
}

// Evento para limpar a lista
btnLimpar.addEventListener('click', () => {
    lista.innerHTML = ''; // Limpa a lista visualmente
    localStorage.removeItem('produtos'); // Limpa os produtos do localStorage
    mostrarAlerta('Lista limpa!', 'success'); // Exibe mensagem de sucesso
});

// Função para atualizar a lista na tela
function atualizarLista() {
    lista.innerHTML = ''; // Limpa a lista atual
    carregarProdutos(); // Recarrega os produtos
}
