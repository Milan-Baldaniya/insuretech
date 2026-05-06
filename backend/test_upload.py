import urllib.request
import urllib.error

body = (
    b'--boundary123\r\n'
    b'Content-Disposition: form-data; name="file"; filename="test.txt"\r\n'
    b'Content-Type: text/plain\r\n\r\n'
    b'hello world\r\n'
    b'--boundary123--\r\n'
)

req = urllib.request.Request(
    'http://localhost:8000/api/chat/parse-document',
    data=body,
    headers={'Content-Type': 'multipart/form-data; boundary=boundary123'}
)

try:
    with urllib.request.urlopen(req) as response:
        print("Success:", response.status)
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print("Error:", e.code)
    print(e.read().decode())
except urllib.error.URLError as e:
    print("URL Error:", e.reason)
