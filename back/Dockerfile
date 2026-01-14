FROM python:3.11-slim

RUN useradd -m yahtzeeuser
USER yahtzeeuser
WORKDIR /home/yahtzeeuser/app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PATH="/home/yahtzeeuser/.local/bin: ${PATH}"

COPY --chown=yahtzeeuser:yahtzeeuser requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

COPY --chown=yahtzeeuser:yahtzeeuser . .

EXPOSE 5000

CMD ["python", "api.py"]