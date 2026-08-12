const SUPABASE_URL = "https://qhhhtozrfvhefbtrdina.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoaGh0b3pyZnZoZWZidHJkaW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NTAzMjgsImV4cCI6MjA5NjUyNjMyOH0.S72wfz144zzzNnvAVVLZlZNjr69onv2biuB8l-Zjr3A";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("login conectado com sucesso")

const emailLogin = document.getElementById("emailLogin");
const senhaLogin = document.getElementById("senhaLogin");
const btnLogin = document.getElementById("btnLogin");
const mensagemLogin = document.getElementById("mensagemLogin");

btnLogin.addEventListener("click", async function () {
    const email = emailLogin.value;
    const senha = senhaLogin.value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: senha,
    });

    if (error) {
        console.log("Erro no login: ", error);
        mensagemLogin.textContent = "Email ou senha Incorretos"
        mensagemLogin.classList.add("text-danger");
        return
    }

    console.log("Login bem-sucedido: ", data);
    mensagemLogin.textContent = "Login realizado com sucesso!";
    mensagemLogin.classList.remove("text-danger");
    mensagemLogin.classList.add("text-success");
    window.location.href = "painel.html";
})