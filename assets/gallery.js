document.addEventListener('DOMContentLoaded', function() {
    const galleryElement = document.querySelector('#gallery');
    
    // Initialize Masonry first
    const masonry = new Masonry(galleryElement, {
        itemSelector: 'a',
        columnWidth: 200,
        gutter: 10,
        fitWidth: true
    });

    // Rest of your PhotoSwipe initialization remains the same
    const items = [];
    
    // Pre-populate items array for PhotoSwipe
    galleryElement.querySelectorAll('a').forEach(element => {
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
                // TODO: fix width and height for videos - caption rendering top left here
                width: element.width,
                height: element.height,
                isVideo: true
            });
        } else {
            console.log(element);
            items.push({
                src: element.href,
                width: element.querySelector('img').naturalWidth,
                height: element.querySelector('img').naturalHeight,
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
            // TODO: point to the image's alt or something
            // https://github.com/dimsemenov/photoswipe-dynamic-caption-plugin?tab=readme-ov-file#plugin-options
            return "captionContent";
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
    });
});