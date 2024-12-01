document.addEventListener('DOMContentLoaded', async function() {
    const galleryElement = document.querySelector('#gallery');

    cacheBust = document.getElementById("sitetime").content;
    fetch("../images/moodboard/moodboard_index.txt?v=" + cacheBust)
      .then(response => response.text())
      .then(text => {
        // parse the moodboard index: filename, num columns, caption
        const lines = text.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const parts = lines[i].split(' ');
            const filename = parts[0];
            const cols = parts[1];
            const caption = parts.slice(2).join(' ');

            const a = document.createElement('a');
            a.href = "../images/moodboard/" + filename;
            if (cols > 1) {
                a.classList = "span-" + cols;
            }
            if (filename.endsWith(".mp4")) {
                a.classList = "video-link";
            }
            const img = document.createElement('img');
            if (filename.endsWith(".mp4")) {
                img.src = "../images/moodboard/" + filename.replace('.mp4', '-thumb.jpg');
            } else {
                img.src = "../images/moodboard/" + filename;
            }
            img.alt = caption;
            a.appendChild(img);
            galleryElement.appendChild(a);
        }
      })
      .then(async () => {

        const galleryWidth = galleryElement.parentElement.offsetWidth;
        const minColumns = 3; // Number of columns we want
        const maxColumnWidth = Math.floor(galleryWidth / minColumns) - 10;

        const masonry = new Masonry(galleryElement, {
            itemSelector: 'a',
            columnWidth: maxColumnWidth,
            gutter: 10,
            fitWidth: false,
            initLayout: false
        });

        // poke widths into the CSS
        galleryElement.style.setProperty('--column-width', maxColumnWidth + 'px');
        document.querySelectorAll('.pswp-gallery a').forEach(a => a.style.width = maxColumnWidth + 'px');
        document.querySelectorAll('.pswp-gallery a.span-2').forEach(a => a.style.width = (maxColumnWidth * 2) + 10 + 'px');

        // Pre-populate items array for PhotoSwipe
        const links = galleryElement.querySelectorAll('a');

        // Load all video metadata first
        const dimensionsPromises = Array.from(links).map(element => {
            if (element.classList.contains('video-link')) {
                return new Promise(resolve => {
                    const tmpVid = document.createElement('video');
                    tmpVid.src = element.href;
                    tmpVid.onloadedmetadata = () => {
                        resolve({
                            width: tmpVid.videoWidth,
                            height: tmpVid.videoHeight
                        });
                    };
                });
            } else {
                return Promise.resolve(null); // Non-video elements
            }
        });

        const dimensions = await Promise.all(dimensionsPromises);

        const items = [];
        links.forEach((element, index, arry) => {
            const isVideo = element.classList.contains('video-link');
            
            if (isVideo) {
                items.push({
                    html: `<div class="pswp-video-wrapper">
                            <video 
                                src="${element.href}"
                                controls
                                playsinline
                                preload="metadata">
                            </video>
                        </div>`,
                    width: dimensions[index].width,
                    height: dimensions[index].height,
                    caption: element.querySelector('img').getAttribute('alt'),
                    isVideo: true
                });
            } else {
                items.push({
                    src: element.href,
                    width: element.querySelector('img').naturalWidth,
                    height: element.querySelector('img').naturalHeight,
                    caption: element.querySelector('img').getAttribute('alt'),
                    isVideo: false
                });
            }
        });

        const lightbox = new PhotoSwipeLightbox({
            pswpModule: PhotoSwipe,
            bgOpacity: 0.9,
            dataSource: items,
            paddingFn: (viewportSize) => {
                return {
                top: 30, bottom: 30, left: 70, right: 70
                }
            },
        });

        // Add event handlers
        lightbox.on('uiRegister', function() {
            let currentVideo = null;

            lightbox.pswp.on('openComplete', () => {
                if (items[lightbox.pswp.currIndex].isVideo) {
                    currentVideo = lightbox.pswp.container.querySelector('.pswp-video-wrapper video');
                    if (currentVideo) {
                        currentVideo.play().catch(e => console.log('Autoplay prevented:', e));
                    }
                }
            });
            
            lightbox.pswp.on('close', () => {
                if (currentVideo) {
                    currentVideo.pause();
                    currentVideo = null;
                }
            });

            lightbox.pswp.on('beforeChange', () => {
                if (currentVideo) {
                    currentVideo.pause();
                    currentVideo = null;
                }
            });

            lightbox.pswp.on('change', () => {
                // Find any playing videos and stop them
                const videos = lightbox.pswp.container.querySelectorAll('.pswp-video-wrapper video');
                videos.forEach(video => {
                    video.pause();
                });
                
                // Update current video reference
                if (items[lightbox.pswp.currIndex].isVideo) {
                    currentVideo = lightbox.pswp.container.querySelector('.pswp-video-wrapper video');
                }
            });
        });

        const captionPlugin = new PhotoSwipeDynamicCaption(lightbox, {
            // Plugins options, for example:
            type: 'auto',
            captionContent: (slide) => {
                return slide.data.caption;
            }
        });

        lightbox.init();

        // Handle thumbnail clicks
        galleryElement.querySelectorAll('a').forEach((element, index) => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                lightbox.loadAndOpen(index);
            });
        });

        // After images load, tell Masonry to relayout
        imagesLoaded(galleryElement, function() {
            masonry.layout();
            galleryElement.classList.add('loaded');
        });

    });
});
