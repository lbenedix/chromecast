const cjs = new Castjs();
document.querySelector("button").addEventListener("click", function () {
  let url = document.querySelector("input").value;
  let path = url.split("/").pop();
  let conference = path.split("-")[0];
  let eventId = path.split("-")[1];

  if (url.endsWith(".mp4")) {
    cjs.cast(url, {});
  } else {
    axios
      .get(`https://api.media.ccc.de/public/conferences/${conference}`)
      .then(function (response) {
        // handle success
        response.data.events.forEach((element) => {
          if (element.tags.includes(eventId)) {
            axios
              .get(element.url)
              .then(function (response) {
                response.data.recordings.forEach((element) => {
                  if (
                    element.mime_type == "video/mp4" &&
                    element.language == response.data.original_language &&
                    element.folder == "h264-hd"
                  ) {
                    console.log(element);
                    if (cjs.available) {
                      cjs.cast(element.recording_url, {
                        poster: element.thumbnails_url,
                        title: element.title,
                        description: element.subtitle
                      });
                    }
                  }
                });
              })
              .catch(function (error) {
                // handle error
                console.log(error);
              });
          }
        });
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }
});