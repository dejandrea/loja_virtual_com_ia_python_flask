import joblib

model = joblib.load("modelos/modelo.pkl")
vectorizer = joblib.load("modelos/vectorizer.pkl")

mensagens_por_categoria = {
    "smartphone": "Veja nossa secao de smartphones.",
    "notebook": "Veja nossa secao de notebooks.",
    "games": "Veja nossa secao de games e consoles.",
    "smartwatch": "Veja nossa secao de smartwatches.",
    "tablet": "Veja nossa secao de tablets.",
    "audio": "Veja nossa secao de audio e fones.",
    "perifericos": "Veja nossa secao de perifericos.",
    "armazenamento": "Veja nossa secao de armazenamento.",
    "casa_inteligente": "Veja nossa secao de casa inteligente.",
    "criacao_conteudo": "Veja nossa secao de criacao de conteudo.",
    "acessorios": "Veja nossa secao de acessorios.",
    "presentes_tech": "Veja nossa secao de presentes de tecnologia.",
}

print("IA carregada!")

while True:
    entrada = input("Cliente: ").strip()

    if entrada.lower() == "sair":
        break

    entrada_transformada = vectorizer.transform([entrada])
    categoria = model.predict(entrada_transformada)[0]

    print("Categoria:", categoria)
    print(mensagens_por_categoria.get(categoria, "Veja nossa secao de tecnologia."))
