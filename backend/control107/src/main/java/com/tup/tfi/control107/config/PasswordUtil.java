package com.tup.tfi.control107.config;

import com.tup.tfi.control107.model.entity.Usuario;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Arrays;
import java.util.Base64;
import java.util.Random;

public class PasswordUtil {
    private static final Random RANDOM = new SecureRandom();
    private static final int ITERATIONS = 10000;
    private static final int KEY_LENGTH = 256;

    /**
     * static utility class
     */
    private PasswordUtil() { }

    /**
     * Returns a random salt to be used to hash a password.
     *
     * @return a 16 bytes random salt
     */
    public static String getNextSalt() {
        byte[] salt = new byte[16];
        RANDOM.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);

    }

    public static Usuario.Clave hash(char[] plainPassword, String userSalt) {
        String salt = null != userSalt ? userSalt : getNextSalt();
        PBEKeySpec spec = new PBEKeySpec(plainPassword, Base64.getDecoder().decode(salt), ITERATIONS, KEY_LENGTH);
        Arrays.fill(plainPassword, Character.MIN_VALUE);
        try {
            SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1");
            String hash = Base64.getEncoder().encodeToString(skf.generateSecret(spec).getEncoded());
            return new Usuario.Clave(hash, salt);
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new AssertionError("Error while hashing a password: " + e.getMessage(), e);
        } finally {
            spec.clearPassword();
        }
    }

    public static boolean verificarClave(char[] password, String salt, char[] expectedHash) {
        char[] pwdHash = hash(password, salt).getHash().toCharArray();
        Arrays.fill(password, Character.MIN_VALUE);
        if (pwdHash.length != expectedHash.length) return false;
        for (int i = 0; i < pwdHash.length; i++) {
            if (pwdHash[i] != expectedHash[i]) return false;
        }
        return true;
    }
    
}
