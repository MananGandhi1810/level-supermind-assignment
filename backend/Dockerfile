FROM python:3.8-slim-buster

WORKDIR /python-docker

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY server.py server.py

EXPOSE 8081

CMD ["python3", "-m" , "flask", "--host=0.0.0.0", "--app server.py", "--port 8081", "run"]