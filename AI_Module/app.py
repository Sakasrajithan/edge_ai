from flask import Flask, request, jsonify
from predict import predict_machine

app = Flask(__name__)

@app.route("/")
def home():
    return jsonify({
        "message": "Predictive Maintenance AI API is running!"
    })


@app.route("/predict", methods=["POST"])
def predict():

    try:

        sensor_data = request.get_json()

        required_fields = [
            "Type",
            "Air_temperature_K",
            "Process_temperature_K",
            "Rotational_speed_rpm",
            "Torque_Nm",
            "Tool_wear_min"
        ]

        missing = [field for field in required_fields if field not in sensor_data]

        if missing:
            return jsonify({
                "error": "Missing required fields",
                "missing_fields": missing
            }), 400

        result = predict_machine(sensor_data)

        return jsonify(result)

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)