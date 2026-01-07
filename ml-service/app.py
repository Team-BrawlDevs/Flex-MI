from fastapi import FastAPI
import joblib
import numpy as np

app = FastAPI()

pulse_model = joblib.load("models/pulse_score_model.pkl")
intent_model = joblib.load("models/intent_model.pkl")

@app.post("/predict/pulse")
def predict_pulse(data: dict):
    X = np.array([[
        data["closing_balance"],
        data["daily_inflow"],
        data["total_spent"],
        data["balance_to_emi"]
    ]])
    score = pulse_model.predict(X)[0]
    return {"pulse_score": float(score)}

@app.post("/predict/intent")
def predict_intent(data: dict):
    X = np.array([[
        data["daily_inflow"],
        data["closing_balance"],
        data["missed_emi_count"],
        data["balance_to_emi"]
    ]])
    risk = intent_model.predict_proba(X)[0][1]
    return {"intent_risk": float(risk)}
