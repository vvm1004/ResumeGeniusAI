# pip install pymupdf opencv-python numpy pillow

import fitz  # PyMuPDF
import os
import cv2
import numpy as np
import base64
import io
from PIL import Image

def resize_and_compress_image(image_bytes, max_size_kb=100, max_width=400, max_height=400):
    # Use Pillow to open the image from bytes
    img = Image.open(io.BytesIO(image_bytes))

    # Detect image format (jpeg, png, etc.)
    img_format = img.format.lower()  # This will return 'jpeg', 'png', 'gif', etc.

    # Scale down if larger than max dimensions
    width, height = img.size
    if width > max_width or height > max_height:
        scale_factor = min(max_width / width, max_height / height)
        width = int(width * scale_factor)
        height = int(height * scale_factor)
        img = img.resize((width, height), Image.Resampling.LANCZOS)

    # Function to try compressing and reduce quality
    def try_compress(quality):
        img_byte_arr = io.BytesIO()
        if img_format == 'png':
            img.save(img_byte_arr, format='PNG')  # PNG is lossless, no quality setting
        else:
            img.save(img_byte_arr, format='JPEG', quality=quality)  # JPEG with adjustable quality
        img_byte_arr.seek(0)
        image_size_in_kb = len(img_byte_arr.getvalue()) / 1024
        return img_byte_arr, image_size_in_kb

    quality = 70  # Start with initial quality for compression

    while True:
        img_byte_arr, image_size_in_kb = try_compress(quality)

        if image_size_in_kb <= max_size_kb:
            # Encode to base64
            img_base64 = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')
            # Add the correct data URL prefix based on the format
            return f"data:image/{img_format};base64,{img_base64}"

        # If the quality is too low (less than 10%), stop compressing further
        if quality <= 10:
            img_base64 = base64.b64encode(img_byte_arr.getvalue()).decode('utf-8')
            return f"data:image/{img_format};base64,{img_base64}"

        quality -= 10  # Reduce quality by 10% and try again


def is_simple_color_image(image_bytes):
    """Check if the image has simple color (possibly an avatar)"""
    temp_image_path = "temp_image.png"
    with open(temp_image_path, "wb") as temp_img_file:
        temp_img_file.write(image_bytes)

    image = cv2.imread(temp_image_path)
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    
    lower_hue = np.array([0, 20, 20])  
    upper_hue = np.array([25, 255, 255])
    mask = cv2.inRange(hsv, lower_hue, upper_hue)
    
    color_ratio = cv2.countNonZero(mask) / (image.shape[0] * image.shape[1])
    print("color_ratio", color_ratio)
    os.remove(temp_image_path)  
    return color_ratio > 0.1


def extract_images_from_pdf(pdf_path, avatar_size_threshold=30000, avatar_aspect_ratio_threshold=1):
    """
    Extract and classify images from a PDF file, distinguishing avatars from other images.
    """
   
    doc = fitz.open(pdf_path)

    for page_num in range(doc.page_count):
        page = doc.load_page(page_num)
        
        image_list = page.get_images(full=True)
        
        for img_index, img in enumerate(image_list):
            xref = img[0]  
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"] 

            width = base_image["width"]
            height = base_image["height"]
        
            area = width * height
            aspect_ratio = width / height if height != 0 else 1
            aspect_ratio2 = height / width if width != 0 else 1

            if area > avatar_size_threshold and (
                (abs(aspect_ratio) >= avatar_aspect_ratio_threshold and abs(aspect_ratio) <= 2) or
                (abs(aspect_ratio2) >= avatar_aspect_ratio_threshold and abs(aspect_ratio2) <= 2)
            ):
                if is_simple_color_image(image_bytes):
                    # Resize and compress the image
                    compressed_image_base64 = resize_and_compress_image(image_bytes, max_size_kb=50, max_width=400, max_height=400)
                    # print(f"Compressed image base64: {compressed_image_base64[:100]}...")  # Print the first 100 characters of base64

                    return compressed_image_base64
    
    return ""
