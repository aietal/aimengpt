<p align="center">
  <a href="https://apps.umbrel.com/app/llama-gpt">
    <img width="150" height="150" src="https://i.imgur.com/LI59cui.png" alt="LlamaGPT" width="200" />
  </a>
</p>
<p align="center">
  <h1 align="center">LlamaGPT</h1>
  <p align="center">
    A self-hosted, offline, ChatGPT-like chatbot to chat with your data, powered by Llama 2 and chromadb. 100% private, with no data leaving your device.
    <br />
   
  </p>
</p>

## Demo

https://github.com/getumbrel/llama-gpt/assets/10330103/5d1a76b8-ed03-4a51-90bd-12ebfaf1e6cd

## How to install

### Install IsaacGPT on your server or local machine

You can run IsaacGPT on any x86 or arm64 system. Make sure you have Docker installed.

First, clone the Chroma repo:

```
git clone https://github.com/chroma-core/chroma.git
```

Then, clone the IsaacGPT repo and `cd` into it:

```
git clone https://github.com/aietal/isaac-gpt.git
cd isaac-gpt
```

You can now run IsaacGPT with any of the following models depending upon your hardware:

| Model size | Model used                          | Minimum RAM required | How to start LlamaGPT                            |
| ---------- | ----------------------------------- | -------------------- | ------------------------------------------------ |
| 7B         | Nous Hermes Llama 2 7B (GGML q4_0)  | 8GB                  | `docker compose up -d`                           |
| 13B        | Nous Hermes Llama 2 13B (GGML q4_0) | 16GB                 | `docker compose -f docker-compose-13b.yml up -d` |
| 70B        | Meta Llama 2 70B Chat (GGML q4_0)   | 48GB                 | `docker compose -f docker-compose-70b.yml up -d` |

You can access LlamaGPT at `http://localhost:3000`.

To stop LlamaGPT, run:

```
docker compose down
```

## Benchmarks

We've tested LlamaGPT models on the following hardware with the default system prompt, and user prompt: "How does the universe expand?" at temperature 0 to guarantee deterministic results. Generation speed is averaged over the first 10 generations.

Feel free to add your own benchmarks to this table by opening a pull request.

### Nous Hermes Llama 2 7B (GGML q4_0)

| Device                           | Generation speed |
| -------------------------------- | ---------------- |
| M1 Max MacBook Pro (10 64GB RAM) | 8.2 tokens/sec   |
| Umbrel Home (16GB RAM)           | 2.7 tokens/sec   |
| Raspberry Pi 4 (8GB RAM)         | 0.9 tokens/sec   |

### Nous Hermes Llama 2 13B (GGML q4_0)

| Device                        | Generation speed |
| ----------------------------- | ---------------- |
| M1 Max MacBook Pro (64GB RAM) | 3.7 tokens/sec   |
| Umbrel Home (16GB RAM)        | 1.5 tokens/sec   |

### Meta Llama 2 70B Chat (GGML q4_0)

Unfortunately, we don't have any benchmarks for this model yet. If you have one, please open a pull request to add it to this table.

## Roadmap and contributing

We're looking to add more features to LlamaGPT. You can see the roadmap [here](https://github.com/getumbrel/llama-gpt/issues/8#issuecomment-1681321145). The highest priorities are:

- Add CUDA and Metal support.
- Moving the model out of the Docker image and into a separate volume.
- Updating the front-end to show model download progress, and to allow users to switch between models.
- Making it easy to run custom models.

If you're a developer who'd like to help with any of these, please open an issue to discuss the best way to tackle the challenge. If you're looking to help but not sure where to begin, check out [these issues](https://github.com/getumbrel/llama-gpt/labels/good%20first%20issue) that have specifically been marked as being friendly to new contributors.

## Acknowledgements

A massive thank you to the following developers and teams for making LlamaGPT possible:

- [Mckay Wrigley](https://github.com/mckaywrigley) for building [Chatbot UI](https://github.com/mckaywrigley).
- [Georgi Gerganov](https://github.com/ggerganov) for implementing [llama.cpp](https://github.com/ggerganov/llama.cpp).
- [Andrei](https://github.com/abetlen) for building the [Python bindings for llama.cpp](https://github.com/abetlen/llama-cpp-python).
- [NousResearch](https://nousresearch.com) for [fine-tuning the Llama 2 7B and 13B models](https://huggingface.co/NousResearch).
- [Tom Jobbins](https://huggingface.co/TheBloke) for [quantizing the Llama 2 models](https://huggingface.co/TheBloke/Nous-Hermes-Llama-2-7B-GGML).
- [Meta](https://ai.meta.com/llama) for releasing Llama 2 under a permissive license.

---

[![License](https://img.shields.io/github/license/getumbrel/llama-gpt?color=%235351FB)](https://github.com/getumbrel/llama-gpt/blob/master/LICENSE.md)

