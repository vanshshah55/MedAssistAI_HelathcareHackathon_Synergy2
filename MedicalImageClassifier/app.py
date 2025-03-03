# import streamlit as st
# import onnxruntime as ort
# import numpy as np
# from PIL import Image
# import json
# import cv2
# from torchvision import transforms
# import os
# import time


# with open('utils/model_info.json', 'r') as f:
#     model_info = json.load(f)

# task_list = ["Select"]
# for task in model_info:
#     task_list.append(task)

# # Load models at the start of the app
# @st.cache_resource
# def load_model(model_path):
#     return ort.InferenceSession(model_path)

# # Preprocess image for the model
# def preprocess_image(image, input_size=224):
#     transform = transforms.Compose([
#         transforms.Resize((input_size, input_size)),
#         transforms.ToTensor(),
#     ])
#     image = Image.open(image).convert("RGB")
#     image = transform(image)
#     return image.unsqueeze(0).numpy()

# # Overlay Grad-CAM heatmap
# def overlay_class_heatmap(input_image, heatmap_path, alpha=0.4):
#     heatmap = cv2.imread(heatmap_path, cv2.IMREAD_GRAYSCALE)
#     heatmap = cv2.resize(heatmap, (input_image.shape[1], input_image.shape[0]))
#     heatmap = heatmap / 255.0
#     heatmap_colored = cv2.applyColorMap(np.uint8(255 * heatmap), cv2.COLORMAP_JET)
#     heatmap_colored = cv2.cvtColor(heatmap_colored, cv2.COLOR_BGR2RGB)
#     overlay = (1 - alpha) * input_image + alpha * heatmap_colored / 255.0
#     overlay = np.clip(overlay, 0, 1)
#     return overlay

# # Perform prediction
# def predict(task, model, image_tensor, generate_grad_cam=False):
#     input_name = model.get_inputs()[0].name
#     output_name = model.get_outputs()[0].name

#     outputs = model.run([output_name], {input_name: image_tensor})
#     probabilities = np.exp(outputs[0]) / np.sum(np.exp(outputs[0]), axis=1, keepdims=True)
#     predicted_class = np.argmax(probabilities, axis=1).item()
#     confidence = probabilities[0, predicted_class].item() * 100

#     predicted_class_name = model_info[task]["class_info"][str(predicted_class)]['class']
#     predicted_class_desc = model_info[task]["class_info"][str(predicted_class)]['desc']

#     result = {
#         "prediction": predicted_class,
#         "confidence": confidence,
#         "class_name": predicted_class_name,
#         "class_desc": predicted_class_desc,
#     }

#     if generate_grad_cam:
#         grad_cam_dir = f"grad-cams/{model_info[task]['model_name']}"
#         grad_cam_path = os.path.join(grad_cam_dir, f"class_{predicted_class}_heatmap.jpg")
#         if os.path.exists(grad_cam_path):
#             input_image_np = image_tensor[0].transpose(1, 2, 0)
#             input_image_np = input_image_np / input_image_np.max()
#             overlay = overlay_class_heatmap(input_image_np, grad_cam_path)
#             overlay = (overlay * 255).astype(np.uint8)
#             overlay_image = Image.fromarray(overlay)
#             result["grad_cam"] = overlay_image
#         else:
#             result["grad_cam"] = None

#     return result

# # Function to handle classification
# def classify_image(image_file, task, generate_grad_cam):
#     if task == "Select":
#         error_placeholder.error("Please select a model.")
#         return
#     if image_file is None:
#         error_placeholder.error("Please upload an image file.")
#         return

#     try:
#         # Create an empty placeholder to hold the spinner
#         result_placeholder.empty()
#         spinner_placeholder = st.empty()

#         with spinner_placeholder.container():
#             # Display an animated GIF centered in the container with text above it
#             st.markdown(
#                 """
#                 <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 500px;">
#                     <h3 style="margin-bottom: 20px;">Analyzing the image... Please wait.</h3>
#                     <!-- <img src="https://i.gifer.com/SVKl.gif" alt="Loading animation" width="150"> -->
#                     <img src="https://i.gifer.com/9viJ.gif" alt="Loading animation" width="250">
#                 </div>
#                 """,
#                 unsafe_allow_html=True,
#             )

#             # Simulate a 2-second processing delay
#             time.sleep(3)

#         # Clear the spinner
#         spinner_placeholder.empty()

#         # Load the selected model
#         model = load_model(f"{model_info[task]['model_path']}")

#         # Preprocess image and make prediction
#         image_tensor = preprocess_image(image_file)
#         result = predict(task, model, image_tensor, generate_grad_cam)

#         # Clear any previous error messages
#         error_placeholder.empty()

#         with result_placeholder.container():
#             # If Grad-CAM is generated
#             if generate_grad_cam and result.get('grad_cam'):
#                 # Columns layout for displaying results and Grad-CAM
#                 left_column, right_column = st.columns(2)

#                 # Display results in the left column
#                 with left_column:
#                     st.markdown("### Prediction Results")
#                     st.write(f"**Prediction:** {result['class_name']}")
#                     st.write(f"**Confidence:** {result['confidence']:.2f}%")
#                     st.write(f"**Description:** {result['class_desc']}")

#                 # Display Grad-CAM in the right column
#                 with right_column:
#                     st.markdown("### Grad-CAM Heatmap")
#                     st.image(result.get("grad_cam"), caption="Grad-CAM Heatmap", use_container_width=True)
#             else:
#                 # Display results only
#                 st.markdown("### Prediction Results")
#                 st.write(f"**Prediction:** {result['class_name']}")
#                 st.write(f"**Confidence:** {result['confidence']:.2f}%")
#                 st.write(f"**Description:** {result['class_desc']}")

#     except Exception as e:
#         error_placeholder.error(f"An error occurred: {e}")

# # Streamlit UI
# st.title("Medical Image Classifier with Grad-CAM")

# # Sidebar header for model selection
# st.sidebar.header("Configuration")

# # Adding a default option for model selection
# task = st.sidebar.selectbox("Select Task", task_list)

# # Checkbox to enable/disable Grad-CAM generation
# generate_grad_cam_checkbox = st.sidebar.checkbox("Generate Grad-CAM", value=True)

# # File upload section
# uploaded_file = st.file_uploader("Upload an image", type=["jpg", "jpeg", "png"])

# if uploaded_file is not None:
#     st.image(uploaded_file, caption="Uploaded Image", width=224)

# # Placeholder for error messages
# error_placeholder = st.empty()

# classify_button = st.button("Detect")

# # Placeholder for result display
# result_placeholder = st.empty()

# if classify_button:
#     classify_image(uploaded_file, task, generate_grad_cam_checkbox)




import streamlit as st
import onnxruntime as ort
import numpy as np
from PIL import Image
import json
import cv2
from torchvision import transforms
import os
import time
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import io
from starlette.staticfiles import StaticFiles

# Create FastAPI app for API endpoints
app = FastAPI()

# Configure CORS to allow requests from your React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, you can restrict this to your React app's URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model information
with open('utils/model_info.json', 'r') as f:
    model_info = json.load(f)

task_list = ["Select"]
for task in model_info:
    task_list.append(task)

# Load models at the start of the app
@st.cache_resource
def load_model(model_path):
    return ort.InferenceSession(model_path)

# Preprocess image for the model
def preprocess_image(image_bytes, input_size=224):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    transform = transforms.Compose([
        transforms.Resize((input_size, input_size)),
        transforms.ToTensor(),
    ])
    transformed_image = transform(image)
    return transformed_image.unsqueeze(0).numpy()

# Perform prediction
def predict(task, model, image_tensor):
    input_name = model.get_inputs()[0].name
    output_name = model.get_outputs()[0].name

    outputs = model.run([output_name], {input_name: image_tensor})
    probabilities = np.exp(outputs[0]) / np.sum(np.exp(outputs[0]), axis=1, keepdims=True)
    predicted_class = np.argmax(probabilities, axis=1).item()
    confidence = probabilities[0, predicted_class].item() * 100

    predicted_class_name = model_info[task]["class_info"][str(predicted_class)]['class']
    predicted_class_desc = model_info[task]["class_info"][str(predicted_class)]['desc']

    result = {
        "prediction": predicted_class,
        "confidence": confidence,
        "class_name": predicted_class_name,
        "class_desc": predicted_class_desc,
    }

    return result

# FastAPI endpoint for prediction
@app.post("/predict")
async def predict_api(image: UploadFile = File(...), task: str = Form(...)):
    try:
        # Read image file
        image_bytes = await image.read()
        
        # Load the selected model
        model = load_model(f"{model_info[task]['model_path']}")
        
        # Preprocess image and make prediction
        image_tensor = preprocess_image(image_bytes)
        result = predict(task, model, image_tensor, )
        
        return result
    except Exception as e:
        return {"error": str(e)}

# Streamlit UI (separate from the API)
def main():
    st.title("Medical Image Classifier with Grad-CAM")

    # Sidebar header for model selection
    st.sidebar.header("Configuration")

    # Adding a default option for model selection
    task = st.sidebar.selectbox("Select Task", task_list)

    # Checkbox to enable/disable Grad-CAM generation
    generate_grad_cam_checkbox = st.sidebar.checkbox("Generate Grad-CAM", value=True)

    # File upload section
    uploaded_file = st.file_uploader("Upload an image", type=["jpg", "jpeg", "png"])

    if uploaded_file is not None:
        st.image(uploaded_file, caption="Uploaded Image", width=224)

    # Placeholder for error messages
    error_placeholder = st.empty()

    classify_button = st.button("Detect")

    # Placeholder for result display
    result_placeholder = st.empty()

    if classify_button and uploaded_file:
        # UI version of classification
        try:
            # Load the selected model
            model = load_model(f"{model_info[task]['model_path']}")
            
            # Preprocess image and make prediction
            image_bytes = uploaded_file.read()
            image_tensor = preprocess_image(image_bytes)
            result = predict(task, model, image_tensor)
            
            with result_placeholder.container():
                st.markdown("### Prediction Results")
                st.write(f"**Prediction:** {result['class_name']}")
                st.write(f"**Confidence:** {result['confidence']:.2f}%")
                st.write(f"**Description:** {result['class_desc']}")
                
        except Exception as e:
            error_placeholder.error(f"An error occurred: {e}")

# Run Streamlit UI when run directly
if __name__ == "__main__":
    # Run FastAPI with uvicorn on port 8501 (same as Streamlit's default)
    import threading
    
    # Start FastAPI in a separate thread
    def run_api():
        uvicorn.run(app, host="0.0.0.0", port=8501)
    
    api_thread = threading.Thread(target=run_api, daemon=True)
    api_thread.start()
    
    # Run Streamlit UI
    main()