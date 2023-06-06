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

@app.route('/openai/text', methods=['POST'])
def process_text():
    data = request.get_json()  # Lấy dữ liệu từ phần body của request
    # attachments = data['attachments']
    # created = data['created']
    # sender_username = data['sender_username']
    text = data['text']
    if text.strip() == "":
        response = {
            'message': 'null question'
        }
        return jsonify(response), 200
    activeChatId = data['activeChatId']

    # Gửi yêu cầu API đến ChatEngine, BLIP
    try: 
        # TH1: text, Gửi yêu cầu API đến OpenAI sau đó gửi response trả về đến ChatEngine, nhận response trả về sau đó trả về cho front-end
        if((not text.startswith('[image_caption]')) and (not text.startswith('[image_question]'))):
            try:
                openai.api_key = os.getenv('OPEN_API_KEY')
                completion = openai.Completion.create(
                    model="text-davinci-003",
                    prompt=text,
                    max_tokens=30,
                    temperature=0
                    )
                data_send_to_user = completion['choices'][0]['text']
            except requests.exceptions.RequestException as e:
                error_message = str(e)
                response = {
                    'status': 'error',
                    'message': 'An error occurred during the API request to OpenAI.',
                    'error': error_message
                }
                return jsonify(response), 500
            # Send completion_text to ChatEngine
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
        # TH2: caption, Tạo caption cho ảnh gần nhất trong cuộc hội thoại
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
                    # Process the response as needed
                    # return jsonify(response_data), 200
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
                    # Process the response as needed
                    # return jsonify(response_data), 200
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



if __name__ == '__main__':
    app.run(port=2400)
