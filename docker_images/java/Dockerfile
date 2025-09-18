FROM amazoncorretto
WORKDIR /app
COPY . ./
RUN chmod +x start.sh

RUN chmod -R 777 ./src

CMD ["./start.sh"]