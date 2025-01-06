FROM python:3.12-slim-bookworm AS builder
WORKDIR /app
COPY requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

FROM python:3.12-slim-bookworm
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.12/site-packages/ /usr/local/lib/python3.12/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/
COPY . .
ENV PIP_ROOT_USER_ACTION=ignore
ENV TF_CPP_MIN_LOG_LEVEL=1
ENV PYTHONUNBUFFERED=1
ENV DONTWRITEBYTECODE=1
EXPOSE 8081
CMD ["python3", "server.py"]