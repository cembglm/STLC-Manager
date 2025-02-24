""" 
app.py
------
FastAPI uygulamasının ana giriş noktası. Burada FastAPI instance’ı tanımlanır, 
STLC adımlarına ait router’lar eklenir ve uygulama başlatılır.
"""

import uvicorn
from fastapi import FastAPI

# STLC modüllerine ait router’lar ileride buraya import edilecek
# from stlc import code_review, requirement_analysis, ...

app = FastAPI(
    title="STLC Manager Backend",
    description="STLC adımlarını yönetmek için oluşturulmuş FastAPI uygulaması.",
    version="0.1.0"
)

@app.get("/")
def read_root():
    return {"message": "STLC Manager Backend is running!"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
