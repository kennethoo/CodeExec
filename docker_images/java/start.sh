#!/bin/sh

search_directory="./src"

javac -d /app/build "$search_directory"/*.java

java -cp /app/build Main
