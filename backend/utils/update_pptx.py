# update_pptx.py
import sys
import json
import os
from pptx import Presentation

def replace_text_in_shape(shape, replacements):
    if not hasattr(shape, "text"):
        return
    for placeholder, new_text in replacements.items():
        if placeholder in shape.text:
            shape.text = shape.text.replace(placeholder, new_text)

def update_pptx(template_path, output_path, replacements):
    prs = Presentation(template_path)
    
    for slide in prs.slides:
        for shape in slide.shapes:
            replace_text_in_shape(shape, replacements)

    prs.save(output_path)
    print(f"PPTX file generated: {output_path}")

if __name__ == "__main__":
    try:
        template_path = sys.argv[1]
        slides_json = json.loads(sys.argv[2])
        output_path = sys.argv[3]  # Make sure it's inside /generated
    except Exception as e:
        print("Error parsing inputs:", e)
        sys.exit(1)

    # Ensure /generated directory exists
    generated_dir = os.path.dirname(output_path)
    if not os.path.exists(generated_dir):
        os.makedirs(generated_dir)

    update_pptx(template_path, output_path, slides_json)
