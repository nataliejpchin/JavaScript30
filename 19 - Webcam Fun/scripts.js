const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// To access a user’ s camera and microphone
function getVideo() {
    navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        })
        .then(localMediaStream => {
            console.log(localMediaStream);

            // set video to be the live feed
            // convert live video feed into something the player can understand
            video.src = window.URL.createObjectURL(localMediaStream);

            // play live stream video
            video.play();
        })
        // show error if access to webcam is denied
        .catch(err => {
            console.error('OH NO!!!', err);
        })
}


// take a frame from this video and paint it onto the canvas on the screen
function paintToCanvas() {
    // get the width and height of the actual live feed video
    const width = video.videoWidth;
    const height = video.videoHeight;

    // set canvas width and height to be the same as the live feed video
    canvas.width = width;
    canvas.height = height;

    // every 16ms, take the image from the webcam and put it into the canvas
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);

        // take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);

        // mess with them
        // pixels = redEffect(pixels);

        // pixels = redSplit(pixels);
        // ctx.globalAlpha = 0.8;

        pixels = greenScreen(pixels);

        // put them back
        ctx.putImageData(pixels, 0, 0);
    }, 16);
}

// Take a snapshot
function takePhoto() {
    // play shutter sound
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas
    // returns data uri - attributes about the photo in text-based form
    const data = canvas.toDataURL('image/jpeg');
    console.log(data);

    // create a link to the photo
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`
    // insert new photo at the beginning of the photo strip
    strip.insertBefore(link, strip.firstChild);
}

// add red filter effect
function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 1000; // RED
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // BLUE
    }
    return pixels;
}

// add ghosting filter effect
function redSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i - 150] = pixels.data[i + 0]; // RED
        pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
        pixels.data[i - 550] = pixels.data[i + 2]; // BLUE
    }
    return pixels;
}

// add green screen effect
// TODO: Not working although same code as solution
function greenScreen(pixels) {
    const levels = {};

    // find a range of certain green and take them out
    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    console.log(levels);

    for (i = 0; i < pixels.data.length; i = i + 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        alpha = pixels.data[i + 3];

        if (red >= levels.rmin &&
            green >= levels.gmin &&
            blue >= levels.bmin &&
            red <= levels.rmax &&
            green <= levels.gmax &&
            blue <= levels.bmax) {
            // take it out!
            pixels.data[i + 3] = 0;
        }
    }

    return pixels;

}

getVideo();

// once the video is playing, emit an called canplay to run paintToCanvas function
video.addEventListener('canplay', paintToCanvas);