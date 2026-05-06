import requests

try:
    with open('test.txt', 'w') as f:
        f.write("hello world")

    with open('test.txt', 'rb') as f:
        files = {'file': ('test.txt', f, 'text/plain')}
        res = requests.post('http://localhost:8000/api/chat/parse-document', files=files)
        print("Status Code:", res.status_code)
        print("Response:", res.text)
except Exception as e:
    print("Error:", str(e))
