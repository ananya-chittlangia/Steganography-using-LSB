import java.awt.image.BufferedImage;

public class LSB_decode {
    public static String decodeMessage(BufferedImage image) {
        StringBuilder b_msg = new StringBuilder();
        int len = 0;

        // Decode the length of the message from the first 8 pixels
        for (int i = 0; i < 8; i++) {
            int pixel = image.getRGB(i, 0);
            int blue = pixel & 0xFF;
            len |= (blue & 1) << (7 - i); // Get LSB of blue channel
        }

        // Decode the message from the image
        int currentBitEntry = 0;
        for (int x = 0; x < image.getWidth(); x++) {
            for (int y = 0; y < image.getHeight(); y++) {
                if (currentBitEntry < len * 8) {
                    int pixel = image.getRGB(x, y);
                    int blue = pixel & 0xFF;
                    b_msg.append(blue & 1); // Get LSB of blue channel
                    currentBitEntry++;
                }
            }
        }

        // Convert the binary string to characters
        StringBuilder msg = new StringBuilder();
        for (int i = 0; i < b_msg.length(); i += 8) {
            String byteString = b_msg.substring(i, Math.min(i + 8, b_msg.length()));
            char ch = (char) Integer.parseInt(byteString, 2);
            msg.append(ch);
        }

        return msg.toString();
    }
}
