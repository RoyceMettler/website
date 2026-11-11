"""Make smaller copies of the carousel card images.

Several of the photos in public/assets/hero are 11-17 megapixels, far more
than any screen shows a card at. Decoding and drawing them is a large part of
what the carousel costs, so the site picks the smallest copy that is still at
least as sharp as the screen (see cardImage() in src/components/CardList.tsx)
and only falls back to the original on screens that can use it.

Run from rm-website/ after adding or replacing a card image:

    python scripts/make-card-images.py

It writes public/assets/hero/sized/<name>-<width>.<ext> and prints the
`sizes` to put on each card in CardList.tsx. Originals are never modified.
Needs Pillow (pip install pillow).
"""

from pathlib import Path

from PIL import Image, ImageOps

HERO = Path(__file__).resolve().parent.parent / "public" / "assets" / "hero"
OUT = HERO / "sized"
WIDTHS = (1280, 2560)
# Only worth making a copy that is clearly smaller than the original.
MIN_SAVING = 1.4


def main() -> None:
    OUT.mkdir(exist_ok=True)
    for src in sorted(HERO.iterdir()):
        if src.suffix.lower() not in (".jpg", ".jpeg", ".png"):
            continue
        with Image.open(src) as opened:
            # Bake in any EXIF rotation so the copy looks the same as the original.
            image = ImageOps.exif_transpose(opened)
            icc = opened.info.get("icc_profile")
            made = []
            for width in WIDTHS:
                if image.width < width * MIN_SAVING:
                    continue
                height = round(image.height * width / image.width)
                small = image.resize((width, height), Image.LANCZOS)
                dest = OUT / f"{src.stem}-{width}{src.suffix.lower()}"
                if src.suffix.lower() == ".png":
                    small.save(dest, optimize=True)
                else:
                    small.save(
                        dest,
                        quality=90,
                        subsampling=0,
                        optimize=True,
                        progressive=True,
                        icc_profile=icc,
                    )
                made.append(width)
            print(f"{src.name:26s} {image.width}x{image.height}  sizes: {made}")


if __name__ == "__main__":
    main()
