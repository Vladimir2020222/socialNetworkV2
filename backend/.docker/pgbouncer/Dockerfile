FROM ubuntu

SHELL ["/bin/bash", "-c"]

RUN apt-get update

RUN apt-get install -y pgbouncer
RUN apt-get install -y postgresql-client
RUN apt-get install -y postgresql-client

RUN apt-get install postgresql-client

COPY pgbouncer.ini /etc/pgbouncer/pgbouncer.ini

ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD

RUN echo \"${DB_USER}\" \"${DB_PASSWORD}\" > /etc/pgbouncer/userlist.txt

USER postgres

ENTRYPOINT /usr/sbin/pgbouncer /etc/pgbouncer/pgbouncer.ini
