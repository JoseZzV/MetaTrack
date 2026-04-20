# MetaTrack - Guía de Inicio Rápido

Este documento detalla los pasos necesarios para ejecutar el entorno de desarrollo de MetaTrack.

---

## 📋 Requisitos Previos
* Tener instalado **Node.js** y **Python 3.10+**.
* Archivos `.env` configurados en cada servicio.
* Entornos virtuales (`venv`) listos.

---

## 🚀 Pasos para Iniciar

### 1. Frontend
```bash
cd frontend
npm run dev

2. Servicios de Backend
Ejecutar cada uno en una terminal diferente con el venv activo:

Identity Service (Puerto 8000):
uvicorn app.main:app --reload --port 8000

Challenge Service (Puerto 8001):
uvicorn app.main:app --reload --port 8001

Participation Service (Puerto 8002):
uvicorn app.main:app --reload --port 8002

Progress Service (Puerto 8003):
uvicorn app.main:app --reload --port 8003

Servicio,Puerto
Frontend,5173
Identity,8000
Challenge,8001
Participation,8002
Progress,8003