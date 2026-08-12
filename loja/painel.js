let produtos = [];

const SUPABASE_URL = "https://qhhhtozrfvhefbtrdina.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoaGh0b3pyZnZoZWZidHJkaW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NTAzMjgsImV4cCI6MjA5NjUyNjMyOH0.S72wfz144zzzNnvAVVLZlZNjr69onv2biuB8l-Zjr3A";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function verificarLogin(){
  const {data} = await supabaseClient.auth.getSession();
  if(data.session === null){
    window.location.href = "login.html";
    return
  }

  console.log("Usuário logado:", data.session.user.email);
  carregarProdutos();
}

verificarLogin();

const formProduto = document.getElementById("formProduto");
const listaProdutos = document.getElementById("lista-produtos");
const totalProdutos = document.getElementById("total-produtos");
const btnLimpar = document.getElementById("btnLimpar");
const nomeProduto = document.getElementById("nomeProduto");
const descricaoProduto = document.getElementById("descricaoProduto");
const categoriaProduto = document.getElementById("categoriaProduto");
const precoProduto = document.getElementById("precoProduto");
const imagemProduto = document.getElementById("imagemProduto");
const btnCadastrar = document.getElementById("btnCadastrar");
const btnSair = document.getElementById("btnSair");
let produtoEditandoId = null;

function formatarPreco(valor) {
  const numero = Number(valor) || 0;

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

async function carregarProdutos() {
  const { data, error } = await supabaseClient.from("produtos").select("*");
  produtos = data;
  console.table(produtos);
  mostrarProdutos(produtos);
}



function atualizarTotalProdutos() {
  totalProdutos.textContent = produtos.length;
}

function mostrarProdutos(lista) {
  listaProdutos.innerHTML = "";

  lista.forEach(function (produto) {
    listaProdutos.innerHTML += `
      <div class="col-md-4">
        <div class="card h-100">
          <img src="${produto.imagem_url}" class="card-img-top" alt="${produto.nome}">
          <div class="card-body">
              <h5 class="card-title">${produto.nome}</h5>
              <p class="card-text" style="height: 80px; overflow: hidden;">${produto.descricao}</p>
              <p class="preco">${formatarPreco(produto.preco)}</p>
              <button 
                  class="btn btn-primary botao-editar"
                  onclick="editarProduto(
                    ${produto.id}, 
                    '${produto.nome}', 
                    '${produto.descricao}', 
                    '${produto.preco}', 
                    '${produto.categoria}', 
                    '${produto.imagem_url}'
                    ); location.href='#produtos';"
                  >Editar
              </button>

              <button
                class="btn btn-danger btn-sm"
                onclick="excluirProduto(${produto.id})"
              >
                Excluir
              </button>
          </div>
        </div>
      </div>
    `;
  });

  atualizarTotalProdutos();
}

async function cadastrarProduto() {
  const produto = {
    nome: nomeProduto.value.trim(),
    descricao: descricaoProduto.value.trim(),
    categoria: categoriaProduto.value,
    preco: precoProduto.value,
    imagem_url: imagemProduto.value.trim(),
  };

  if(produtoEditandoId === null){
    const { error } = await supabaseClient.from("produtos").insert([produto]);

    if (error) {
        console.log("Erro ao cadastrar produto:", error.message);
        alert("Erro ao cadastrar o produto: " + nomeProduto.value);
        return;
    }
    alert("Produto cadastrado com sucesso! ");
  }else{
    const { error } = await supabaseClient
    .from("produtos")
    .update(produto)
    .eq("id", produtoEditandoId);

    if (error) {
        console.log("Erro ao atualizar produto:", error.message);
        alert("Erro ao atualizar o produto: " + nomeProduto.value);
        return;
    }

    alert("Produto atualizado com sucesso! ");
    produtoEditandoId = null;
    btnCadastrar.textContent = "Cadastrar Produto";
    btnCadastrar.classList.remove("btn-primary");
    btnCadastrar.classList.add("btn-success");
  }
  
  limparFormulario();
  carregarProdutos();
}

btnCadastrar.addEventListener("click", cadastrarProduto);

function limparFormulario() {
  nomeProduto.value = "";
  descricaoProduto.value = "";
  precoProduto.value = "";
  categoriaProduto.value = "";
  imagemProduto.value = "";
}

function editarProduto(id, nome, descricao,preco,categoria, imagem_url){
    produtoEditandoId = id;
    nomeProduto.value = nome;
    descricaoProduto.value = descricao;
    categoriaProduto.value = categoria;
    precoProduto.value = preco;
    imagemProduto.value = imagem_url;

    btnCadastrar.textContent = "Salvar Alterações";
    btnCadastrar.classList.remove("btn-success");
    btnCadastrar.classList.add("btn-primary");
}

mostrarProdutos(produtos);

async function excluirProduto(id) {
  const confirmar = confirm("Tem certeza que deseja excluir este produto?");

  if (confirmar === false) {
    return;
  }

  const { error } = await supabaseClient
    .from("produtos")
    .delete()
    .eq("id", id);

  if (error) {
    console.log("Erro ao excluir produto:", error);
    alert("Erro ao excluir produto!");
    return;
  }

  alert("Produto excluído com sucesso!");

  carregarProdutos();
}

btnSair.addEventListener("click", async function () {
  const { error } = await supabaseClient.auth.signOut();    

  if(error){
    console.log("Erro ao sair: ", error);
    return
  }

  window.location.href = "login.html";

})