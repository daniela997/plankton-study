from pathlib import Path
from PIL import Image
from hashlib import md5

RAW_DIR = Path("/home/daniela/mine/plankton-study/public/images/raw")
OUTPUT_DIR = Path("/home/daniela/mine/plankton-study/public/images")
OUTPUT_DIR.mkdir(exist_ok=True)

for img_path in RAW_DIR.iterdir():
    if img_path.suffix.lower() not in {".png", ".jpg", ".jpeg"}:
        continue

    raw_stem = img_path.stem
    category = raw_stem.split("__", 1)[0]
    slug = md5(raw_stem.encode()).hexdigest()[:8]
    img = Image.open(img_path)
    width, height = img.size
    mid = width // 2

    left = img.crop((0, 0, mid, height))
    right = img.crop((mid, 0, width, height))

    for subcat, half in (("A", left), ("B", right)):
        subdir = OUTPUT_DIR / category / f"subcategory_{subcat}"
        subdir.mkdir(parents=True, exist_ok=True)
        filename = f"{category}_{subcat}_{slug}.png"
        half.save(subdir / filename)

    print(f"Processed {category}")