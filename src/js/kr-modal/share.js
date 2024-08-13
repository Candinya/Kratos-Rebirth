function krOpenShareModal() {
  document.getElementById("kr-share-modal").classList.add("show");

  // 需要延迟一下，避免动画被优化掉
  setTimeout(() => {
    document.getElementById("kr-share-modal").classList.add("active");
  }, 1);
}

function krCloseShareModal() {
  document.getElementById("kr-share-modal").classList.remove("active");

  // 给动画留时间
  setTimeout(() => {
    document.getElementById("kr-share-modal").classList.remove("show");
  }, 300);
}

function krShareModalOpenPlatform(link) {
  const url = document
    .querySelector(`meta[property="og:url"]`)
    .getAttribute("content");
  const title = document
    .querySelector(`meta[property="og:title"]`)
    .getAttribute("content");
  const summary = document
    .querySelector(`meta[property="og:description"]`)
    .getAttribute("content");
  const site = document
    .querySelector(`meta[property="og:site_name"]`)
    .getAttribute("content");

  const targetURL = link
    .replaceAll("$URL", url)
    .replaceAll("$TITLE", title)
    .replaceAll("$SUMMARY", summary)
    .replaceAll("$SITE", site);

  window.open(targetURL, "_blank");
}

function initQRCode() {
  const container = document.getElementById("kr-share-qr");
  if (container) {
    // 清空上一个二维码避免冲突
    container.innerHTML = "";

    // 建立新的二维码
    const qrCode = new QRCodeStyling({
      width: 150,
      height: 150,
      data: document
        .querySelector(`meta[property="og:url"]`)
        .getAttribute("content"),
      image: document.querySelector(`link[rel="icon"]`).getAttribute("href"),
      dotsOptions: {
        color: "#78ce79",
        type: "extra-rounded",
      },
      backgroundOptions: {
        color: "transparent",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 1,
      },
    });

    qrCode.append(container);
  } else {
    requestAnimationFrame(initQRCode);
  }
}

initQRCode();

window.addEventListener("pjax:complete", initQRCode);

// Append to window object
window.krOpenShareModal = krOpenShareModal;
window.krCloseShareModal = krCloseShareModal;
window.krShareModalOpenPlatform = krShareModalOpenPlatform;
window.initQRCode = initQRCode;
