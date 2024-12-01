document.addEventListener('DOMContentLoaded', async function() {
    const galleryElement = document.querySelector('#gallery');
    const BATCH_SIZE = 10;
    let currentBatch = 0;
    let allLines = [];
    let masonry = null;
    let items = [];
    let lightbox = null;

    async function getVideoMetadata(url) {
        const response = await fetch(url, { method: 'HEAD' });
        return { width: 720, height: 1280 };
    }

    async function initPhotoSwipe() {
        lightbox = new PhotoSwipeLightbox({
            pswpModule: PhotoSwipe,
            bgOpacity: 0.9,
            dataSource: items,
            paddingFn: () => ({ top: 30, bottom: 30, left: 70, right: 70 }),
        });

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
                const videos = lightbox.pswp.container.querySelectorAll('.pswp-video-wrapper video');
                videos.forEach(video => video.pause());
                
                if (items[lightbox.pswp.currIndex].isVideo) {
                    currentVideo = lightbox.pswp.container.querySelector('.pswp-video-wrapper video');
                }
            });
        });

        new PhotoSwipeDynamicCaption(lightbox, {
            type: 'auto',
            captionContent: (slide) => slide.data.caption
        });

        lightbox.init();
    }

    const galleryWidth = galleryElement.parentElement.offsetWidth;
    const minColumns = 3;
    const maxColumnWidth = Math.floor(galleryWidth / minColumns) - 10;

    galleryElement.style.setProperty('--column-width', maxColumnWidth + 'px');

    masonry = new Masonry(galleryElement, {
        itemSelector: 'a',
        columnWidth: maxColumnWidth,
        gutter: 10,
        fitWidth: false
    });

    async function loadBatch(lines, start) {
        const end = Math.min(start + BATCH_SIZE, lines.length);
        const batchElements = new Array(BATCH_SIZE);
        const batchItems = new Array(BATCH_SIZE);
        let loadedCount = 0;

        for (let i = start; i < end; i++) {
            const parts = lines[i].split(' ');
            const filename = parts[0];
            const cols = parts[1];
            const caption = parts.slice(2).join(' ');

            const a = document.createElement('a');
            a.href = "../images/moodboard/mids/" + filename;
            a.style.width = cols > 1 ? (maxColumnWidth * 2) + 10 + 'px' : maxColumnWidth + 'px';
            a.style.opacity = '0';
            a.style.transition = 'opacity 0.3s';
            
            if (cols > 1) {
                a.classList = "span-" + cols;
            }
            const isVideo = filename.endsWith(".mp4");
            if (isVideo) {
                a.classList = "video-link";
            }

            const img = document.createElement('img');
            if (isVideo) {
                img.src = "../images/moodboard/thumbs/" + filename.replace('.mp4', '.jpg');
            } else {
                img.src = "../images/moodboard/thumbs/" + filename;
            }
            img.alt = caption;
            a.appendChild(img);

            const batchIndex = i - start;
            batchElements[batchIndex] = a;
            galleryElement.appendChild(a);

            img.onload = () => {
                batchItems[batchIndex] = isVideo ? {
                    html: `<div class="pswp-video-wrapper">
                            <video src="${a.href}" controls playsinline></video>
                        </div>`,
                    width: 720,
                    height: 1280,
                    caption,
                    isVideo: true
                } : {
                    src: a.href,
                    // naturalWidth + height are pulled from the thumbs, but the real images are bigger
                    // using the natural values will scale down the real images in the lightbox
                    // multiplying them up will preserve the aspect ratio and photoswipe will scale them
                    // to fit the viewport
                    width: img.naturalWidth * 4,
                    height: img.naturalHeight * 4,
                    caption,
                    isVideo: false
                };

                loadedCount++;
                if (loadedCount === end - start) {
                    items.push(...batchItems.slice(0, end - start));
                    masonry.appended(batchElements.slice(0, end - start));
                    requestAnimationFrame(() => {
                        batchElements.slice(0, end - start).forEach(el => el.style.opacity = '1');
                    });

                    if (currentBatch < lines.length) {
                        loadBatch(lines, end);
                    }
                }
            };

            a.addEventListener('click', (e) => {
                e.preventDefault();
                lightbox.loadAndOpen(items.findIndex(item => 
                    (item.src === a.href) || 
                    (item.html && item.html.includes(a.href))
                ));
            });
        }

        if (!lightbox) {
            await initPhotoSwipe();
        }

        if (start === 0) {
            galleryElement.classList.add('loaded');
        }

        currentBatch = end;
    }

    cacheBust = document.getElementById("sitetime").content;
    const response = await fetch("../images/moodboard/moodboard_index.txt?v=" + cacheBust);
    const text = await response.text();
    allLines = text.split('\n');

    await loadBatch(allLines, 0);
});