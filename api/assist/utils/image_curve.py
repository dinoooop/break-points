from datetime import datetime
import json
import os
import random
from PIL import Image
from io import BytesIO
from django.conf import settings
from django.core.files.base import ContentFile
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from assist.shsm.Imgo import img_resizes
from django.core.files.storage import FileSystemStorage



def img_save_crop(request, image_field_name: str = "image"):
    """
    Generic helper for cropping images uploaded from frontend.

    Parameters:
      - request: Django request (containing FILES and data)
      - image_field_name: name of the uploaded image field

    Expected request.data:
      - <image_field_name>_x, _y, _w, _h (percent-based crop values)

    Returns:
      - cropped image filename
      - None if no image provided
      - Response (400) if failed
    """
    image_file = request.FILES.get(image_field_name)
    if not image_file:
        # not file, may existing url string
        image_value = getattr(request, "data", None)
        if image_value and image_field_name in image_value:
            return image_value[image_field_name] or None

    try:
        data = request.data
        crop_data_raw = data.get(f"{image_field_name}_crop", "{}")

        try:
            crop_data = json.loads(crop_data_raw) if isinstance(crop_data_raw, str) else crop_data_raw
        except json.JSONDecodeError:
            crop_data = {}

        # Extract individual values with defaults
        x = float(crop_data.get("x", 0))
        y = float(crop_data.get("y", 0))
        w = float(crop_data.get("w", 100))
        h = float(crop_data.get("h", 100))

        
        with Image.open(image_file) as img:
            img = img.convert("RGB")

            crop_x = int((x / 100) * img.width)
            crop_y = int((y / 100) * img.height)
            crop_w = int((w / 100) * img.width)
            crop_h = int((h / 100) * img.height)

            box = (crop_x, crop_y, crop_x + crop_w, crop_y + crop_h)
            cropped_img = img.crop(box)

            buffer = BytesIO()
            cropped_img.save(buffer, format="JPEG", quality=90)
            buffer.seek(0)
            
            now = datetime.now()
            random_number = random.randint(1000, 9999)
            ext = image_file.name.split('.')[-1].lower()
            new_file_name = (
                f"{now.year}{now.month:02d}{now.day:02d}_"
                f"{now.hour:02d}{now.minute:02d}{now.second:02d}_{random_number}.{ext}"
            )

            processed_image = ContentFile(buffer.getvalue(), new_file_name)
            
            uploads_location = os.path.join(settings.MEDIA_ROOT, "uploads")
            uploads_storage = FileSystemStorage(location=uploads_location)
            saved_path = uploads_storage.save(new_file_name, processed_image)

            return new_file_name
        return None

    except Exception as e:
        return None
        
def img_resize(filename, type):
    filepath = os.path.join(settings.MEDIA_ROOT, "uploads", filename)
    if not os.path.exists(filepath):
        print(f"File not found: {filename}")
        return False
    with Image.open(filepath) as img:
        img = img.convert("RGB")    
        # Loop through resize instructions
        resizes = img_resizes.get(type, [])
        for r in resizes:
            name = r.get("name")
            width = int(r.get("width", 0))
            height = int(r.get("height", 0))

            if not name or width <= 0 or height <= 0:
                continue  # skip invalid entries

            resized_img = img.resize((width, height), Image.Resampling.LANCZOS)

            # Build safe output path
            new_filename = os.path.join(settings.MEDIA_ROOT, "uploads", f"{name}-{filename}")

            # Save resized image
            resized_img.save(new_filename, format="JPEG", quality=90)
            print(f"Created resized image: {new_filename}")

    return True


def delete_image_variants(file_name):
        """Delete image variants from storage"""
        
        base_path = os.path.join(settings.MEDIA_ROOT, 'uploads')
        variants = ['', 'thumb-', 'cover-']
        for variant in variants:
            variant_path = base_path + f"/{variant}{file_name}"
            if os.path.exists(variant_path):
                os.remove(variant_path)