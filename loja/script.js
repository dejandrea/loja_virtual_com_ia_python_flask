import { produtos as produtosMock } from "./produtos.js";
let produtos = [];

const SUPABASE_URL = "https://qhhhtozrfvhefbtrdina.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoaGh0b3pyZnZoZWZidHJkaW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NTAzMjgsImV4cCI6MjA5NjUyNjMyOH0.S72wfz144zzzNnvAVVLZlZNjr69onv2biuB8l-Zjr3A";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let quantidadeCarrinho = 0; //let == var

const contadorCarrinho = document.getElementById("contador-carrinho");

const mensagemCarrinho = document.getElementById("mensagem-carrinho");
const campoIA = document.getElementById("campo-ia");
const botaoIA = document.getElementById("botao-ia");
const resultadoIA = document.getElementById("resultado-ia");
const listaProdutos = document.getElementById("lista-produtos");

async function carregarProdutos() {
  try {
    const { data, error } = await supabaseClient.from("produtos").select("*");

    if (error) {
      throw error;
    }

    produtos = data || [];
  } catch (erro) {
    console.error(
      "Erro ao carregar produtos do banco. Exibindo produtos locais:",
      erro,
    );
    produtos = produtosMock;
  }

  console.table(produtos);
  mostrarProdutos(produtos);
}

carregarProdutos();

function mostrarProdutos(lista) {
  listaProdutos.innerHTML = "";
  lista.forEach(function (produto) {
    listaProdutos.innerHTML += `
      <div class="col-md-4">
        <div class="card h-100">
          <img 
            src="${produto.imagem_url || produto.imagem}" 
            class="card-img-top"
          >
          <div class="card-body">
            <h5 class="card-title">
              ${produto.nome}
            </h5>
            <p class="card-text">
              ${produto.descricao}
            </p>
            <p class="preco">
              ${produto.preco}
            </p>
            <button class="btn btn-primary botao-comprar">
              Comprar
            </button>
          </div>
        </div>
      </div>
    `;
  });

  ativarBotoesComprar();
}



const mensagens_por_categoria = {
  smartphone: "Veja nossa sessão de smartphones.",
  notebook: "Veja nossa sessão de notebooks.",
  games: "Veja nossa sessão de games e consoles.",
  smartwatch: "Veja nossa sessão de smartwatches.",
  tablet: "Veja nossa sessão de tablets.",
  audio: "Veja nossa sessão de audio e fones.",
  perifericos: "Veja nossa sessão de perifericos.",
  armazenamento: "Veja nossa sessão de armazenamento.",
  casa_inteligente: "Veja nossa sessão de casa inteligente.",
  criacao_conteudo: "Veja nossa sessão de criacao de conteudo.",
  acessorios: "Veja nossa sessão de acessorios.",
  presentes_tech: "Veja nossa sessão de presentes de tecnologia.",
};

function ativarIA() {
  botaoIA.addEventListener("click", async function () {
    const texto = campoIA.value.trim();
    if (texto === "") {
      resultadoIA.textContent = "Digite o que você está procurando antes de perguntar para a IA.";
      resultadoIA.classList.remove("d-none");
      return;
    }
    try {
      const resposta = await fetch("http://127.0.0.1:5000/prever", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ texto: texto,}),
      });
      const dados = await resposta.json();
      const categoriaRecomendada = dados.categoria;
      const mensagem = mensagens_por_categoria[categoriaRecomendada] || "Não encontrei uma seção ideal para sua busca.";
      resultadoIA.textContent = mensagem;
      resultadoIA.classList.remove("d-none");
      const produtosFiltrados = produtos.filter(function (produto) {
        return produto.categoria === categoriaRecomendada;
      });
      mostrarProdutos(produtosFiltrados);
      setTimeout(function () {
        resultadoIA.classList.add("d-none");
      }, 5000);
    } catch (erro) {
      resultadoIA.textContent = "Não consegui conectar com a IA. Verifique se a API está ligada.";
      resultadoIA.classList.remove("d-none");
      console.log("Erro ao conectar com a IA:", erro);
    }
  });
}

function ativarBotoesComprar() {
  const botoesComprar = document.querySelectorAll(".botao-comprar");

  botoesComprar.forEach(function (botao) {
    botao.addEventListener("click", function () {
      quantidadeCarrinho++;
      contadorCarrinho.textContent = quantidadeCarrinho;
      const card = botao.closest(".card");
      const nomeProduto = card.querySelector(".card-title").textContent;
      mensagemCarrinho.textContent =
        nomeProduto + " foi adicionado ao carrinho!";
      mensagemCarrinho.classList.remove("d-none");

      setTimeout(() => {
        mensagemCarrinho.classList.add("d-none");
      }, 2000);
    });
  });
}

function recarregarProdutos() {
  mostrarProdutos(produtos);
}
ativarIA()
