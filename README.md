<h1>Client</h1>
Cài đặt các thư viện: npm i
Tạo file .env.local và cấu hình như sau
VITE_BASE_URL= http://localhost:{cổng kết nối server}
VITE_PROJECT_ID = {CHAT_ENGINE_PROJECT_ID}
VITE_PROJECT_KEY = {CHAT_ENGINE_PROJECT_KEY}
Khởi chạy: <b>npm run dev</b>
<h1>Server</h1>
Tạo môi trường ảo (Đối với windows): <b>python -m venv pyenv</b>
Kích hoạt môi trường: <b>myenv\Scripts\activate</b>
Cài đặt thư viện trong requirements.txt: <b>pip install -r requirements.txt</b>
Khởi chạy: <b>python app.py</b>


