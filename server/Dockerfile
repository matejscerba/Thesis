FROM python:3.12 as server

WORKDIR /server/app

COPY pyproject.toml .
COPY poetry.lock .
COPY ./app ./app
COPY ./data ./data

RUN pip install --upgrade pip poetry

RUN poetry config virtualenvs.create false

RUN poetry install

ENTRYPOINT ["python", "-m", "app.scripts.run_server"]
