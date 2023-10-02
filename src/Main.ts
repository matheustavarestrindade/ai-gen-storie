import fs from "fs/promises";
import facts from "../fatos.json";
import { spawn } from "child_process";
interface CreateTextCommand {
    text: string;
    x: string;
    y: string;
    fontSize: number;
    fontColor: string;
    startSecond: number;
    endSecond: number;
}

const VIDEO_TIME_SECONDS = 61;

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

    const grayScaleFilter = "hue=s=0";

    const fact = facts[Math.floor(Math.random() * facts.length)];
    // Remove fact from array
    facts.splice(facts.indexOf(fact), 1);
    // Update facts.json
    await fs.writeFile("./fatos.json", JSON.stringify(facts, null, 4));
    // Update already used facts
    const usedFacts = await fs.readFile("./usedFatos.json", "utf-8");
    const usedFactsJson = JSON.parse(usedFacts);
    usedFactsJson.push(fact);
    await fs.writeFile("./usedFatos.json", JSON.stringify(usedFactsJson, null, 4));

    // Create title on top center
    const TITLE = createTitle(fact.titulo, 0, VIDEO_TIME_SECONDS, 22, 5).join(",");

    // Create description on bottom center
    const descriptions = [];
    let delayToStart = 5;
    let timePerDescription = (VIDEO_TIME_SECONDS - delayToStart) / fact.fatos.length;
    for (let i = 0; i < fact.fatos.length; i++) {
        const text = fact.fatos[i];
        const startTime = timePerDescription * i + delayToStart;
        const endTime = timePerDescription * (i + 1) + delayToStart;

        const description = createSubtitles(text, 5, 30, startTime, endTime);
        descriptions.push(...description);
    }

    const CROP_TO_YT_SHORT = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920";
    const AUDIO_AND_VIDEO = [`-stream_loop`, "-1", "-i", `./videos/${randomVideo}`, "-stream_loop", "-1", "-i", `./sounds/${randomAudio}`, "-map", "0:v:0", "-map", "1:a:0"];
    const FILTERS = ["-vf", `${grayScaleFilter},${CROP_TO_YT_SHORT},${TITLE},${descriptions.join(",")}`];
    const OUTPUT = `./output/video-${videoNumber}.mp4`;
    const DURATION = ["-t", `${VIDEO_TIME_SECONDS}`];

    // Log the full command
    console.log(`ffmpeg ${[...AUDIO_AND_VIDEO, ...FILTERS, ...DURATION, OUTPUT].join(" ")}`);

    const CMD_CONSOLE = spawn("ffmpeg", [...AUDIO_AND_VIDEO, ...FILTERS, ...DURATION, OUTPUT]);

    // Output log to console
    CMD_CONSOLE.stdout.on("data", (data) => {
        console.log(data.toString());
    });

    // Output error to console
    CMD_CONSOLE.stderr.on("data", (data) => {
        console.error(data.toString());
    });
};

const createTitle = (text: string, startTime: number, endTime: number, maxLineLength: number, maxWords: number) => {
    const descriptions = [];
    const words = text.split(" ");
    const lines = [];

    let line = "";
    let lineCount = 0;
    for (const word of words) {
        if (lineCount >= maxWords || line.length + word.length >= maxLineLength) {
            lines.push(line);
            line = "";
            lineCount = 0;
        }
        line += word + " ";
        lineCount++;
    }
    if (lineCount > 0) lines.push(line); // Add last line if it's not full of words

    let index = 0;
    for (const line of lines) {
        const description = createShowTextCommand({
            text: line,
            x: "(w-text_w)/2",
            y: "(h-text_h)/2" + " - " + (600 - index * 120),
            fontSize: 100,
            fontColor: "white",
            startSecond: startTime,
            endSecond: endTime,
        });
        descriptions.push(description);
        index++;
    }
    return descriptions;
};

const createSubtitles = (text: string, maxWords: number, maxLineLength: number, startTime: number, endTime: number) => {
    const descriptions = [];
    const words = text.split(" ");
    const lines = [];

    let line = "";
    let lineCount = 0;
    for (const word of words) {
        if (lineCount >= maxWords || line.length + word.length >= maxLineLength) {
            lines.push(line);
            line = "";
            lineCount = 0;
        }
        line += word + " ";
        lineCount++;
    }
    if (lineCount > 0) lines.push(line); // Add last line if it's not full of words

    let index = 0;
    for (const line of lines) {
        const description = createShowTextCommand({
            text: line,
            x: "(w-text_w)/2",
            y: "(h-text_h) - " + (900 - index * 100),
            fontSize: 70,
            fontColor: "white",
            startSecond: startTime,
            endSecond: endTime,
        });
        index++;
        descriptions.push(description);
    }
    return descriptions;
};

const createShowTextCommand = (data: CreateTextCommand) => {
    const { text, x, y, fontSize: size, fontColor: color, startSecond, endSecond } = data;

    //  safe for FFMPEG
    let safeText = text.replace(/%/g, "\\%").replace("-", "\\-").replace(": ", "\\: ");

    const fontFile = `fontfile=./fonts/Roboto-Regular.ttf`;
    // Make box rounded
    const drawBox = `box=1:boxcolor=#450ec7:boxborderw=30`;

    return `drawtext=${fontFile}:${drawBox}:expansion=none:text='${safeText}':x=${x}:y=${y}:fontsize=${size}:fontcolor=${color}:enable='between(t,${startSecond},${endSecond})'`;
};

createVideo();
