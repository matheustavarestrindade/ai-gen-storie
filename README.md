# Project Description: NodeJS Video Generator with Subtitles

## Introduction

This NodeJS project is designed to create engaging TikTok-style videos with subtitles by combining random videos, music, and facts from a JSON file. The project takes inspiration from a JSON file called `fatos.json`, which contains interesting facts and information. It selects a random video from a folder named `videos` and a random music track from a folder named `sounds` to create a visually appealing video. The subtitles for the video are generated based on the facts provided in `fatos.json`. This project is a fun way to generate educational and entertaining content.

## How to Use

To use this project, follow these steps:

1. Clone the Git repository to your local machine:

   ```
   git clone <repository_url>
   ```

2. Install the required NodeJS dependencies:

   ```
   npm install
   ```

3. Place your video files in the `videos` folder and your music tracks in the `sounds` folder.

4. Update the `fatos.json` file with your own facts or keep the existing ones.

5. Run the NodeJS script to generate a TikTok-style video:

   ```
   node generateVideo.js
   ```

6. Once the script is complete, you will find the output video in the `output` folder.

## How It Works

The project works by selecting a random video from the `videos` folder and a random music track from the `sounds` folder. It then reads the `fatos.json` file to extract facts and information. These facts are used to generate subtitles for the video.

Here's a brief overview of how the script works:

1. Load the `fatos.json` file to retrieve facts and titles.

2. Select a random video and music track from their respective folders.

3. Combine the video, music, and subtitles to create a TikTok-style video.

4. Save the generated video in the `output` folder.

5. The subtitles are displayed at appropriate intervals in the video to provide information about the selected facts.

This project allows you to create engaging and informative videos with ease, making it a fun way to share interesting facts with your audience.
