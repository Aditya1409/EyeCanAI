# EyeCanAI
Eye Can AI is a desktop assistive technology solution that was designed for improving accessibility for people who have visual impairments through the provision of real-time audible descriptions of the visual content. The application leverages AI-powered image captioning and text-to-speech technology to offer an accessible and intuitive solution for image interpretation in offline environments.

## Features
- Real-time image captioning: Uses BLIP (Bootstrapped Language Image Pretraining) for generating natural language descriptions from images.
- Offline functionality: Operates locally without the need for an internet connection.
- Simple, intuitive GUI: Built with Tkinter for easy navigation and minimal confusion.
- Secure user management: Includes user authentication with password hashing using SQLite.
- Text-to-speech output: Relays the generated caption to users audibly using the pyttsx3 engine.

## Screenshots
Here’s a preview of what the application looks like:
 
![Login Screen](./images/Screenshot%202025-04-23%20234450.png) 

*Login Screen*

![Main App Screen](./images/Screenshot%202025-04-23%20234552.png)  

*Main App Interface showing image upload and capture options*

![Another View](./images/Screenshot%202025-04-23%20234637.png) 

*Live webcam feed with key binding to capture image for real-time captioning with detailed description.*

## Components
- AppManager: Manages the main application flow, including user login and interface control.
- UserManager: Handles user authentication and local user data management.
- ImageProcessor: Handles image capture, upload, and processing.
- CaptionGenerator: Uses BLIP for generating captions from processed images.
- SpeechEngine: Converts generated captions to speech for audio feedback.
