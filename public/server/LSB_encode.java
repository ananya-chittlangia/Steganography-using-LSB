import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import javax.imageio.ImageIO;

public class LSB_encode {
    static final String STEGIMAGEFILE = "uploads/encoded/steg.png"; // Relative path

    public void encodeMessage(BufferedImage image, String message) {
        // Ensure the message fits within the image size
        if (message.length() * 8 > image.getWidth() * image.getHeight()) {
            throw new RuntimeException("Message is too long to encode in this image.");
        }

        // Encode the length of the message in the first 8 pixels' LSB
        for (int i = 0; i < 8; i++) {
            int pixel = image.getRGB(i, 0);
            int lengthBit = (message.length() >> (7 - i)) & 1;
            pixel = (pixel & 0xFFFFFFFE) | lengthBit; // Clear LSB and set it to the bit
            image.setRGB(i, 0, pixel);
        }

        // Encode message in LSB of the image
        int index = 0;
        for (int y = 0; y < image.getHeight(); y++) {
            for (int x = 0; x < image.getWidth(); x++) {
                if (index < message.length() * 8) {
                    int bit = (message.charAt(index / 8) >> (7 - (index % 8))) & 1;
                    int pixel = image.getRGB(x, y);
                    pixel = (pixel & 0xFFFFFFFE) | bit; // Clear LSB and set it to the bit
                    image.setRGB(x, y, pixel);
                    index++;
                }
            }
        }

        // Save the encoded image
        try {
            // Create directories if they do not exist
            File outputDir = new File("uploads/encoded");
            if (!outputDir.exists()) {
                outputDir.mkdirs(); // Create the directory structure
            }

            ImageIO.write(image, "png", new File(STEGIMAGEFILE));
            System.out.println("Encoded image saved at: " + STEGIMAGEFILE);
        } catch (IOException e) {
            throw new RuntimeException("Error saving encoded image: " + e.getMessage());
        }
    }
}
