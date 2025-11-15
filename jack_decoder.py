import numpy as np
import wave
import zlib
from scipy.fft import rfft, rfftfreq

SAMPLE_RATE = 44100
BIT_DURATION = 0.05
FREQ_ZERO = 19000
FREQ_ONE = 19500


def decode_wav(filename):
    print("[*] Decoding file:", filename)

    with wave.open(filename, "rb") as wav:
        frames = wav.readframes(-1)
        audio = np.frombuffer(frames, dtype=np.int16)
        audio = audio.astype(float)

    samples_per_bit = int(SAMPLE_RATE * BIT_DURATION)
    total_bits = len(audio) // samples_per_bit

    bits = ""

    for i in range(total_bits):
        segment = audio[i*samples_per_bit : (i+1)*samples_per_bit]
        
        # FFT to detect dominant frequency
        yf = np.abs(rfft(segment))
        xf = rfftfreq(len(segment), 1 / SAMPLE_RATE)

        dominant_freq = xf[np.argmax(yf)]

        if abs(dominant_freq - FREQ_ZERO) < abs(dominant_freq - FREQ_ONE):
            bits += "0"
        else:
            bits += "1"

    print("[*] Total bits decoded:", len(bits))
    return bits


def bits_to_text(bits):
    chars = []
    for i in range(0, len(bits), 8):
        byte = bits[i:i+8]
        if len(byte) == 8:
            chars.append(chr(int(byte, 2)))
    return ''.join(chars)


def decode_message(filename="jack_demo.wav"):
    bits = decode_wav(filename)

    # Extract components:
    crc_bits = bits[:32]
    length_bits = bits[32:48]
    length = int(length_bits, 2)

    message_bits = bits[48:48 + (length * 8)]

    message = bits_to_text(message_bits)

    print("[*] Extracted message:", message)

    # Verify CRC
    crc_received = int(crc_bits, 2)
    crc_computed = zlib.crc32(message.encode())

    print("[*] Received CRC:", hex(crc_received))
    print("[*] Computed CRC:", hex(crc_computed))

    if crc_received == crc_computed:
        print("[+] CRC MATCHES — Valid Covert Message")
    else:
        print("[-] CRC MISMATCH — Possible tampering")

    return message


if __name__ == "__main__":
    decode_message()
