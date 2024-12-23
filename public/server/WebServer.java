import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import java.awt.image.BufferedImage;
import java.io.*;
import javax.imageio.ImageIO;

public class WebServer {
    private static final int PORT = 8000;

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new java.net.InetSocketAddress(PORT), 0);
        server.createContext("/encode", new EncodeHandler());
        server.createContext("/decode", new DecodeHandler());
        server.createContext("/save", new SaveHandler());
        server.setExecutor(null); // creates a default executor
        server.start();
        System.out.println("Server started on port " + PORT);
    }

    static class EncodeHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("POST".equals(exchange.getRequestMethod())) {
                try (InputStream inputStream = exchange.getRequestBody();
                     BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
                     OutputStream os = exchange.getResponseBody()) {

                    BufferedImage image = ImageIO.read(inputStream);
                    String message = reader.readLine();

                    LSB_encode encoder = new LSB_encode();
                    encoder.encodeMessage(image, message);

                    String response = "Message encoded successfully.";
                    exchange.sendResponseHeaders(200, response.length());
                    os.write(response.getBytes());
                }
            }
        }
    }

    static class DecodeHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("POST".equals(exchange.getRequestMethod())) {
                try (InputStream inputStream = exchange.getRequestBody();
                     OutputStream os = exchange.getResponseBody()) {

                    BufferedImage image = ImageIO.read(inputStream);
                    String message = LSB_decode.decodeMessage(image);

                    String response = "Decoded message: " + message;
                    exchange.sendResponseHeaders(200, response.length());
                    os.write(response.getBytes());
                }
            }
        }
    }

    static class SaveHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            try (OutputStream os = exchange.getResponseBody()) {
                // Implement the logic to save the encoded image.
                String response = "Image saved successfully.";
                exchange.sendResponseHeaders(200, response.length());
                os.write(response.getBytes());
            }
        }
    }
}