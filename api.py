from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

model = joblib.load("modelos/modelo.pkl")
vectorizer = joblib.load("modelos/vectorizer.pkl")

@app.route("/")
def inicio():
    return "IA carregada!"

@app.route("/prever", methods=["POST"])
def prever():

    dados = request.get_json()

    texto = dados["texto"]

    texto_transformado = vectorizer.transform([texto])

    resultado = model.predict(texto_transformado)

    return jsonify({
        "categoria": resultado[0]
    })

app.run(debug=True)
