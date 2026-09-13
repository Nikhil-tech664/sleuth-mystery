import subprocess
import os

def build_trailer():
    temp_dir = "promo/temp_clips"
    os.makedirs(temp_dir, exist_ok=True)
    
    scenes = [
        {
            "img": "promo/cover_art.jpg",
            "dur": 4.5,
            "text1": "A GRUESOME MURDER HAS OCCURRED IN VICTORIAN LONDON...",
            "sub": "Incident Report #42 — The Velvet Manor Mystery",
            "zoom": "min(zoom+0.0008,1.15)",
            "out": f"{temp_dir}/scene1.mp4"
        },
        {
            "img": "promo/screenshot_interrogation.jpg",
            "dur": 4.0,
            "text1": "CROSS-EXAMINE ECCENTRIC SUSPECTS",
            "sub": "Real-Time Physiological Polygraph Lie Detector",
            "zoom": "min(zoom+0.001,1.18)",
            "out": f"{temp_dir}/scene2.mp4"
        },
        {
            "img": "promo/screenshot_forensics.jpg",
            "dur": 4.0,
            "text1": "SCOTLAND YARD CRIME LABORATORY",
            "sub": "Match Latent Ridge Patterns & Test Chemical Toxins",
            "zoom": "min(zoom+0.0009,1.15)",
            "out": f"{temp_dir}/scene3.mp4"
        },
        {
            "img": "promo/screenshot_logic_grid.jpg",
            "dur": 4.0,
            "text1": "DEDUCE THE CULPRIT WITH PURE LOGIC",
            "sub": "Interactive Elimination Matrix • Zero Intrusive Ads",
            "zoom": "min(zoom+0.0008,1.14)",
            "out": f"{temp_dir}/scene4.mp4"
        },
        {
            "img": "promo/cover_art.jpg",
            "dur": 4.5,
            "text1": "CAN YOU CRACK THE CASE?",
            "sub": "PLAY FREE NOW — sleuth-mystery.vercel.app",
            "zoom": "1.06-0.0007*on",
            "out": f"{temp_dir}/scene5.mp4"
        }
    ]

    for idx, sc in enumerate(scenes):
        print(f"Rendering scene {idx+1}/{len(scenes)}...")
        frames = int(sc["dur"] * 30)
        
        # Save text files to avoid escaping bugs
        t1_file = f"{temp_dir}/t1_{idx}.txt"
        sub_file = f"{temp_dir}/sub_{idx}.txt"
        with open(t1_file, "w", encoding="utf-8") as f:
            f.write(sc["text1"])
        with open(sub_file, "w", encoding="utf-8") as f:
            f.write(sc["sub"])
            
        t1_path = os.path.abspath(t1_file).replace("\\", "/").replace(":", "\\:")
        sub_path = os.path.abspath(sub_file).replace("\\", "/").replace(":", "\\:")
        font_serif = "C\\:/Windows/Fonts/georgia.ttf"
        font_bold = "C\\:/Windows/Fonts/arialbd.ttf"
        
        vf = (
            f"scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
            f"zoompan=z='{sc['zoom']}':d={frames}:s=1920x1080:fps=30,"
            f"drawbox=y=ih-160:color=black@0.75:width=iw:height=160:t=fill,"
            f"drawbox=y=ih-162:color=0xC69214@0.9:width=iw:height=3:t=fill,"
            f"drawtext=fontfile='{font_serif}':textfile='{t1_path}':fontcolor=0xFAF6F0:fontsize=40:"
            f"x=(w-text_w)/2:y=h-130:shadowcolor=black@0.9:shadowx=2:shadowy=2,"
            f"drawtext=fontfile='{font_bold}':textfile='{sub_path}':fontcolor=0xE5B54F:fontsize=24:"
            f"x=(w-text_w)/2:y=h-70:shadowcolor=black@0.9:shadowx=1:shadowy=1"
        )
        
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", sc["img"],
            "-t", str(sc["dur"]),
            "-vf", vf,
            "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", "30",
            sc["out"]
        ]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            print(f"Error in scene {idx+1}:", res.stderr)
            return

    # Create concat list
    concat_txt = f"{temp_dir}/concat.txt"
    with open(concat_txt, "w") as f:
        for sc in scenes:
            clean_path = os.path.abspath(sc["out"]).replace("\\", "/")
            f.write(f"file '{clean_path}'\n")

    print("Stitching scenes and mixing audio track...")
    final_mp4 = "promo/sleuth_official_trailer.mp4"
    cmd_merge = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", concat_txt,
        "-i", "promo/teaser_audio.wav",
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest",
        final_mp4
    ]
    res_merge = subprocess.run(cmd_merge, capture_output=True, text=True)
    if res_merge.returncode == 0:
        print(f"SUCCESS! Official trailer generated at: {final_mp4}")
    else:
        print("Merge error:", res_merge.stderr)

if __name__ == "__main__":
    build_trailer()
