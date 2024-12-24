import PptxGenJS from "pptxgenjs";
import path from "path"; // To handle file paths

export async function generatePPTX(templatePath, content) {
    const pptx = new PptxGenJS();
    pptx.load(templatePath); // Load the template file

    // Generate slides dynamically
    content.slides.forEach((slide, index) => {
        const slideInstance = pptx.getSlide(index);
        slideInstance.replaceText("header", slide.header);
        slideInstance.replaceText("title", slide.title);
        slideInstance.replaceText("paragraph", slide.paragraph);
    });

    // Save the generated file
    const fileName = `presentation_${Date.now()}.pptx`; // Unique file name
    const filePath = path.join(__dirname, "../generated", fileName);

    await pptx.writeFile(filePath);

    return filePath; // Return the full path of the generated file
}
