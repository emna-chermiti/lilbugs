from flask import Flask, jsonify, request
from flask_cors import CORS
import your_model  # import your existing .py or notebook logic

app = Flask(__name__)
CORS(app)  # allows your HTML file to call this API

# --- Endpoint 1: Live sensor data / predictions ---
@app.route('/api/sensors', methods=['GET'])
def get_sensors():
    data = your_model.get_live_readings()  # your model function
    return jsonify(data)

# --- Endpoint 2: Send input, get prediction ---
@app.route('/api/predict', methods=['POST'])
def predict():
    payload = request.get_json()
    result = your_model.predict(payload)  # your model function
    return jsonify({ "prediction": result })

# --- Endpoint 3: Forecast data for charts ---
@app.route('/api/forecast', methods=['GET'])
def forecast():
    data = your_model.get_forecast()
    return jsonify(data)

if __name__ == '__main__':
    app.run(port=5000, debug=True)