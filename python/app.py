from flask import Flask, render_template, request, Response
from bs4 import BeautifulSoup
import requests
import json

# Initialize Flask app
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather', methods=['POST'])
def get_weather():
    city = request.form.get('city')
    url = f"https://www.google.com/search?q=weather+{city}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        try:
            location = soup.select_one("#wob_loc").text
            time = soup.select_one("#wob_dts").text
            temperature = soup.select_one("#wob_tm").text
            condition = soup.select_one("#wob_dc").text

            weather_info = {
                'location': location,
                'time': time,
                'temperature': f"{temperature}°C",
                'condition': condition
            }

            return Response(json.dumps(weather_info, ensure_ascii=False), content_type="application/json")
        except AttributeError:
            return Response(json.dumps({'error': 'Weather information not found. Please check the city name or try again later.'}, ensure_ascii=False), content_type="application/json", status=404)
    else:
        return Response(json.dumps({'error': 'Failed to fetch weather data from Google.'}, ensure_ascii=False), content_type="application/json", status=500)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')