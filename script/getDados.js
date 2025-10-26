// Endereço backend
const API_URL = "http://localhost:8080/itens";

// Seleciona o container onde os itens serão exibidos
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

      <p><strong>Quantidade disponível:</strong> <span class="qtd">${item.quantidade}</span></p>
      <p>Valor: R$ ${item.preco},00</p>
      <button ${item.quantidade <= 0 ? "disabled" : ""}>Presentear</button>
    `;

    // Adiciona evento de clique no botão
    const botao = div.querySelector("button");
    botao.addEventListener("click", () => presentear(item));

    listaContainer.appendChild(div);
  });
}


// Abre o modal do botão Enviar Pix
const botaoPix = document.getElementById("botaoPix");
const modal = document.getElementById("modalEnviarPix");
botaoPix.addEventListener("click", () => {
  modal.style.display = "block";
});

// Evento do botão Copiar
document.getElementById("copiarPix").onclick = function () {
  const chaveInput = document.getElementById("pixChave");
  chaveInput.select();
  document.execCommand("copy");
  alert("Chave PIX copiada!");
};

// Fecha o modal
document.getElementById("fecharPixModal").addEventListener("click", () => {
  modalEnviarPix.style.display = "none";
});




// Função presentear
function presentear(item) {
  const nomePresenteador = prompt("Digite seu nome completo:");
  if (!nomePresenteador) return;

  // Mostra o modal com os dados do item
  const modal = document.getElementById("pixModal");
  document.getElementById("pixItemNome").textContent = item.nome;
  document.getElementById("pixValor").textContent = item.preco;
  const idSelecionado = item.id;
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
    if (!idSelecionado) {
      alert("Erro: nenhum presente selecionado.");
      return;
    }
    try {
      await fetch(`http://localhost:8080/itens/presentear/${idSelecionado}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nomePresenteador,
          itemId: item.id

        })
      });
      alert("Presente registrado! Obrigado!");
      modal.style.display = "none";
      setTimeout(() => {
        location.reload();
      }, 300);
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






// Chama a função assim que a página carregar
carregarItens();
