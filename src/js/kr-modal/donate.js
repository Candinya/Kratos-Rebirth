function krOpenDonateModal() {
  document.getElementById("kr-donate-modal").classList.add("show");

  // 需要延迟一下，避免动画被优化掉
  setTimeout(() => {
    document.getElementById("kr-donate-modal").classList.add("active");
  }, 1);
}

function krCloseDonateModal() {
  document.getElementById("kr-donate-modal").classList.remove("active");

  // 给动画留时间
  setTimeout(() => {
    document.getElementById("kr-donate-modal").classList.remove("show");
  }, 300);
}

function krDonateModalShowPlatformQR(text, color) {
  const container = document.getElementById("kr-donate-qr");

  // 清空上一个二维码避免冲突
  container.innerHTML = "";

  // 建立新的二维码
  const qrCode = new QRCodeStyling({
    width: 150,
    height: 150,
    data: text,
    dotsOptions: {
      color: color,
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
}

// Append to window object
window.krOpenDonateModal = krOpenDonateModal;
window.krCloseDonateModal = krCloseDonateModal;
window.krDonateModalShowPlatformQR = krDonateModalShowPlatformQR;
