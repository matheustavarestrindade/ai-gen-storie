import scipy
import torch
from transformers import AutoProcessor, BarkModel

model = BarkModel.from_pretrained("suno/bark")

speaker = "v2/pt_speaker_3"

device = "cuda:0" if torch.cuda.is_available() else "cpu"

print("Using device:", device)

model = model.to(device)

processor = AutoProcessor.from_pretrained("suno/bark")

# prepare the inputs
text_prompt = "O córtex cerebral, a camada externa do cérebro, é responsável por funções como linguagem, pensamento e percepção."
inputs = processor(text_prompt, voice_preset=speaker)

# generate speech
speech_output = model.generate(**inputs.to(device))

sampling_rate = model.generation_config.sample_rate
scipy.io.wavfile.write("bark_out.wav", rate=sampling_rate, data=speech_output[0].cpu().numpy())