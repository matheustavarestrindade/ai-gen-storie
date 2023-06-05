import ffmpeg from "ffmpeg";
import fs from "fs/promises";

const createVideo = async () => {
    // Select random video from videos folder
    const videos = await fs.readdir("./videos");
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    console.log(`Selected video ${randomVideo}`);
    // Select random audio from audio folder
    const audio = await fs.readdir("./sounds");
    const randomAudio = audio[Math.floor(Math.random() * audio.length)];
    console.log(`Selected audio ${randomAudio}`);
    //Get video number from output folder
    const output = await fs.readdir("./output");
    const videoNumber = output.length;
    console.log(`Video number ${videoNumber}`);
    // Create video
    const process = new ffmpeg(`./videos/${randomVideo}`);
    process.then((video) => {
        video.addCommand("-i", `./sounds/${randomAudio}`);
        // Map audio to video
        video.addCommand("-map", "0:v:0 -map 1:a:0");
        // Set duration to 10 seconds
        video.addCommand("-t", "10");
        // Create title on top center
        const TITLE = createShowTextCommand({
            text: "Hello World",
            x: "(w-text_w)/2",
            y: "(h-text_h)-700",
            fontSize: 100,
            color: "white",
            startSecond: 0,
            endSecond: 10,
            textStayTime: 5,
        });
        // Create subtitle on bottom center
        const SUBTITLE = createShowTextCommand({
            text: "Hello World",
            x: "(w-text_w)/2",
            y: "(h-text_h)-500",
            fontSize: 100,
            color: "white",
            startSecond: 0,
            endSecond: 10,
            textStayTime: 5,
        });

        // Set aspect ratio to youtube short 9:16 and fit video to new aspect ratio without black borders
        video.addCommand("-vf", `"${CROP_TO_YT_SHORT},${TITLE},${SUBTITLE}"`);
        // Set output file name
        video.save(`./output/video-${videoNumber}.mp4`);
    });
};

const CROP_TO_YT_SHORT = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920";

const createShowTextCommand = (data: { textStayTime: number; text: string; x: string; y: string; fontSize: number; color: string; startSecond: number; endSecond: number }) => {
    const { text, x, y, fontSize: size, color, startSecond, endSecond, textStayTime } = data;

    const moveTime = (endSecond - startSecond - textStayTime) / 2;

    // Move text to screen, stay on screen, move out of screen using textStayTime

    const transitionX = `x='if(lt(t,${startSecond}),0 - w,if(lt(t, ${startSecond + moveTime}),(((1 - (t - ${startSecond})/${moveTime})) * -w) + ${x},if(lt(t,${
        endSecond - moveTime
    }),${x},if(lt(t,${endSecond}),(((t - ${endSecond - moveTime})/${moveTime}) * (w + text_w) + ${x} ),(w +text_w) + ${x}))))'`;
    const transitionY = `y=${y}`;

    const fontFile = `fontfile=./fonts/Roboto-Regular.ttf`;

    return `drawtext=${fontFile}:text='${text}':${transitionX}:${transitionY}:fontsize=${size}:fontcolor=${color}:enable='between(t,${startSecond},${endSecond})'`;
};

createVideo();
