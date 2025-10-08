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

function presentear(item) {
  const nomePresenteador = prompt("Digite seu nome completo:");
  if (!nomePresenteador) return;

  // Mostra o modal com os dados do item
  const modal = document.getElementById("pixModal");
  document.getElementById("pixItemNome").textContent = item.nome;
  document.getElementById("pixValor").textContent = item.preco;
  modal.style.display = "block";

  // Evento do botão Copiar
  document.getElementById("copiarPix").onclick = function () {
    const chaveInput = document.getElementById("pixChave");
    chaveInput.select();
    document.execCommand("copy");
    alert("Chave PIX copiada!");
  };

  // Evento Confirmar
  document.getElementById("confirmarPresente").onclick = async function () {
    try {
      await fetch("http://localhost:8080/presentes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomePresenteador,
          itemId: item.id
        })
      });
      alert("Presente registrado! Obrigado!");
      modal.style.display = "none";
    } catch (err) {
      console.error(err);
      alert("Erro ao registrar presente.");
    }
  };

  // Fecha o modal
  document.querySelector(".close").onclick = () => modal.style.display = "none";
  window.onclick = (event) => {
    if (event.target === modal) modal.style.display = "none";
  };
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
