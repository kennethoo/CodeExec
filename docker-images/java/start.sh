#!/bin/sh
javac Main.java
search_directory="."
class_files=$(find "$search_directory" -type f -name "*.class")
for file_path in $class_files; do
    class_name=$(basename "$file_path" .class)
    java "$class_name"
done
