// Canvas solo necesita cambiar el parámetro ?video= con el id de este array.
// Ejemplo: https://university.redmond.com/video/?video=badges
window.REDMOND_VIDEOS = [
  {
    id: "sign-of-the-times",
    type: "iframe",
    title: "Harry Styles - Sign of the Times (Official Video)",
    src: "https://www.youtube.com/embed/qN4ooNx77u0",
    width: 854,
    height: 480,
    allow:
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen",
    referrerPolicy: "strict-origin-when-cross-origin",
    frame: {
      style: "wavy",
      color: "#2E3B2B",
      size: 8,
      wave: {
        period: 44,
        amplitude: 5.5,
        strokeWidth: 5,
        cornerRadius: 14,
        cornerTip: 5,
      },
    },
  },
  {
    id: "pulling-espresso",
    type: "iframe",
    title: "Pulling Espresso Training Video",
    src: "https://redmondlife.instructure.com/media_attachments_iframe/4451?embedded=true&type=video",
    mediaId: "m-5tUhmPTqDPsY4cxwNLi6jxzzBgE1mVc6",
    width: 421,
    height: 469,
    frame: {
      style: "wavy",
      color: "#2E3B2B",
      size: 18,
    },
  },
  {
    id: "badges",
    type: "video",
    title: "Looping Badge Video",
    src: "./badges.mp4",
    width: 720,
    height: 167,
    frame: {
      style: "wavy",
      color: "#2E3B2B",
      size: 18,
    },
    playback: {
      autoplay: true,
      controls: false,
      loop: true,
      muted: true,
    },
  },

  // Agrega aquí los siguientes videos. El archivo debe estar en esta carpeta.
  // {
  //   id: "another-video",
  //   type: "video",
  //   title: "Another training video",
  //   src: "./another-training-video.mp4",
  //   width: 720,
  //   height: 405,
  //   frame: {
  //     style: "wavy",
  //     color: "#2E3B2B",
  //     size: 18,
  //   },
  //   playback: {
  //     autoplay: false,
  //     controls: true,
  //     loop: false,
  //     muted: false,
  //   },
  // },
];
