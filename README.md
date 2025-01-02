# Steganography Using LSB

This project is a web-based application that employs the Least Significant Bit (LSB) technique for steganography, enabling users to encode and decode hidden messages within images. It features user authentication with login and logout functionalities managed through a MySQL database using PHP. Notably, the application does not store any image information on the server, ensuring user privacy.

---

## Features

- **Encode Messages**: Hide secret messages within images using the LSB steganography technique.
- **Decode Messages**: Extract hidden messages from steganographic images.
- **User Authentication**: Secure login and logout system managed with PHP and MySQL.
- **Privacy Assurance**: No storage of image data on the server; all processing occurs in real-time.

---

## How to Set Up and Run

Follow these steps to set up and use the application:

1. **Clone the Repository**

   - Clone the repository using:
     ```bash
     git clone https://github.com/ananya-chittlangia/Steganography-using-LSB.git
     ```

2. **Set Up the Server Environment**

   - Ensure you have a web server with PHP and MySQL support (e.g., XAMPP, WAMP, LAMP).
   - Place the cloned repository in the server's root directory (e.g., `htdocs` for XAMPP).

3. **Configure the Database**

   - Create a MySQL database named `steganography`.
   - Import the `steganography.sql` file located in the repository to set up the necessary tables.
   - Update the database connection details in `config.php` to match your MySQL credentials:
     ```php
     <?php
     $servername = "localhost";
     $username = "your_username";
     $password = "your_password";
     $dbname = "steganography";
     ?>
     ```

4. **Start the Server**

   - Launch your web server (e.g., start Apache and MySQL in XAMPP).

5. **Access the Application**

   - Open your web browser and navigate to `http://localhost/Steganography-using-LSB/` to access the interface.

6. **Register and Use**

   - Register a new account or log in with existing credentials.
   - Use the 'Encode' feature to hide messages within images and the 'Decode' feature to extract hidden messages.

---

## Notes

- Ensure that the images used for encoding are in supported formats (e.g., PNG, JPEG).
- The application processes images in real-time without storing them on the server, maintaining user privacy.
- For UI customization, modify the HTML, CSS, and JavaScript files located in the `public` directory.

---

## Technologies Used

- **Backend**: PHP, MySQL
- **Frontend**: HTML, CSS, JavaScript
- **Steganography Technique**: Least Significant Bit (LSB) method

---

For more information and to access the source code, visit the [GitHub repository](https://github.com/ananya-chittlangia/Steganography-using-LSB).
