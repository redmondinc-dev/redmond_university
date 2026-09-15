# Dolly TRELLIS.2 asset

Expected generated file: `dolly-trellis.glb`.

Generation settings used against the official Microsoft TRELLIS.2 Space:

- Input: `games/farm/assets/RU Cow 2.png`
- Seed: `240519`
- Resolution: `512`
- Decimation target: `150000`
- Texture size: `2048`

After the GLB is available, prepare it in Blender with:

```sh
/Applications/Blender.app/Contents/MacOS/Blender \
  --background \
  --python ../../blender/prepare_trellis_dolly.py \
  -- dolly-trellis.glb
```

The current Mac cannot run TRELLIS.2 locally. The official runtime requires
Linux, CUDA, and an NVIDIA GPU with at least 24 GB VRAM.
