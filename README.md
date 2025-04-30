# STLC Manager

# Download and Installation Guide

This document explains the necessary steps to download and run the STLC Manager project on your local machine.

## Prerequisites

Before starting the installation, make sure the following software is installed on your system:

- **Git:** Required to clone the project. [https://git-scm.com/](https://git-scm.com/)
- **Node.js and npm:** Required to run the frontend (React) application. [https://nodejs.org/](https://nodejs.org/)
- **Python and pip:** Required to run the backend (FastAPI) application. [https://www.python.org/](https://www.python.org/)

## 1. Download the Project (Cloning)

Open a terminal or command prompt and run the following command to clone the project from GitHub (or its hosting location):

```bash
git clone <project_repository_url> STLC-Manager
cd STLC-Manager
```

## 2. Backend Setup
To set up and run the backend application (FastAPI), follow these steps:

Navigate to the backend directory:

```bash
cd backend
```
Install the required Python packages:

```bash
pip install -r requirements.txt
```
This command will install all dependencies listed in the requirements.txt file.

Start the backend application:

```bash
python app.py
```

## 3. Frontend Setup
To set up and run the frontend application (React), follow these steps:

Return to the project root directory (if you're in the backend folder):

```bash
cd ..
```
Navigate to the frontend directory:

```bash
cd frontend
```
Install the required Node.js packages:

```bash
npm install
```
This command will install all dependencies listed in the package.json file.

Start the frontend development server:

```bash
npm run dev
```
By default, the application will start running at http://localhost:5173 (or another port depending on the Vite/CRA configuration). You should see the corresponding address in the terminal.

## 4. Environment Variables
To ensure proper functionality of the project, you may need to set up some environment variables.
You can define these variables by creating .env files in the project root (or separately in the backend and frontend directories).

## 5. Running the Application
Once both backend and frontend servers have started successfully:

Open your web browser.

Go to the address where the frontend application is running (e.g., http://localhost:5173).

You should see the STLC Manager interface. You can now start using the application.

## Adımlar
Bu proje, **Software Testing Life Cycle (STLC)** adımlarını yönetmek ve otomasyonunu sağlamak amacıyla oluşturulmuş bir Full Stack örneğidir.  
**STLC** aşağıdaki 12 adımı içerir (ancak dilediğiniz gibi özelleştirilebilir):

1. Code Review  
2. Requirement Analysis  
3. Test Planning  
4. Test Scenario Generation  
5. Test Scenario Optimization  
6. Test Case Generation  
7. Test Case Optimization  
8. Test Code Generation  
9. Environment Setup  
10. Test Execution  
11. Test Reporting  
12. Test Closure  

Bu adımların her biri tek başına (tek adım) veya bir **pipeline** (çoklu adım) olarak çalıştırılabilir.

## Proje Dizini

```
STLC-Manager/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Pipeline.jsx
│   │   │   ├── ProcessPanel.jsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── openai.js
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   └── ...
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── ...
└── backend/
    ├── app.py
    ├── config.py
    ├── requirements.txt
    ├── core/
    │   ├── __init__.py
    │   ├── database.py
    │   ├── file_handler.py
    │   ├── model_client.py
    │   └── prompt_manager.py
    ├── pipeline/
    │   ├── __init__.py
    │   ├── pipeline_controller.py
    │   └── pipeline_executor.py
    ├── stlc/
    │   ├── __init__.py
    │   ├── code_review.py
    │   ├── requirement_analysis.py
    │   ├── test_planning.py
    │   ├── test_scenario_generation.py
    │   ├── test_scenario_optimization.py
    │   ├── test_case_generation.py
    │   ├── test_case_optimization.py
    │   ├── test_code_generation.py
    │   ├── environment_setup.py
    │   ├── test_execution.py
    │   ├── test_reporting.py
    │   └── test_closure.py
    └── utils/
        ├── __init__.py
        ├── text_splitter.py
        └── validation.py
```

### Frontend (React)
- **src/components/**: Bileşenler (ör. `FileUpload`, `Pipeline`, `OutputPanel`)  
- **src/services/**: API çağrılarını yöneten servis fonksiyonları (`openai.js` vs.)  
- **.env** (isteğe bağlı): Backend API URL gibi konfigürasyonları barındırır.  
- **main.jsx / App.jsx**: Uygulamanın ana giriş noktası ve yönlendirme.

### Backend (FastAPI)
- **app.py**: FastAPI uygulamasının ana dosyası.  
- **config.py**: Ortak yapılandırma ve environment değişkenleri (Mongo URI, model URL vb.).  
- **requirements.txt**: Backend bağımlılıkları.

#### **core/**
- **database.py**: MongoDB bağlantısı ve temel veritabanı işlemleri.  
- **file_handler.py**: Dosya yükleme, PDF/DOCX/TXT metin çıkarma fonksiyonları.  
- **model_client.py**: LLM (Large Language Model) çağrısını yönetir.  
- **prompt_manager.py**: MongoDB’den system prompt, query_str gibi verileri çekmek.

#### **pipeline/**
- **pipeline_controller.py**: UI’den gelen STLC adım seçimlerini işleyerek hangi adımların sırayla çalıştırılacağını belirler.  
- **pipeline_executor.py**: Seçilen adımları sırasıyla çalıştırır ve sonuçlarını birleştirir.

#### **stlc/**
- Her adım için (`code_review`, `requirement_analysis`, `test_planning` vb.) ayrı bir dosya.  
- `run_step(input_data)` fonksiyonuyla her adım tek başına veya pipeline içinde çağrılabilir.

#### **utils/**
- **text_splitter.py**: Metin parçalama (chunking) işlemleri.  
- **validation.py**: LLM çıktılarının (structured_output) istenen formata uygunluğunu doğrulama.

## Akış Diyagramı (Mermaid)

Aşağıda, bir pipeline çalıştırma senaryosunun genel akışını gösteren basit bir **Mermaid** diyagramı bulunuyor:

```mermaid
flowchart LR
    A[UI / Frontend] --> B[Pipeline Controller]
    B --> C[Pipeline Executor]
    C --> D[STLC Adım 1 (Ör: Test Planning)]
    C --> E[STLC Adım 2 (Ör: Test Case Generation)]
    C --> F[STLC Adım 3 (Ör: Test Reporting)]
    D --> C
    E --> C
    F --> G[Nihai Sonuç Dönüşü]
```

1. **UI / Frontend**: Kullanıcı, hangi STLC adımlarının seçileceğini belirler (checkbox vb.).  
2. **Pipeline Controller**: Seçilen adımları analiz eder, sırayı belirler.  
3. **Pipeline Executor**: Sırayla her STLC modülünün `run_step` fonksiyonunu çağırır.  
4. **STLC Adımları**: Her adım, ilgili verileri işleyerek kendi çıktısını üretir. Gerekirse bir sonraki adıma veri aktarılır.  
5. **Nihai Sonuç**: Tüm adımlar tamamlandığında, sonuç birleşik olarak UI’a döndürülür.

## Nasıl Çalıştırılır?

1. **Backend Kurulumu:**
   ```bash
   cd STLC-Manager/backend
   pip install -r requirements.txt
   python app.py
   ```
   - Uygulama varsayılan olarak `http://0.0.0.0:8000` üzerinde çalışacaktır.

2. **Frontend Kurulumu:**
   ```bash
   cd STLC-Manager/frontend
   npm install
   npm run dev
   ```
   - Varsayılan olarak `http://localhost:5173` vb. bir portta çalışır (Vite/CRA ayarlarına göre değişebilir).

3. **Env Değişkenleri (Örnek .env Dosyası):**
   ```
   # Backend
   MONGO_URI=mongodb://localhost:27017
   MODEL_API_BASE_URL=http://localhost:1234
   MODEL_IDENTIFIER=llama-3.2-3b-instruct

   # Frontend
   REACT_APP_API_BASE_URL=http://localhost:8000
   ```
   - İhtiyaçlarınıza göre özelleştirin.

4. **Kullanım Senaryoları:**
   - **Tek Adım**: Örneğin, `Test Planning` adımını tek başına çalıştırmak için UI’daki ilgili sayfadan dosya yükleyip “Çalıştır” butonuna basabilirsiniz.  
   - **Pipeline**: Checkbox’larla birden fazla adım (örn. `Test Planning`, `Test Case Generation`, `Test Reporting`) seçilip “Pipeline Çalıştır” denildiğinde, adımlar sırasıyla çalıştırılır ve toplu sonuç ekranda gösterilir.
