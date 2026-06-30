FROM python:3.12-slim

WORKDIR /app

# scripts/seed.py imports from app.* — /app must be on the Python path
ENV PYTHONPATH=/app

RUN pip install uv

COPY pyproject.toml .
RUN uv sync --no-dev

COPY . .

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
