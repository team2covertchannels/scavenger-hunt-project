import numpy as np
import wave
import zlib

# PARAMETERS
SAMPLE_RATE = 44100
BIT_DURATION = 0.05  # seconds
FREQ_ZERO = 19000    # Hz
FREQ_ONE = 19500     # Hz


def text_to_bits(text):
    return ''.join(format(ord(c), '08b') for c in text)


def generate_tone(freq, duration):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    tone = np.sin(2 * np.pi * freq * t)
    return tone


def encode_message(message, output_file="jack_demo.wav"):
    print("[*] Encoding message:", message)

    # STEP 1: CRC32 for tipoff
    crc = zlib.crc32(message.encode())
    crc_bits = format(crc, '032b')

    print(f"[*] CRC32: {hex(crc)}")
    print("[*] CRC bits:", crc_bits)

    # STEP 2: Convert message to bits
    message_bits = text_to_bits(message)

    # STEP 3: Add a 16-bit header for message length
    length_bits = format(len(message), '016b')

    total_bits = crc_bits + length_bits + message_bits

    print("[*] Total bits to encode:", len(total_bits))

    # STEP 4: Encode bits into tones
    audio = np.array([])

    for b in total_bits:
        if b == "0":
            tone = generate_tone(FREQ_ZERO, BIT_DURATION)
        else:
            tone = generate_tone(FREQ_ONE, BIT_DURATION)
        audio = np.concatenate((audio, tone))

    # STEP 5: Normalize & save WAV
    audio *= 32767 / np.max(np.abs(audio))
    audio = audio.astype(np.int16)

    with wave.open(output_file, "w") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        wav.writeframes(audio.tobytes())

    print("[+] File written:", output_file)


if __name__ == "__main__":
    encode_message("dogs")  # YOUR CHUNK OF THE MESSAGE
