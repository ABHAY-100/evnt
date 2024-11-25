
<!-- ![Nextjsgit](https://github.com/user-attachments/assets/d276960c-bfd6-4b41-8ea3-3daa52a0c027) -->
![Nextjsgit](assets/github_banner.png)



# evnt.
## Overview

**evnt.** is a powerful event management automation tool designed to streamline the organization of events across various sectors. By automating tasks like participant registration and group management, **evnt.** allows organizers to focus on delivering memorable experiences rather than getting bogged down by administrative work.

## Problem Statement

Organizing events often requires manually managing participant information and group communications, which can be time-consuming and error-prone. For example, during a Tech Conference, organizers must create separate groups for speakers, volunteers, and attendees, complicating communication and coordination.

evnt. simplifies this process by automating group creation and participant management, allowing organizers to focus on delivering a successful event.

## Key Features

1. **Automated Group Management**: Effortlessly create WhatsApp Communities and automatically assign participants and organizers to relevant WhatsApp Groups tailored to specific event requirements.

2. **Seamless Registration Process**: Generate Google Forms for event registration, ensuring efficient data collection and management.

3. **Streamlined Participant Addition**: Automatically extract participant information from Google Forms responses and add them to designated WhatsApp groups, reducing manual entry errors and ensuring a smooth onboarding process.

4. **User-Friendly Interface**: A clean and intuitive interface that allows users to navigate the application with ease, making event management straightforward and efficient.

## Team Members

1. [Abhay Balakrishnan](https://github.com/ABHAY-100)
2. [Aadithya Madhav](https://github.com/aadithyayy)
3. [Elvin J Alapatt](https://github.com/Elvin2605)
4. [Joshua Sebi](https://github.com/JoshuaSebi)

## Challenges Faced

Due to the limited time during our 15-hour hackathon, we prioritized automating group creation and member addition within evnt. We successfully developed the front end; however, we faced several challenges, including:

- **WhatsApp API Limitations**: Gaining access to the WhatsApp API proved to be complex, with potential risks of account bans when using unauthorized methods.
- **Transition to Alternative Platforms**: We explored using Telegram and Discord for group management, but faced limitations regarding group or server creation capabilities.

## Getting Started

To set up **evnt.** locally, follow these steps:

1. Clone the Repository:

    ```bash
    git clone https://github.com/ABHAY-100/evnt.git
    ```
    
2. Navigate to the Project Directory:
   
    ```bash
    cd evnt
    ```
    
3. Install Dependencies:
   
    ```bash
    npm install
    ```

4. You can see a file named `.env.example` in the root of the project. Create a new file named `.env` or `.env.local` in the root and then copy & paste the contents of `example.env` completely there.

5. Now Open `https://my.telegram.org` and login with you phone number.

<img src="assets/for_readme/telegram_api_step1.png" alt="Step 1" style="width: 700px" />

7. After login click on `API development tools`

<img src="assets/for_readme/telegram_api_step2.png" alt="Step 2" style="width: 700px" />

8. Create new Application by filling the form by providing a nice `App Title` & `Short Name`.

<img src="assets/for_readme/telegram_api_step3.png" alt="Step 3" style="width: 700px" />

9. Now you will be shown a page with some credentials. Copy the `API_ID` and `API_HASH`.

10. Paste the ID and HASH to the .env file you have created to the corresponding keys.

11. Add your phone number to the `TELEGRAM_PHONE_NUMBER=` in international format

12. And then run

    ```bash
    npx tsx scripts/auth-telegram.ts
    ```

12. There you will get a string in terminal prompting to save thats your `TELEGRAM_SESSION` paste it in the env file

13. Run the Application:

    ```bash
    npm run dev
    ```

14. Open your web browser and go to `http://localhost:3000` to view the application.

    
## Build With

![Tech Stack](https://skillicons.dev/icons?i=html,css,ts,js,tailwind,nextjs,figma)

## Conclusion

**evnt.** is dedicated to revolutionizing the event management process for college organizations by automating essential tasks. Our tool empowers event organizers to concentrate on creating impactful and memorable events while minimizing administrative challenges.

<br/>

**Thank you for your interest in evnt.! 🤝**
