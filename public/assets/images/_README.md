# How to optimise images

WebP is the best format to use for most images, as it provides a good compression over PNG and JPEG. It is supported by all modern browsers (https://caniuse.com/webp) and is the recommended format for images on the web.

## Using imagemagick (Recommended)

This is the recommended method to convert images to WebP as it is faster and can be done in bulk.

Install imagemagick from: https://imagemagick.org/script/download.php

In the folder you would like to convert images, use the appropriate command:

```bash
mogrify -format webp *.png
mogrify -format webp *.jpg
```

## Using cloudconvert

If you don't want to install imagemagick, you can use cloudconvert to convert images to WebP.

Go to https://cloudconvert.com/webp-converter and upload your images. You can convert multiple images at once.
