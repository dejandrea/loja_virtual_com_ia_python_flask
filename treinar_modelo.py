import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

df = pd.read_csv("dados.csv")

x = df["texto"]
y = df["categoria"]

print("Dados carregados!")

vectorizer = TfidfVectorizer()
model = LogisticRegression(max_iter=1000)

x_transformado = vectorizer.fit_transform(x)

model.fit(x_transformado, y)

print("Modelo treinado!")

joblib.dump(model, "modelos/modelo.pkl")
joblib.dump(vectorizer, "modelos/vectorizer.pkl")

print("Modelo salvo!")

