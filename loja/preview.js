const IMAGEM_PADRAO = "https://source.unsplash.com/featured/300x300?product";

const nomeInput = document.getElementById("nomeProduto");
const descricaoInput = document.getElementById("descricaoProduto");
const precoInput = document.getElementById("precoProduto");
const imagemInput = document.getElementById("imagemProduto");

const previewImagem = document.getElementById("previewImagem");
const previewNome = document.getElementById("previewNome");
const previewDescricao = document.getElementById("previewDescricao");
const previewPreco = document.getElementById("previewPreco");

function atualizarPreview() {
  const nome = nomeInput.value.trim();
  const descricao = descricaoInput.value.trim();
  const preco = precoInput.value;
  const imagem = imagemInput.value.trim();
  const imagemValida = imagem !== "" && imagemInput.checkValidity();

  previewNome.textContent = nome || "Nome do Produto";
  previewDescricao.textContent = descricao || "Descricao...";
  previewPreco.textContent = formatarPreco(preco);
  previewImagem.src = imagemValida ? imagem : IMAGEM_PADRAO;
}

previewImagem.addEventListener("error", function () {
  previewImagem.src = IMAGEM_PADRAO;
});

[nomeInput, descricaoInput, precoInput, imagemInput].forEach(function (campo) {
  campo.addEventListener("input", atualizarPreview);
});
