(function () {
  "use strict";

  const videos = Array.isArray(window.REDMOND_VIDEOS)
    ? window.REDMOND_VIDEOS
    : [];
  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get("video");
  const config = requestedId
    ? videos.find((video) => video.id === requestedId)
    : videos[0];

  const frame = document.getElementById("video-frame");
  const wave = document.getElementById("frame-wave");
  const wavePath = document.getElementById("frame-wave-path");
  const error = document.getElementById("video-error");

  if (!config) {
    frame.hidden = true;
    error.hidden = false;
    error.textContent = requestedId
      ? `No existe un video configurado con el identificador “${requestedId}”.`
      : "No hay videos configurados.";
    return;
  }

  if (
    config.type === "iframe" &&
    isYouTubeUrl(config.src) &&
    window.location.hostname === "127.0.0.1"
  ) {
    const localUrl = new URL(window.location.href);
    localUrl.hostname = "localhost";
    window.location.replace(localUrl.toString());
    return;
  }

  const width = positiveNumber(config.width, 720);
  const height = positiveNumber(config.height, 405);
  const frameSize = positiveNumber(config.frame?.size, 18);
  const frameColor = validColor(config.frame?.color, "#2E3B2B");
  const frameStyle = config.frame?.style === "rounded" ? "rounded" : "wavy";
  const waveConfig = config.frame?.wave || {};
  const wavePeriod = positiveNumber(waveConfig.period, 44);
  const waveAmplitude = positiveNumber(waveConfig.amplitude, 5.5);
  const waveStrokeWidth = positiveNumber(waveConfig.strokeWidth, 5);
  const waveCornerRadius = positiveNumber(waveConfig.cornerRadius, 14);
  const waveCornerTip = positiveNumber(waveConfig.cornerTip, 5);
  const playback = config.playback || {};

  document.title = config.title || "Redmond University Video";
  document.documentElement.style.setProperty("--video-width", `${width}px`);
  document.documentElement.style.setProperty("--video-ratio", `${width} / ${height}`);
  document.documentElement.style.setProperty("--frame-size", `${frameSize}px`);
  document.documentElement.style.setProperty("--frame-color", frameColor);
  document.documentElement.style.setProperty("--wave-stroke-width", waveStrokeWidth);

  frame.dataset.frame = frameStyle;
  const player = config.type === "iframe"
    ? createIframePlayer(config)
    : createVideoPlayer(config, playback);
  frame.appendChild(player);
  updateWavePath();

  if ("ResizeObserver" in window) {
    const frameObserver = new ResizeObserver(updateWavePath);
    frameObserver.observe(frame);
  } else {
    window.addEventListener("resize", updateWavePath);
  }

  player.addEventListener("error", function () {
    frame.hidden = true;
    error.hidden = false;
    error.textContent = `No se pudo cargar “${config.title || config.id}”. Revisa la ruta configurada en videos.js.`;
  });

  function createIframePlayer(videoConfig) {
    const iframe = document.createElement("iframe");
    iframe.className = "video-player";
    iframe.src = buildIframeUrl(videoConfig.src);
    iframe.title = videoConfig.title || "Training video";
    iframe.loading = "lazy";
    iframe.allow = videoConfig.allow || "fullscreen";
    iframe.allowFullscreen = true;
    if (videoConfig.referrerPolicy) {
      iframe.referrerPolicy = videoConfig.referrerPolicy;
    }
    if (videoConfig.mediaId) iframe.dataset.mediaType = "video";
    if (videoConfig.mediaId) iframe.dataset.mediaId = videoConfig.mediaId;
    return iframe;
  }

  function buildIframeUrl(source) {
    const url = new URL(source);
    if (isYouTubeUrl(source)) {
      url.searchParams.set("origin", window.location.origin);
      url.searchParams.set("widget_referrer", window.location.href);
    }
    return url.toString();
  }

  function isYouTubeUrl(source) {
    try {
      const hostname = new URL(source).hostname;
      return hostname === "www.youtube.com" || hostname === "www.youtube-nocookie.com";
    } catch {
      return false;
    }
  }

  function updateWavePath() {
    if (!wave || !wavePath || frameStyle !== "wavy") return;

    const width = frame.clientWidth;
    const height = frame.clientHeight;
    if (!width || !height) return;

    const radius = Math.min(waveCornerRadius, width / 4, height / 4);
    const amplitude = waveAmplitude;
    const horizontalLength = width - radius * 2;
    const verticalLength = height - radius * 2;
    const horizontalWaves = Math.max(1, Math.round(horizontalLength / wavePeriod));
    const verticalWaves = Math.max(1, Math.round(verticalLength / wavePeriod));
    const horizontalPeriod = horizontalLength / horizontalWaves;
    const verticalPeriod = verticalLength / verticalWaves;
    const path = [`M ${radius} 0`];

    addHorizontalWaves(path, radius, 0, horizontalWaves, horizontalPeriod, amplitude, 1);
    path.push(
      `Q ${width - 3} 0 ${width + waveCornerTip} ${-waveCornerTip}`,
      `Q ${width} ${radius - 3} ${width} ${radius}`
    );
    addVerticalWaves(path, width, radius, verticalWaves, verticalPeriod, amplitude, 1);
    path.push(
      `Q ${width} ${height - 3} ${width + waveCornerTip} ${height + waveCornerTip}`,
      `Q ${width - 3} ${height} ${width - radius} ${height}`
    );
    addHorizontalWaves(path, width - radius, height, horizontalWaves, horizontalPeriod, amplitude, -1);
    path.push(
      `Q 3 ${height} ${-waveCornerTip} ${height + waveCornerTip}`,
      `Q 0 ${height - 3} 0 ${height - radius}`
    );
    addVerticalWaves(path, 0, height - radius, verticalWaves, verticalPeriod, amplitude, -1);
    path.push(
      `Q 0 3 ${-waveCornerTip} ${-waveCornerTip}`,
      `Q 3 0 ${radius} 0 Z`
    );

    wave.setAttribute("viewBox", `0 0 ${width} ${height}`);
    wavePath.setAttribute("d", path.join(" "));
  }

  function addHorizontalWaves(path, startX, y, count, period, amplitude, direction) {
    for (let index = 0; index < count; index += 1) {
      const x = startX + direction * index * period;
      path.push(
        `Q ${x + direction * period * 0.25} ${y - amplitude * direction} ${x + direction * period * 0.5} ${y}`,
        `Q ${x + direction * period * 0.75} ${y + amplitude * direction} ${x + direction * period} ${y}`
      );
    }
  }

  function addVerticalWaves(path, x, startY, count, period, amplitude, direction) {
    for (let index = 0; index < count; index += 1) {
      const y = startY + direction * index * period;
      path.push(
        `Q ${x + amplitude * direction} ${y + direction * period * 0.25} ${x} ${y + direction * period * 0.5}`,
        `Q ${x - amplitude * direction} ${y + direction * period * 0.75} ${x} ${y + direction * period}`
      );
    }
  }

  function createVideoPlayer(videoConfig, videoPlayback) {
    const video = document.createElement("video");
    video.className = "video-player";
    video.src = videoConfig.src;
    video.title = videoConfig.title || "Training video";
    video.preload = "metadata";
    video.playsInline = true;
    video.autoplay = Boolean(videoPlayback.autoplay);
    video.controls = videoPlayback.controls !== false;
    video.loop = Boolean(videoPlayback.loop);
    video.muted = Boolean(videoPlayback.muted);
    video.defaultMuted = Boolean(videoPlayback.muted);

    if (videoPlayback.autoplay) {
      video.play().catch(function () {
        video.controls = true;
      });
    }
    return video;
  }

  function positiveNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : fallback;
  }

  function validColor(value, fallback) {
    if (typeof value !== "string") return fallback;
    return /^#[0-9a-f]{6}$/i.test(value.trim()) ? value.trim() : fallback;
  }
})();
