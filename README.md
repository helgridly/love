# public dating profile

todo

- [x] make husseinface.heart image and make it the avatar
- [x] darken favico a few shades
- [x] write the intro page
- [x] copypasta the date me doc
- [x] make 404 page a derpy picture of pasha

## notes because i'll forget

* to make images on the moodboard double-wide, use the span-2 class

### image resizing

raw images are too damn big, they get resized. even the click-for-big versions are resized:

```
for file in *.jpg; do convert "$file" -resize 1200x800 -quality 85 "mids/${file%.jpg}.jpg"; done
```

and thumbnails:

```
for file in *.jpg; do convert "$file" -resize 640x480 -quality 70 "thumbs/${file%.jpg}.jpg"; done
```
