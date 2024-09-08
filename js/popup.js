function changeSpeed(value) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "setSpeed",
      speed: value,
    });
  });
}

function getCurrentSpeed(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "getSpeed" },
      function (response) {
        if (response && response.speed !== undefined) {
          callback(response.speed);
        }
      }
    );
  });
}

function getQuerySelector(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "getQuerySelector" },
      function (response) {
        if (response && response.querySelector !== undefined) {
          callback(response.querySelector);
        }
      }
    );
  });
}

window.addEventListener("DOMContentLoaded", function (evt) {
  getQuerySelector((value) => {
    if (value) {
      const min = 0.25;
      const max = 5;

      const content = document.querySelector(".content-speed");
      content.classList.add("active");

      const actualValue = document.querySelector(".actual-value");
      const speedBtns = document.querySelectorAll(".speed-bnt");

      const sliderTrack = document.querySelector(".slider-track");
      const sliderFill = document.querySelector(".slider-fill");
      const sliderHandle = document.querySelector(".slider-handle");

      getCurrentSpeed((val) => {
        actualValue.innerHTML = val;
        updateSlider(val);
      });

      speedBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          changeSpeed(+btn.value);
          getCurrentSpeed((val) => {
            actualValue.innerHTML = val;
            updateSlider(val);
          });
        });
      });

      function updateSlider(value) {
        if (value > max || value < min) {
          sliderFill.style.width = value > max ? "100%" : "0";
          sliderHandle.style.left = value > max ? "100%" : "0";
          actualValue.innerHTML = value > max ? max : min;
        } else {
          const percentage = ((value - min) / (max - min)) * 100;
          sliderFill.style.width = percentage + "%";
          sliderHandle.style.left = percentage + "%";
          actualValue.innerHTML = value;
          changeSpeed(value);
        }
      }

      sliderTrack.addEventListener("mousedown", (e) => {
        e.preventDefault();

        function onMouseMove(e) {
          const rect = sliderTrack.getBoundingClientRect();
          const offsetX = e.clientX - rect.left;
          const percentage = offsetX / sliderTrack.offsetWidth;
          const value = percentage * (max - min) + min;
          updateSlider(parseFloat(value.toFixed(2)));
        }

        function onMouseUp() {
          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      });
    } else {
      const info = document.querySelector(".info");
      info.classList.add("active");
    }
  });
});
