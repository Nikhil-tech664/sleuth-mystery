import wave
import math
import struct
import subprocess
import os

def generate_cinematic_audio(output_wav="promo/teaser_audio.wav", duration=21.0, sample_rate=44100):
    total_samples = int(duration * sample_rate)
    samples = [0.0] * total_samples
    
    # 1. Atmospheric Low Drone (55Hz and 82.5Hz - D minor tension)
    for i in range(total_samples):
        t = i / sample_rate
        # Slow swell and fade out at end
        env = min(1.0, t / 2.0) * max(0.0, min(1.0, (duration - t) / 1.5))
        drone = (math.sin(2 * math.pi * 55 * t) * 0.4 + 
                 math.sin(2 * math.pi * 82.4 * t) * 0.25 + 
                 math.sin(2 * math.pi * 110 * t) * 0.15)
        samples[i] += drone * env * 0.35

    # 2. Clock Ticking every 0.75 seconds (133 ticks)
    tick_interval = int(0.75 * sample_rate)
    for start in range(0, total_samples - 2000, tick_interval):
        for j in range(1500):
            t_rel = j / sample_rate
            decay = math.exp(-j / 150)
            noise = (math.sin(2 * math.pi * 2400 * t_rel) + math.sin(2 * math.pi * 3600 * t_rel)) * 0.5
            if start + j < total_samples:
                samples[start + j] += noise * decay * 0.18

    # 3. Heartbeat Thumps (Deep double pulse every 1.5 seconds)
    pulse_interval = int(1.5 * sample_rate)
    for start in range(int(0.5 * sample_rate), total_samples - int(2 * sample_rate), pulse_interval):
        # Pulse 1 (lub)
        for j in range(int(0.18 * sample_rate)):
            t_rel = j / sample_rate
            env = math.sin(math.pi * j / (0.18 * sample_rate))
            thump = math.sin(2 * math.pi * 50 * t_rel) * env
            if start + j < total_samples:
                samples[start + j] += thump * 0.45
        # Pulse 2 (dub - slightly delayed)
        offset = int(0.22 * sample_rate)
        for j in range(int(0.16 * sample_rate)):
            t_rel = j / sample_rate
            env = math.sin(math.pi * j / (0.16 * sample_rate))
            thump = math.sin(2 * math.pi * 44 * t_rel) * env
            if start + offset + j < total_samples:
                samples[start + offset + j] += thump * 0.35

    # 4. Noir Minor Bell Chimes (Melancholic Victorian chimes at key intervals)
    chimes = [(1.5, 440.0), (5.0, 392.0), (9.0, 349.2), (13.0, 329.6), (16.8, 523.25), (17.5, 440.0)]
    for trigger_time, freq in chimes:
        idx = int(trigger_time * sample_rate)
        chime_len = int(3.0 * sample_rate)
        for j in range(chime_len):
            if idx + j >= total_samples:
                break
            t_rel = j / sample_rate
            decay = math.exp(-j / (sample_rate * 0.8))
            chime = (math.sin(2 * math.pi * freq * t_rel) * 0.6 + 
                     math.sin(2 * math.pi * freq * 2.0 * t_rel) * 0.25 + 
                     math.sin(2 * math.pi * freq * 3.0 * t_rel) * 0.1)
            samples[idx + j] += chime * decay * 0.28

    # 5. Climax Dramatic Boom at Second 16.5 (When final title card hits)
    boom_start = int(16.5 * sample_rate)
    boom_len = int(4.0 * sample_rate)
    for j in range(boom_len):
        if boom_start + j >= total_samples:
            break
        t_rel = j / sample_rate
        decay = math.exp(-j / (sample_rate * 1.0))
        # Deep frequency sweep from 120Hz down to 35Hz
        sweep_freq = 120 * math.exp(-j / (sample_rate * 0.3)) + 35
        boom = math.sin(2 * math.pi * sweep_freq * t_rel) * decay
        samples[boom_start + j] += boom * 0.65

    # Normalize audio to prevent clipping
    max_val = max(abs(s) for s in samples) or 1.0
    norm_factor = 0.88 / max_val
    scaled = [int(s * norm_factor * 32767) for s in samples]

    os.makedirs(os.path.dirname(output_wav) or ".", exist_ok=True)
    with wave.open(output_wav, 'wb') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(struct.pack(f'<{len(scaled)}h', *scaled))
    
    print(f"Generated audio: {output_wav} ({duration}s)")

if __name__ == "__main__":
    generate_cinematic_audio()
