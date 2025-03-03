from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
from PIL import Image
import io
import os
import random
import requests
import json

app = FastAPI()

# Add CORS middleware to allow requests from your React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Mock class descriptions for different MNIST datasets
class_descriptions = {
    "blood": {
        0: "Normal blood cell",
        1: "Benign lymphocyte",
        2: "Blast cell (potential leukemia)",
        3: "Erythroblast",
        4: "Promyelocyte"
    },
    "breast": {
        0: "Normal breast tissue",
        1: "Benign tumor",
        2: "In-situ carcinoma",
        3: "Invasive carcinoma"
    },
    "derma": {
        0: "Melanocytic nevus",
        1: "Melanoma",
        2: "Basal cell carcinoma",
        3: "Actinic keratosis",
        4: "Benign keratosis"
    },
    "pneumonia": {
        0: "Normal lung",
        1: "Bacterial pneumonia",
        2: "Viral pneumonia",
        3: "COVID-19 pneumonia"
    },
    "retina": {
        0: "Normal retina",
        1: "Diabetic retinopathy",
        2: "Glaucoma",
        3: "Macular degeneration",
        4: "Retinal detachment"
    }
}

# LLM-generated detailed explanations for each class
llm_explanations = {
    "blood": {
        0: "The image shows normal blood cells with typical morphology. Normal blood cells are essential for oxygen transport, immune function, and clotting. The cells appear to have regular size, shape, and coloration, indicating healthy hematopoiesis.",
        1: "The image shows benign lymphocytes, which are a type of white blood cell important for immune function. These cells appear slightly larger than normal but maintain regular nuclear features. Benign lymphocytosis can occur during viral infections or certain immune responses.",
        2: "The image shows blast cells, which are immature white blood cells that may indicate leukemia. These cells typically have a high nuclear-to-cytoplasmic ratio, prominent nucleoli, and fine chromatin. Further testing is recommended to determine the specific type of leukemia.",
        3: "The image shows erythroblasts, which are immature red blood cells normally found in bone marrow but not in peripheral blood. Their presence in a blood sample may indicate bone marrow stress, severe anemia, or certain hematological disorders.",
        4: "The image shows promyelocytes, which are precursors to granulocytes in the blood. An increased number of promyelocytes may indicate acute promyelocytic leukemia (APL), a subtype of acute myeloid leukemia that requires prompt treatment."
    },
    "breast": {
        0: "The image shows normal breast tissue with typical ductal and lobular structures. The tissue appears well-organized with appropriate fat distribution and no signs of abnormal cell growth or architectural distortion.",
        1: "The image shows characteristics of a benign breast tumor, likely a fibroadenoma or cyst. These non-cancerous growths have well-defined borders and regular internal structures. While benign, regular monitoring is recommended.",
        2: "The image shows features consistent with in-situ carcinoma, where abnormal cells are contained within the breast ducts or lobules and haven't invaded surrounding tissue. Early detection and treatment of in-situ carcinoma typically leads to excellent outcomes.",
        3: "The image shows patterns suggestive of invasive breast carcinoma, where cancer cells have spread beyond the ducts or lobules into surrounding breast tissue. This type of cancer requires comprehensive treatment planning including surgery, radiation, and possibly chemotherapy or hormone therapy."
    },
    "derma": {
        0: "The image shows a melanocytic nevus, commonly known as a mole. This is a benign growth of melanocytes (pigment-producing cells) with regular borders and consistent coloration. Regular monitoring for changes in size, shape, or color is recommended.",
        1: "The image shows features consistent with melanoma, a serious form of skin cancer that develops from melanocytes. Signs include irregular borders, variable coloration, asymmetry, and diameter typically larger than 6mm. Immediate dermatological consultation is recommended.",
        2: "The image shows characteristics of basal cell carcinoma, the most common type of skin cancer. It typically appears as a pearly or waxy bump, a flat, flesh-colored or brown scar-like lesion, or a bleeding or scabbing sore that heals and returns. While rarely metastatic, treatment is necessary to prevent local tissue damage.",
        3: "The image shows signs of actinic keratosis, a precancerous skin condition caused by cumulative sun exposure. These rough, scaly patches or lesions are an early warning sign and may progress to squamous cell carcinoma if untreated.",
        4: "The image shows a benign keratosis, which is a non-cancerous growth on the skin that develops with age. These growths may appear as waxy, stuck-on lesions with varying pigmentation. While harmless, they can be removed for cosmetic reasons or if they become irritated."
    },
    "pneumonia": {
        0: "The image shows normal lung tissue with clear air spaces and normal vascular markings. The bronchial structures and pulmonary vessels appear normal without signs of consolidation, infiltrates, or pleural effusions.",
        1: "The image shows features consistent with bacterial pneumonia, characterized by lobar consolidation and air bronchograms. Bacterial pneumonia typically presents with sudden onset of fever, productive cough, and localized chest pain. Treatment with appropriate antibiotics is usually effective.",
        2: "The image shows patterns suggestive of viral pneumonia, with bilateral, diffuse interstitial infiltrates. Viral pneumonia often presents with gradual onset of dry cough, fever, and fatigue. Treatment is primarily supportive, though antiviral medications may be beneficial in certain cases.",
        3: "The image shows radiographic findings consistent with COVID-19 pneumonia, including bilateral ground-glass opacities predominantly in the peripheral and lower lung zones. This pattern is characteristic of the inflammatory response to SARS-CoV-2 infection and requires appropriate isolation measures and supportive care."
    },
    "retina": {
        0: "The image shows a normal retina with clear definition of the optic disc, macula, and blood vessels. The retinal pigmentation appears even, and there are no signs of hemorrhages, exudates, or abnormal growth.",
        1: "The image shows signs of diabetic retinopathy, a complication of diabetes affecting the retina. Features include microaneurysms, dot and blot hemorrhages, hard exudates, and possibly neovascularization. Regular ophthalmological monitoring and good glycemic control are essential.",
        2: "The image shows characteristics of glaucoma, with cupping of the optic disc and thinning of the neuroretinal rim. Glaucoma is typically associated with increased intraocular pressure and can lead to progressive vision loss if untreated. Early detection and pressure-lowering treatments are crucial.",
        3: "The image shows features of age-related macular degeneration (AMD), affecting the central portion of the retina. Signs may include drusen (yellow deposits), geographic atrophy, or choroidal neovascularization. AMD is a leading cause of vision loss in older adults and may require anti-VEGF therapy for wet forms.",
        4: "The image shows evidence of retinal detachment, where the retina separates from the underlying tissue. This appears as an elevated, rippled, or irregular retinal surface. Retinal detachment is a medical emergency requiring prompt surgical intervention to prevent permanent vision loss."
    }
}

# Treatment recommendations based on classification
treatment_recommendations = {
    "blood": {
        0: "No specific treatment needed. Recommend routine health maintenance.",
        1: "Monitor for any changes. If persistent lymphocytosis, consider further testing to rule out chronic lymphocytic disorders.",
        2: "Urgent hematology consultation recommended. Further testing including bone marrow biopsy, flow cytometry, and cytogenetic analysis needed to confirm diagnosis and determine appropriate treatment protocol.",
        3: "Evaluate for underlying causes such as hemolytic anemia, blood loss, or bone marrow disorders. Consider hematology referral.",
        4: "Urgent hematology consultation. If acute promyelocytic leukemia is confirmed, ATRA (all-trans retinoic acid) and arsenic trioxide therapy should be considered as first-line treatment."
    },
    "breast": {
        0: "Continue routine breast cancer screening according to age-appropriate guidelines.",
        1: "Regular monitoring with follow-up imaging in 6-12 months. Surgical excision may be considered if the lesion is symptomatic or growing.",
        2: "Surgical excision with clear margins is typically recommended. Radiation therapy may be advised following breast-conserving surgery. Hormonal therapy may be considered for hormone-receptor positive cases.",
        3: "Multidisciplinary approach including surgery (lumpectomy or mastectomy), sentinel lymph node biopsy, possible axillary lymph node dissection, radiation therapy, and systemic therapy (chemotherapy, targeted therapy, and/or hormonal therapy) based on tumor characteristics."
    },
    "derma": {
        0: "Regular self-examination and routine dermatological check-ups. Use sun protection to prevent changes.",
        1: "Immediate surgical excision with appropriate margins based on tumor thickness. Sentinel lymph node biopsy may be indicated. Advanced cases may require immunotherapy, targeted therapy, or radiation.",
        2: "Treatment options include surgical excision, Mohs micrographic surgery, radiation therapy, topical medications, or photodynamic therapy depending on size, location, and subtype.",
        3: "Treatment options include cryotherapy, topical medications (5-fluorouracil, imiquimod), photodynamic therapy, or surgical removal to prevent progression to squamous cell carcinoma.",
        4: "No treatment necessary unless lesions are symptomatic or cosmetically concerning. Options include cryotherapy, curettage and electrodesiccation, or shave excision."
    },
    "pneumonia": {
        0: "No treatment needed. Maintain good respiratory health practices.",
        1: "Antibiotic therapy based on likely pathogens and local resistance patterns. Typical options include amoxicillin, doxycycline, or a macrolide. Supportive care including hydration and fever management.",
        2: "Primarily supportive care including rest, hydration, and antipyretics. Antiviral medications may be considered for influenza. Monitor for secondary bacterial infections.",
        3: "Management according to current COVID-19 protocols. May include supportive care, oxygen supplementation, prone positioning, antiviral therapy, immunomodulators, or anticoagulation based on disease severity and current guidelines."
    },
    "retina": {
        0: "Maintain regular eye examinations according to age-appropriate guidelines.",
        1: "Regular ophthalmological monitoring, optimal glycemic control, blood pressure management, and lipid control. Advanced cases may require laser photocoagulation, anti-VEGF injections, or vitrectomy.",
        2: "Treatment focuses on lowering intraocular pressure through eye drops, oral medications, laser therapy, or surgery (trabeculectomy, tube shunts, or minimally invasive glaucoma surgeries) depending on type and severity.",
        3: "For dry AMD: AREDS2 vitamin supplementation, lifestyle modifications including smoking cessation and dietary changes. For wet AMD: anti-VEGF injections. Low vision aids may be helpful in advanced cases.",
        4: "Urgent surgical repair, which may include pneumatic retinopexy, scleral buckling, or vitrectomy depending on the type and extent of detachment. Post-surgical monitoring for recurrence or complications."
    }
}

def generate_llm_analysis(task, class_id, confidence):
    """
    Generate a comprehensive analysis using pre-defined LLM responses
    """
    try:
        # Get the class description
        class_name = class_descriptions[task][class_id]
        
        # Get the detailed explanation
        detailed_explanation = llm_explanations[task][class_id]
        
        # Get treatment recommendation
        treatment = treatment_recommendations[task][class_id]
        
        # Generate confidence assessment
        if confidence > 95:
            confidence_statement = "The model has very high confidence in this diagnosis."
        elif confidence > 85:
            confidence_statement = "The model has high confidence in this diagnosis."
        elif confidence > 70:
            confidence_statement = "The model has moderate confidence in this diagnosis."
        else:
            confidence_statement = "The model has low confidence in this diagnosis. Consider additional testing or expert consultation."
        
        # Combine all parts into a comprehensive analysis
        analysis = f"{detailed_explanation}\n\n{confidence_statement}\n\nRecommended approach: {treatment}"
        
        return class_name, analysis
    except Exception as e:
        print(f"Error generating LLM analysis: {str(e)}")
        return f"{task.capitalize()} Class {class_id}", "Unable to generate detailed analysis."

def preprocess_image(image: Image.Image) -> np.ndarray:
    """Preprocess the image for model input"""
    # Resize to standard size
    image = image.resize((224, 224))
    # Convert to numpy array and normalize
    image_array = np.array(image).astype(np.float32) / 255.0
    # Add batch dimension if needed
    if len(image_array.shape) == 3:  # For RGB images
        image_array = np.expand_dims(image_array, axis=0)
    return image_array

@app.post("/predict")
async def predict(image: UploadFile = File(...), task: str = Form(...)):
    """
    Process the uploaded image and return prediction results with LLM-enhanced explanations
    """
    try:
        # Read and preprocess the image
        contents = await image.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # In a real app, you would load and use your ONNX model here
        # For now, we'll return mock prediction results
        
        # Simulate model prediction with random values
        if task in class_descriptions:
            classes = list(class_descriptions[task].keys())
            predicted_class = random.choice(classes)
            confidence = random.uniform(70.0, 99.9)
            
            # Generate LLM-enhanced explanation
            class_name, class_desc = generate_llm_analysis(task, predicted_class, confidence)
            
            return {
                "class_name": class_name,
                "confidence": confidence,
                "class_desc": class_desc,
                "prediction": int(predicted_class)
            }
        else:
            return JSONResponse(
                status_code=400,
                content={"error": f"Unknown task type: {task}"}
            )
            
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Error processing image: {str(e)}"}
        )

@app.get("/")
def read_root():
    return {"message": "Medical Image Classification API with LLM Integration"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8503) 