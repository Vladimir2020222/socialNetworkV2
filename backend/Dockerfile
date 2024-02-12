FROM python:3.12.1

SHELL ["/bin/bash", "-c"]

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY . /code

WORKDIR /code

RUN pip install -r requirements.txt

ENTRYPOINT [""]
CMD ["gunicorn", "--bind", "0.0.0.0:8000"]
