# Eatlicious

냉장고 식재료를 기록하고, 먼저 사용할 재료와 만들 수 있는 레시피를 보여주는 Flask 웹 앱입니다.

## Windows에서 실행하기

```powershell
cd D:\ogs\project\Eatlicious
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\flask.exe --app app run --debug
```

브라우저에서 <http://127.0.0.1:5000>을 여세요. 서버를 종료하려면 PowerShell에서 `Ctrl+C`를 누릅니다.

## 사진 식재료 인식 설정

사진에서 재료를 찾으려면 OpenAI API 키가 필요합니다. API 키는 ChatGPT 구독과 별도이며 사용량에 따라 API 요금이 발생할 수 있습니다. API 키를 앱 코드나 Git 저장소에 올리지 마세요.

PowerShell에서 Flask를 실행하기 전에 API 키를 현재 터미널에 등록하세요. 아래 자리표시자 부분을 본인의 키로 바꿉니다.

```powershell
$env:OPENAI_API_KEY = "여기에_본인_API_키"
.\.venv\Scripts\flask.exe --app app run --debug
```

키를 설정하지 않아도 웹 앱은 실행되지만, 사진 인식 버튼은 사용할 수 없습니다. 업로드한 사진은 인식 요청 시 OpenAI로 전송되며, 앱의 SQLite 데이터베이스에는 저장하지 않습니다.

## 프로젝트 구성

- `app.py`: Flask 라우트와 SQLite 저장 기능
- `static/index.html`: 화면 구조
- `static/styles.css`: 반응형 디자인
- `static/app.js`: 화면 동작, 사진 인식 결과 확인, 식재료 등록 및 레시피 추천
- `fridge.db`: 실행 시 생성되는 로컬 식재료 데이터베이스 (Git에 포함되지 않음)

소비 상태는 사용자가 입력한 날짜를 기준으로 안내합니다. 사진 인식 결과는 등록 전에 확인하고 수정할 수 있습니다.
