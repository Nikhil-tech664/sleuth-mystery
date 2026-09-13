import subprocess
import os
import sys

def render_vertical_ad():
    print("=== RENDERING VERTICAL 9:16 AD (TikTok, Instagram Reels, YouTube Shorts) ===")
    temp_dir = "promo/temp_vertical"
    os.makedirs(temp_dir, exist_ok=True)

    scenes = [
        {
            "img": "promo/gameplay_frames/mobile_1_hook.png",
            "dur": 3.5,
            "top": "A MURDER IN VICTORIAN LONDON...",
            "bot": "Lord Sterling was killed during a 90-second blackout",
            "zoom": "min(zoom+0.0006,1.08)",
            "out": f"{temp_dir}/v_scene1.mp4"
        },
        {
            "img": "promo/gameplay_frames/mobile_2_interrogation.png",
            "dur": 3.5,
            "top": "CROSS-EXAMINE THE SUSPECTS",
            "bot": "Real-time galvanic polygraph lie detector",
            "zoom": "min(zoom+0.0007,1.10)",
            "out": f"{temp_dir}/v_scene2.mp4"
        },
        {
            "img": "promo/gameplay_frames/mobile_3_logic_grid.png",
            "dur": 3.5,
            "top": "THE DEDUCTION MATRIX",
            "bot": "Eliminate false alibis with pure logic (X / ✓)",
            "zoom": "min(zoom+0.0006,1.08)",
            "out": f"{temp_dir}/v_scene3.mp4"
        },
        {
            "img": "promo/gameplay_frames/mobile_4_accuse.png",
            "dur": 3.5,
            "top": "OFFICIAL ARREST WARRANT",
            "bot": "Name the Culprit, Weapon & Crime Scene",
            "zoom": "min(zoom+0.0007,1.10)",
            "out": f"{temp_dir}/v_scene4.mp4"
        },
        {
            "img": "promo/gameplay_frames/mobile_5_confession.png",
            "dur": 3.5,
            "top": "CASE CLOSED • VERDICT ATTAINED!",
            "bot": "Gavel slams • Sliding iron cell door • Rank promoted",
            "zoom": "min(zoom+0.0006,1.08)",
            "out": f"{temp_dir}/v_scene5.mp4"
        },
        {
            "img": "promo/gameplay_frames/mobile_6_newspaper.png",
            "dur": 4.5,
            "top": "FRONT-PAGE DAILY CHRONICLE",
            "bot": "CAN YOU SOLVE IT? Play Free: sleuth-mystery.vercel.app",
            "zoom": "1.05-0.0005*on",
            "out": f"{temp_dir}/v_scene6.mp4"
        }
    ]

    font_serif = "C\\:/Windows/Fonts/georgia.ttf"
    font_bold = "C\\:/Windows/Fonts/arialbd.ttf"

    for idx, sc in enumerate(scenes):
        print(f"Rendering vertical scene {idx+1}/{len(scenes)}...")
        frames = int(sc["dur"] * 30)

        top_file = f"{temp_dir}/top_{idx}.txt"
        bot_file = f"{temp_dir}/bot_{idx}.txt"
        with open(top_file, "w", encoding="utf-8") as f:
            f.write(sc["top"])
        with open(bot_file, "w", encoding="utf-8") as f:
            f.write(sc["bot"])

        top_path = os.path.abspath(top_file).replace("\\", "/").replace(":", "\\:")
        bot_path = os.path.abspath(bot_file).replace("\\", "/").replace(":", "\\:")

        vf = (
            f"scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,"
            f"zoompan=z='{sc['zoom']}':d={frames}:s=1080x1920:fps=30,"
            # Top Banner Box & Accent
            f"drawbox=y=60:color=black@0.85:width=iw:height=140:t=fill,"
            f"drawbox=y=198:color=0xC69214@0.95:width=iw:height=4:t=fill,"
            f"drawtext=fontfile='{font_serif}':textfile='{top_path}':fontcolor=0xFFD700:fontsize=40:"
            f"x=(w-text_w)/2:y=105:shadowcolor=black@0.9:shadowx=2:shadowy=2,"
            # Bottom Subtitle Box & Accent
            f"drawbox=y=ih-200:color=black@0.88:width=iw:height=140:t=fill,"
            f"drawbox=y=ih-202:color=0xC69214@0.95:width=iw:height=4:t=fill,"
            f"drawtext=fontfile='{font_bold}':textfile='{bot_path}':fontcolor=0xFAF6F0:fontsize=32:"
            f"x=(w-text_w)/2:y=h-145:shadowcolor=black@0.9:shadowx=2:shadowy=2"
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
            print(f"Error in vertical scene {idx+1}:", res.stderr)
            return False

    concat_txt = f"{temp_dir}/concat.txt"
    with open(concat_txt, "w") as f:
        for sc in scenes:
            clean_path = os.path.abspath(sc["out"]).replace("\\", "/")
            f.write(f"file '{clean_path}'\n")

    output_ad = "promo/sleuth_tiktok_reels_ad.mp4"
    print("Stitching vertical ad & syncing cinematic audio...")
    cmd_merge = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", concat_txt,
        "-i", "promo/vertical_ad_audio.wav",
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest",
        output_ad
    ]
    res_merge = subprocess.run(cmd_merge, capture_output=True, text=True)
    if res_merge.returncode == 0:
        print(f"SUCCESS! Vertical Ad exported to: {output_ad}")
        return True
    else:
        print("Vertical merge error:", res_merge.stderr)
        return False


def render_horizontal_trailer():
    print("\n=== RENDERING HORIZONTAL 16:9 TRAILER (Itch.io, YouTube, Reddit, Twitter) ===")
    temp_dir = "promo/temp_horizontal"
    os.makedirs(temp_dir, exist_ok=True)

    scenes = [
        {
            "img": "promo/gameplay_frames/desktop_1_desk.png",
            "dur": 3.5,
            "text1": "SCOTLAND YARD INCIDENT FILE #42",
            "sub": "The Bitter Roast at Velvet Manor • Lord Percival Sterling Murdered",
            "zoom": "min(zoom+0.0007,1.12)",
            "out": f"{temp_dir}/h_scene1.mp4"
        },
        {
            "img": "promo/gameplay_frames/desktop_2_interrogation.png",
            "dur": 3.5,
            "text1": "CROSS-EXAMINE ECCENTRIC SUSPECTS",
            "sub": "Real-Time Galvanic Polygraph Lie Detector Under Pressure",
            "zoom": "min(zoom+0.0008,1.14)",
            "out": f"{temp_dir}/h_scene2.mp4"
        },
        {
            "img": "promo/gameplay_frames/desktop_3_logic_grid.png",
            "dur": 3.5,
            "text1": "CRIME SCENE HOTSPOTS & DEDUCTION MATRIX",
            "sub": "Cross-reference Suspects, Weapons & Motives (✕ / ✓)",
            "zoom": "min(zoom+0.0007,1.12)",
            "out": f"{temp_dir}/h_scene3.mp4"
        },
        {
            "img": "promo/gameplay_frames/desktop_4_forensics.png",
            "dur": 3.5,
            "text1": "SCOTLAND YARD FORENSICS LAB",
            "sub": "Latent Ridge Fingerprint Matching & Chemical Reagent Toxins",
            "zoom": "min(zoom+0.0007,1.12)",
            "out": f"{temp_dir}/h_scene4.mp4"
        },
        {
            "img": "promo/gameplay_frames/desktop_5_accusation.png",
            "dur": 3.5,
            "text1": "ISSUE THE OFFICIAL ARREST WARRANT",
            "sub": "Lock in the Culprit, Murder Weapon & Crime Scene",
            "zoom": "min(zoom+0.0008,1.14)",
            "out": f"{temp_dir}/h_scene5.mp4"
        },
        {
            "img": "promo/gameplay_frames/desktop_6_confession.png",
            "dur": 3.5,
            "text1": "MAGISTRATE'S GAVEL & IRON CELL BARS",
            "sub": "Handcuffs Click • Sliding Cell Door • Guilty Culprit Confesses",
            "zoom": "min(zoom+0.0008,1.14)",
            "out": f"{temp_dir}/h_scene6.mp4"
        },
        {
            "img": "promo/gameplay_frames/desktop_7_newspaper.png",
            "dur": 4.0,
            "text1": "THE DAILY CHRONICLE — 1-CLICK EXPORT",
            "sub": "CAN YOU CRACK THE CASE? PLAY FREE: sleuth-mystery.vercel.app",
            "zoom": "1.06-0.0006*on",
            "out": f"{temp_dir}/h_scene7.mp4"
        }
    ]

    font_serif = "C\\:/Windows/Fonts/georgia.ttf"
    font_bold = "C\\:/Windows/Fonts/arialbd.ttf"

    for idx, sc in enumerate(scenes):
        print(f"Rendering horizontal scene {idx+1}/{len(scenes)}...")
        frames = int(sc["dur"] * 30)

        t1_file = f"{temp_dir}/t1_{idx}.txt"
        sub_file = f"{temp_dir}/sub_{idx}.txt"
        with open(t1_file, "w", encoding="utf-8") as f:
            f.write(sc["text1"])
        with open(sub_file, "w", encoding="utf-8") as f:
            f.write(sc["sub"])

        t1_path = os.path.abspath(t1_file).replace("\\", "/").replace(":", "\\:")
        sub_path = os.path.abspath(sub_file).replace("\\", "/").replace(":", "\\:")

        vf = (
            f"scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,"
            f"zoompan=z='{sc['zoom']}':d={frames}:s=1920x1080:fps=30,"
            f"drawbox=y=ih-160:color=black@0.85:width=iw:height=160:t=fill,"
            f"drawbox=y=ih-163:color=0xC69214@0.95:width=iw:height=4:t=fill,"
            f"drawtext=fontfile='{font_serif}':textfile='{t1_path}':fontcolor=0xFFD700:fontsize=40:"
            f"x=(w-text_w)/2:y=h-130:shadowcolor=black@0.9:shadowx=2:shadowy=2,"
            f"drawtext=fontfile='{font_bold}':textfile='{sub_path}':fontcolor=0xFAF6F0:fontsize=24:"
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
            print(f"Error in horizontal scene {idx+1}:", res.stderr)
            return False

    concat_txt = f"{temp_dir}/concat.txt"
    with open(concat_txt, "w") as f:
        for sc in scenes:
            clean_path = os.path.abspath(sc["out"]).replace("\\", "/")
            f.write(f"file '{clean_path}'\n")

    output_trailer = "promo/sleuth_gameplay_trailer.mp4"
    print("Stitching horizontal trailer & syncing audio track...")
    cmd_merge = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0", "-i", concat_txt,
        "-i", "promo/gameplay_trailer_audio.wav",
        "-c:v", "libx264", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-shortest",
        output_trailer
    ]
    res_merge = subprocess.run(cmd_merge, capture_output=True, text=True)
    if res_merge.returncode == 0:
        print(f"SUCCESS! Horizontal Trailer exported to: {output_trailer}")
        return True
    else:
        print("Horizontal merge error:", res_merge.stderr)
        return False

if __name__ == "__main__":
    v_ok = render_vertical_ad()
    h_ok = render_horizontal_trailer()
    if v_ok and h_ok:
        print("\nALL VIDEO ADS AND TRAILERS SUCCESSFULLY GENERATED!")
    else:
        sys.exit(1)
