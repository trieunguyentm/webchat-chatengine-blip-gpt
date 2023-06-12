from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv
import openai

app = Flask(__name__)
CORS(app)  # Áp dụng cấu hình CORS cho ứng dụng Flask

# Load environment variables from .env file
load_dotenv('.env')
# API gửi tin nhắn cho ChatBot
@app.route('/openai/text', methods=['POST'])
def process_text():
    # Lấy dữ liệu từ phần body của request
    data = request.get_json() 
    activeChatId = data['activeChatId']
    text = data['text']
    if text.strip() == "":
        response = {
            'message': 'null question'
        }
        return jsonify(response), 200

    # Gửi yêu cầu API đến ChatEngine, BLIP
    try: 
        # TH1: text,Gửi API đến lấy các tin nhắn cũ, Gửi yêu cầu API đến OpenAI sau đó gửi response trả về đến ChatEngine, nhận response trả về sau đó trả về cho front-end
        if((not text.startswith('[image_caption]')) and (not text.startswith('[image_question]'))):
            # Thu về messages gần đây
            try:
                url = f"https://api.chatengine.io/chats/{activeChatId}/messages/latest/{os.getenv('NUMBER_MESSAGE')}/"
                payload = {}
                headers = {
                    'Project-ID': os.getenv('PROJECT_ID'),
                    'User-Name': os.getenv('BOT_USER_NAME'),
                    'User-Secret': os.getenv('BOT_USER_SECRET'),
                }
                response = requests.get(url, headers=headers, data=payload)
                data = response.json()  # Chuyển đổi nội dung phản hồi thành JSON
            except requests.exceptions.RequestException as e:
                error_message = str(e)
                response = {
                    'status': 'error',
                    'message': 'An error occurred when sending the API request to ChatEngine to get messages.',
                    'error': error_message
                }
                return jsonify(response), 500
            #Tạo messages để gửi đi cho OpenAI
            messages = []
            
            for entry in data:
                sender_username = entry['sender_username']
                if sender_username != "AiChat_":
                    role = "user"
                else:
                    role = "assistant"
                
                content = entry['text']
                
                message = {
                    'role': role,
                    'content': content
                }
                
                messages.append(message)
            # Sau khi thu về message, gửi nó cho openAI
            try:
                openai.api_key = os.getenv('OPEN_API_KEY')
                completion = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=messages,
                )
                data_send_to_user = completion['choices'][0]['message']['content']
            except requests.exceptions.RequestException as e:
                error_message = str(e)
                response = {
                    'status': 'error',
                    'message': 'An error occurred during the API request to OpenAI.',
                    'error': error_message
                }
                return jsonify(response), 500

            # Send data_send_to_user tới ChatEngine để hiển thị cho người dùng thấy
            try:
                chatengine_endpoint = f"https://api.chatengine.io/chats/{activeChatId}/messages/"
                chatengine_payload = {
                    'text': data_send_to_user
                }
                chatengine_headers = {
                    'Project-ID': os.getenv('PROJECT_ID'),
                    'User-Name': os.getenv('BOT_USER_NAME'),
                    'User-Secret': os.getenv('BOT_USER_SECRET'),
                    'Content-Type': 'application/json'
                }
                chatengine_response = requests.post(chatengine_endpoint, json=chatengine_payload, headers=chatengine_headers)
                return jsonify(chatengine_response.json()), 200
            except requests.exceptions.RequestException as e:
                error_message = str(e)
                response = {
                    'status': 'error',
                    'message': 'An error occurred when send the API request to send message to user.',
                    'error': error_message
                }
                return jsonify(response), 500
                
        # TH2: Trường hợp text = [image_caption], Tạo caption cho ảnh gần nhất trong cuộc hội thoại
        # Lấy đường dẫn của ảnh từ ChatEngine, sau đó gửi API đến blip, sau đó gửi lại đến ChatEngine, sau đó gửi lại front-end
        elif(text.startswith('[image_caption]')):
            chatengine_get_image = f"https://api.chatengine.io/chats/{activeChatId}/"
            chatengine_get_image_payload = {}
            chat_engine_get_image_headers = {
                'Project-ID': os.getenv('PROJECT_ID'),
                'User-Name': os.getenv('BOT_USER_NAME'),
                'User-Secret': os.getenv('BOT_USER_SECRET'),
                'Content-Type': 'application/json'
            }
            chatengine_get_image_response = requests.get(chatengine_get_image, data=chatengine_get_image_payload, headers=chat_engine_get_image_headers)
            attachments = chatengine_get_image_response.json()['attachments']
            if attachments:
                link_image = attachments[0]['file']
                # Write code to send link_image to BLIP
                payload = {
                    'image_url': link_image,
                    'model_name': 'Image Captioning',
                    'question': '',
                    'caption_strategy': 'Nucleus sampling'
                }
                try:
                    response = requests.post('http://localhost:9000/openai/text/blip', json=payload)
                    response_data = response.json()
                    # Tiếp tục gửi API đến ChatEngine
                    chatengine_endpoint = f"https://api.chatengine.io/chats/{activeChatId}/messages/"
                    chatengine_payload = {
                        'text': response_data['result']
                    }
                    chatengine_headers = {
                        'Project-ID': os.getenv('PROJECT_ID'),
                        'User-Name': os.getenv('BOT_USER_NAME'),
                        'User-Secret': os.getenv('BOT_USER_SECRET'),
                        'Content-Type': 'application/json'
                    }
                    chatengine_response = requests.post(chatengine_endpoint, json=chatengine_payload, headers=chatengine_headers)
                    return jsonify(chatengine_response.json()), 200
                except requests.exceptions.RequestException as e:
                    error_message = str(e)
                    response = {
                        'status': 'error',
                        'message': 'An error occurred during the API request to BLIP.',
                        'error': error_message
                    }
                    return jsonify(response), 500
            else:
                response = {
                    'status': 'error',
                    'message': 'No image attachment found.'
                }
                return jsonify(response), 400
        # Trường hợp text = [image_question]...
        # Lấy đường dẫn của ảnh từ ChatEngine, sau đó gửi API đến blip, sau đó gửi lại đến ChatEngine, sau đó gửi lại front-end
        else: 
            chatengine_get_image = f"https://api.chatengine.io/chats/{activeChatId}/"
            chatengine_get_image_payload = {}
            chat_engine_get_image_headers = {
                'Project-ID': os.getenv('PROJECT_ID'),
                'User-Name': os.getenv('BOT_USER_NAME'),
                'User-Secret': os.getenv('BOT_USER_SECRET'),
                'Content-Type': 'application/json'
            }
            chatengine_get_image_response = requests.get(chatengine_get_image, data=chatengine_get_image_payload, headers=chat_engine_get_image_headers)
            attachments = chatengine_get_image_response.json()['attachments']
            if attachments:
                link_image = attachments[0]['file']
                # Write code to send link_image to BLIP
                payload = {
                    'image_url': link_image,
                    'model_name': 'Image Questioning',
                    'question': text[16:],
                    'caption_strategy': 'Nucleus sampling'
                }
                try:
                    response = requests.post('http://localhost:9000/openai/text/blip', json=payload)
                    response_data = response.json()
                    # Tiếp tục gửi API đến ChatEngine
                    chatengine_endpoint = f"https://api.chatengine.io/chats/{activeChatId}/messages/"
                    chatengine_payload = {
                        'text': response_data['result']
                    }
                    chatengine_headers = {
                        'Project-ID': os.getenv('PROJECT_ID'),
                        'User-Name': os.getenv('BOT_USER_NAME'),
                        'User-Secret': os.getenv('BOT_USER_SECRET'),
                        'Content-Type': 'application/json'
                    }
                    chatengine_response = requests.post(chatengine_endpoint, json=chatengine_payload, headers=chatengine_headers)
                    return jsonify(chatengine_response.json()), 200
                except requests.exceptions.RequestException as e:
                    error_message = str(e)
                    response = {
                        'status': 'error',
                        'message': 'An error occurred during the API request to BLIP.',
                        'error': error_message
                    }
                    return jsonify(response), 500
            else:
                response = {
                    'status': 'error',
                    'message': 'No image attachment found.'
                }
                return jsonify(response), 400
    except Exception as e:
        error_message = str(e)
        response = {
            'status': 'error',
            'message': 'An error occurred during processing.',
            'error': error_message
        }
        return jsonify(response), 500

@app.route('/auth/login', methods=['POST'])
def login():
    response = requests.get('https://api.chatengine.io/users/me/', 
        headers={ 
            "Project-ID": os.environ['PROJECT_ID'],
            "User-Name": request.get_json()['username'],
            "User-Secret": request.get_json()['secret']
        }
    )
    return response.json()

@app.route('/auth/signup', methods=['POST'])
def signup():
    response = requests.post('https://api.chatengine.io/users/', 
        data={
            "username": request.get_json()['username'],
            "secret": request.get_json()['secret'],
            "email": request.get_json()['email'],
            "first_name": request.get_json()['first_name'],
            "last_name": request.get_json()['last_name'],
        },
        headers={ "Private-Key": os.environ['PRIVATE_KEY'] }
    )
    return response.json()

if __name__ == '__main__':
    app.run(port=2400)
