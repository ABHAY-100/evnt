
<!-- ![Nextjsgit](https://github.com/user-attachments/assets/d276960c-bfd6-4b41-8ea3-3daa52a0c027) -->
![Nextjsgit](assets/github_banner.png)



# evnt.
## Overview

**evnt.** is a powerful event management automation tool designed to streamline the organization of events across various sectors. By automating tasks like participant registration and group management, **evnt.** allows organizers to focus on delivering memorable experiences rather than getting bogged down by administrative work.

<br />

## Problem Statement

Organizing events often requires manually managing participant information and group communications, which can be time-consuming and error-prone. For example, during a Tech Conference, organizers must create separate groups for speakers, volunteers, and attendees, complicating communication and coordination.

evnt. simplifies this process by automating group creation and participant management, allowing organizers to focus on delivering a successful event.

<br />

## Key Features

1. **Automated Group Management**: Effortlessly create WhatsApp Communities and automatically assign participants and organizers to relevant WhatsApp Groups tailored to specific event requirements.

2. **Seamless Registration Process**: Generate Google Forms for event registration, ensuring efficient data collection and management.

3. **Streamlined Participant Addition**: Automatically extract participant information from Google Forms responses and add them to designated WhatsApp groups, reducing manual entry errors and ensuring a smooth onboarding process.

4. **User-Friendly Interface**: A clean and intuitive interface that allows users to navigate the application with ease, making event management straightforward and efficient.

<br />

## Team Members

1. [Abhay Balakrishnan](https://github.com/ABHAY-100)
2. [Aadithya Madhav](https://github.com/aadithyayy)
3. [Elvin J Alapatt](https://github.com/Elvin2605)
4. [Joshua Sebi](https://github.com/JoshuaSebi)

<br />

## Challenges Faced

During the 15-hour hackathon, we encountered two major challenges:

- **WhatsApp API Limitations**: Accessing the API was complex and risky, with unauthorized methods leading to potential bans.
- **Switch to Telegram**: By using Telegram's official API and MTProto protocol, we unlocked full user-level capabilities, overcoming the limitations of regular bots.

This transition ensured security, flexibility, and respect for user privacy.

<br />


## Getting Started

Follow these steps to set up evnt. locally:

### Prerequisites

Ensure you have the following installed:
- Node.js (v16 or higher)
- npm

### Installation

1. Clone the Repository

    ```bash
    git clone https://github.com/ABHAY-100/evnt.git
    ```
    
2. Navigate to the Project Directory
   
    ```bash
    cd evnt
    ```
    
3. Install Dependencies
   
    ```bash
    npm install
    ```

4. Set Up Environment Variables
   
   - Locate the `.env.example` file in the root of the project.
   - Create a new file named `.env` or `.env.local` in the root directory.
   - Copy and paste the contents of `.env.example` into the newly created `.env` file.

### Configure Telegram API

5. Access Telegram Developer Tools

   - Open [my.telegram.org](https://my.telegram.org) and log in with your phone number.
   - After logging in, click on **API Development Tools**.

<img src="assets/for_readme/telegram_api_step1.png" alt="Step 1" style="width: 500px" />
<img src="assets/for_readme/telegram_api_step2.png" alt="Step 2" style="width: 500px" />

6. Create a New Application by filling out the form with an appropriate **App Title** and **Short Name**.

<img src="assets/for_readme/telegram_api_step3.png" alt="Step 3" style="width: 500px" />

7. Retrieve API Credentials
   - Once created, you will be shown a page with your **API_ID** and **API_HASH**.
   - Copy these values and paste them into the `.env` file under their respective keys.

8. Add Telegram Phone Number in the `.env` file in international format as ```TELEGRAM_PHONE_NUMBER=+<YourPhoneNumber>```

### Run the Application

9. Start the Application

    ```bash
    npm run dev
    ```

10. Open your web browser and navigate to `http://localhost:3000` to access the app.


<br />
    
## Build With

![Tech Stack](https://skillicons.dev/icons?i=html,css,ts,js,tailwind,nextjs,figma)

<br />

## Conclusion

**evnt.** is dedicated to revolutionizing the event management process for college organizations by automating essential tasks. Our tool empowers event organizers to concentrate on creating impactful and memorable events while minimizing administrative challenges.

<br/>

**Thank you for your interest in evnt.! 🤝**
