const message = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unauthorized Access</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      background-color: #f5f5f5;
      padding: 50px;
    }

    h1 {
      font-size: 36px;
      color: #3d3d3d;
    }

    p {
      font-size: 18px;
      color: #7d7d7d;
    }

    img {
      max-width: 300px;
      display: block;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <h1>Oops! You're not logged in.</h1>
  <p>It looks like you're trying to access our super-secret API without logging in.<br>
     Don't worry, we won't tell anyone... but you should probably log in first! 😉</p>
</body>
</html>`;

export default message;
