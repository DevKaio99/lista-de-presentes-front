// Endereço do seu backend Spring Boot
const API_URL = "http://localhost:8080/itens";

// Seleciona o container onde os itens serão renderizados
const listaContainer = document.getElementById("lista-itens");

// Função para carregar os itens do backend
async function carregarItens() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Erro ao buscar itens");
    }

    const itens = await response.json();
    exibirItens(itens);
  } catch (erro) {
    console.error("Erro:", erro);
    listaContainer.innerHTML = "<p>Não foi possível carregar os itens.</p>";
  }
}

// Função que cria os elementos HTML para cada item
function exibirItens(itens) {
  listaContainer.innerHTML = ""; // limpa a lista

  itens.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("item");
    div.setAttribute("data-id", item.id);

    div.innerHTML = `
      <img src="${item.foto}" alt="${item.nome}">
      <h3>${item.nome}</h3>

      <p><strong>Quantidade disponível:</strong> ${item.quantidade}</p>
      <p>Valor: ${item.preco} R$</p>
      <button ${item.quantidade <= 0 ? "disabled" : ""}>Presentear</button>
    `;

    // Adiciona evento de clique no botão
    const botao = div.querySelector("button");
    botao.addEventListener("click", () => presentear(item));

    listaContainer.appendChild(div);
  });
}

async function presentear(item) {
  const nome = prompt(`Digite seu nome completo para registrar o presente do item: ${item.nome}`);
  if (!nome) return alert("Por favor, informe o nome.");

  try {
    const response = await fetch(`${API_URL}/presentear/${item.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nomePresenteador: nome })
    });

    if (!response.ok) throw new Error("Erro ao registrar o presente");

    const resultado = await response.json();
    alert(`Presente registrado com sucesso por ${resultado.nomePresenteador}!`);

  } catch (erro) {
    console.error("Erro:", erro);
    alert("Ocorreu um erro ao tentar registrar o presente.");
  }
}
// Atualiza o item na tela (sem recarregar tudo)
function atualizarItemNaTela(itemAtualizado) {
  const itemDiv = document.querySelector(`.item[data-id="${itemAtualizado.id}"]`);
  if (!itemDiv) return;

  // Atualiza a quantidade e botão
  const qtd = itemDiv.querySelector("p strong");
  qtd.nextSibling.textContent = ` ${itemAtualizado.quantidade}`;
  const botao = itemDiv.querySelector("button");
  if (itemAtualizado.quantidade <= 0) botao.disabled = true;
}


// Chama a função assim que a página carregar
carregarItens();
