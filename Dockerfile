FROM ubuntu:16.04

#
# Установка postgresql
#
RUN apt-get -y update
RUN apt-get -y install wget
RUN echo 'deb http://apt.postgresql.org/pub/repos/apt/ xenial-pgdg main' >> /etc/apt/sources.list.d/pgdg.list
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN apt-get -y update
ENV PGVER 10
RUN apt-get install -y postgresql-$PGVER  gnupg2
RUN wget -qO- https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs

ENV WORK /tp
WORKDIR $WORK

COPY init.sql init.sql

# Run the rest of the commands as the ``postgres`` user created by the ``postgres-$PGVER`` package when it was ``apt-get installed``

USER postgres

# Create a PostgreSQL role named ``docker`` with ``docker`` as the password and
# then create a database `docker` owned by the ``docker`` role.
RUN /etc/init.d/postgresql start &&\
    psql --command "CREATE USER dlipko WITH SUPERUSER PASSWORD '1';" &&\
    psql -d postgres -c "CREATE EXTENSION IF NOT EXISTS citext" &&\
    psql < $WORK/init.sql &&\
    /etc/init.d/postgresql stop

# Adjust PostgreSQL configuration so that remote connections to the
# database are possible.
RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/$PGVER/main/pg_hba.conf

# And add ``listen_addresses`` to ``/etc/postgresql/$PGVER/main/postgresql.conf``
RUN echo "listen_addresses='*'" >> /etc/postgresql/$PGVER/main/postgresql.conf

# Expose the PostgreSQL port
EXPOSE 5432

# Add VOLUMEs to allow backup of config, logs and databases
# VOLUME  ["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql"]

# Back to the root user
USER root

ADD . $WORK/
RUN npm install

#
# Запускаем PostgreSQL и сервер
#
# RUN service postgresql start

# Объявлем порт сервера
EXPOSE 5000

CMD service postgresql start && PORT=5000 node index.js