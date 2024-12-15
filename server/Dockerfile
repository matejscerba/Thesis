FROM python:3.12 AS build

WORKDIR /server/app

COPY pyproject.toml .
COPY poetry.lock .
COPY README.md .
COPY ./app ./app
COPY ./data ./data

RUN pip install --upgrade pip poetry
RUN poetry config virtualenvs.create false
RUN poetry install --without dev

ENTRYPOINT ["python", "-m", "app.scripts.run_server"]
