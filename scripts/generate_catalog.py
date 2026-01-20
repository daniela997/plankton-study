from pathlib import Path
import json

IMAGES_DIR = Path("/home/daniela/mine/plankton-study/public/images")
OUTPUT_FILE = Path("/home/daniela/mine/plankton-study/src/data/catalog.json")

def gather_subcat(category_dir, subcat):
    subdir = category_dir / f"subcategory_{subcat}"
    if not subdir.exists():
        return []
    return sorted(
        path.name
        for path in subdir.iterdir()
        if path.is_file() and path.suffix.lower() in {".png", ".jpg", ".jpeg"}
    )

categories = []
for category_dir in sorted(IMAGES_DIR.iterdir()):
    if not category_dir.is_dir() or category_dir.name == "raw":
        continue
    categories.append({
        "id": category_dir.name,
        "name": category_dir.name,
        "subcategories": {
            "A": gather_subcat(category_dir, "A"),
            "B": gather_subcat(category_dir, "B"),
        },
    })

OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
with OUTPUT_FILE.open("w") as fh:
    json.dump({"categories": categories}, fh, indent=2)

print(f"Generated catalog with {len(categories)} categories")
