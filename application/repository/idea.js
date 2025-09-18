const idea = [
  {
    title: "Create a Calculator Class",
    description:
      "Design a `Calculator` class that can perform basic operations like add, subtract, multiply, and divide. The class should also handle invalid operations gracefully.",
    language: ["JavaScript", "Python", "Java", "Go", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Movie Rental System",
    description:
      "Create a `Movie` class with attributes like title, genre, and rating. Then design a `RentalSystem` class that allows renting and returning movies, as well as keeping track of available inventory.",
    language: ["JavaScript", "Python", "Java", "Go", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Digital Clock Display",
    description:
      "Design a `Clock` class that displays the current time and updates every second. It should have methods to start and stop the clock, and allow time format (12/24 hour) changes.",
    language: ["JavaScript", "Python", "Java", "Go", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Book Library System",
    description:
      "Build a `Book` class with title, author, and ISBN properties, and a `Library` class that can add, remove, and search for books. Also implement a method to list all books in alphabetical order.",
    language: ["JavaScript", "Python", "Java", "Go", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Simple To-Do List App",
    description:
      "Create a `TodoList` class that manages tasks. Each task should have a description, due date, and status (completed or pending). Implement methods to add, remove, and mark tasks as completed.",
    language: ["JavaScript", "Python", "Java", "Go", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Virtual Pet Simulator",
    description:
      "Develop a `Pet` class with attributes like hunger, happiness, and energy. Add methods to feed, play, and rest the pet, and adjust its attributes accordingly.",
    language: ["JavaScript", "Python", "Java", "Go", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Student Grade Manager",
    description:
      "Create a `Student` class that has attributes for name and grades. Then implement a `GradeManager` class to calculate the average grade and keep track of multiple students.",
    language: ["JavaScript", "Python", "Java", "Go", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Deck of Cards",
    description:
      "Build a `Card` class representing a playing card and a `Deck` class that can shuffle, deal, and reset the deck. Make sure the deck only has unique cards.",
    language: ["JavaScript", "Python", "Java", "Go", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Weather Forecasting System",
    description:
      "Create a `Weather` class with attributes like temperature, humidity, and forecast. Add methods to update the weather and display current conditions.",
    language: ["JavaScript", "Python", "Java", "Go", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Bank Account Simulator",
    description:
      "Design a `BankAccount` class with attributes like balance and account number. Add methods to deposit, withdraw, and transfer money between accounts, while checking for insufficient funds.",
    language: ["JavaScript", "Python", "Java", "Go", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Online Shopping Cart",
    description:
      "Create a `Product` class with properties like name, price, and quantity. Design a `ShoppingCart` class to add, remove, and view products, along with calculating the total price.",
    language: ["JavaScript", "Python", "Java", "Go", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "ATM Simulator",
    description:
      "Develop an `ATM` class that simulates withdrawing and depositing cash. Ensure it checks for balance and updates it accordingly.",
    language: ["JavaScript", "Python", "Java", "Go", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Inventory Management System",
    description:
      "Design a `Product` class and an `Inventory` class that can add, remove, and update product quantities. Allow querying to get details of a specific product.",
    language: ["JavaScript", "Python", "Java", "Go", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Simple Chat Simulator",
    description:
      "Build a `User` class with a method to send messages and a `Chat` class to keep track of conversations. Allow users to join and leave the chat.",
    language: ["JavaScript", "Python", "Java", "Go", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Simple Tic-Tac-Toe Game",
    description:
      "Create a `TicTacToe` class that allows two players to take turns and plays a game of Tic-Tac-Toe. Detect when a player wins or the game ends in a draw.",
    language: ["JavaScript", "Python", "Java", "Go", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Password Strength Checker",
    description:
      "Design a `PasswordChecker` class that takes a password and evaluates its strength based on length, use of special characters, uppercase letters, etc.",
    language: ["JavaScript", "Python", "Java", "Go", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Online Survey System",
    description:
      "Build a `Question` class with text and answer options. Then, design a `Survey` class that can add questions, display them, and collect user answers.",
    language: ["JavaScript", "Python", "Java", "Go", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Expense Tracker",
    description:
      "Create an `Expense` class and an `ExpenseTracker` class that can add, remove, and categorize expenses. Implement a method to calculate total expenses.",
    language: ["JavaScript", "Python", "Java", "Go", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Quiz Game",
    description:
      "Build a `Question` class and a `QuizGame` class that displays questions, accepts answers, and keeps track of the player's score.",
    language: ["JavaScript", "Python", "Java", "Go", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Message Encoder and Decoder",
    description:
      "Create an `Encoder` class that encodes a message using a simple cipher and a `Decoder` class that decodes it back to the original message.",
    language: ["JavaScript", "Python", "Java", "Go", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "FizzBuzz",
    description:
      "Print numbers from 1 to 100. For multiples of 3, print 'Fizz'; for multiples of 5, print 'Buzz'; for multiples of both, print 'FizzBuzz'.",
    language: ["JavaScript", "Python", "Java", "Go", "C", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Palindrome Checker",
    description:
      "Write a function that checks if a given string is a palindrome.",
    language: ["JavaScript", "Python", "Java", "Go", "C", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Factorial Finder",
    description: "Calculate the factorial of a number.",
    language: ["JavaScript", "Python", "Java", "Go", "C", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Prime Number Checker",
    description: "Check if a given number is prime.",
    language: ["JavaScript", "Python", "Java", "Go", "C", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Reverse a String",
    description: "Write a function to reverse a given string.",
    language: ["JavaScript", "Python", "Java", "Go", "C", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Sum of Digits",
    description: "Find the sum of digits of a given integer.",
    language: ["JavaScript", "Python", "Java", "Go", "C", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Find Maximum in Array",
    description: "Write a function that finds the maximum number in an array.",
    language: ["JavaScript", "Python", "Java", "Go", "C", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Count Vowels",
    description: "Count the number of vowels in a given string.",
    language: ["JavaScript", "Python", "Java", "Go", "C", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Binary to Decimal Converter",
    description: "Convert a binary number (string) to a decimal integer.",
    language: ["JavaScript", "Python", "Java", "Go", "C", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Find Unique Elements",
    description: "Find unique elements in an array of numbers.",
    language: ["JavaScript", "Python", "Java", "Go", "C", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Fibonacci Sequence Generator",
    description: "Generate the first N terms of the Fibonacci sequence.",
    language: ["JavaScript", "Python", "Java", "Go", "C", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Sum of Array",
    description: "Calculate the sum of all elements in an array.",
    language: ["JavaScript", "Python", "Java", "Go", "C", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Average of Array",
    description: "Calculate the average of an array of numbers.",
    language: ["JavaScript", "Python", "Java", "Go", "C", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Count Words in a String",
    description: "Count the number of words in a given string.",
    language: ["JavaScript", "Python", "Java", "Go", "C", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Check Armstrong Number",
    description: "Check if a number is an Armstrong number.",
    language: ["JavaScript", "Python", "Java", "Go", "C", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Find Second Largest Number",
    description: "Find the second largest number in an array.",
    language: ["JavaScript", "Python", "Java", "Go", "C", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Sum of Even Numbers",
    description: "Calculate the sum of all even numbers in an array.",
    language: ["JavaScript", "Python", "Java", "Go", "C", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Find Missing Number",
    description:
      "Given a list of numbers, find the missing number in the range.",
    language: ["JavaScript", "Python", "Java", "Go", "C", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Sort an Array",
    description:
      "Write a function that sorts an array of numbers in ascending order.",
    language: ["JavaScript", "Python", "Java", "Go", "C", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
  {
    title: "Find Duplicates in Array",
    description: "Identify duplicate elements in an array of numbers.",
    language: ["JavaScript", "Python", "Java", "Go", "C", "C++"],
    difficulty: "Easy",
    cloneCount: 0,
  },
];
export default idea;
