<h1>Client</h1>
Cài đặt các thư viện: npm i </br>
Tạo file .env.local và cấu hình như sau </br>
VITE_BASE_URL= http://localhost:{cổng kết nối server} </br>
VITE_PROJECT_ID = {CHAT_ENGINE_PROJECT_ID} </br>
VITE_PROJECT_KEY = {CHAT_ENGINE_PROJECT_KEY} </br>
Khởi chạy: <b>npm run dev</b> </br>
<h1>Server</h1> </br>
Tạo môi trường ảo (Đối với windows): <b>python -m venv pyenv</b> </br>
Kích hoạt môi trường: <b>myenv\Scripts\activate</b> </br>
Cài đặt thư viện trong requirements.txt: <b>pip install -r requirements.txt</b> </br>
Tạo file .env và cấu hình như sau </br>
PROJECT_ID={CHAT_ENGINE_PROJECT_ID}</br>
PRIVATE_KEY={CHAT_ENGINE_PROJECT_KEY}</br>
BOT_USER_NAME=AiChat_</br>
BOT_USER_SECRET={Tự tạo một secret cho AiChat_ bằng Chat Engine}</br>
OPEN_API_KEY={OPEN_API_KEY trên OpenAI}</br>
NUMBER_MESSAGE=20</br>
Khởi chạy: <b>python app.py</b>


