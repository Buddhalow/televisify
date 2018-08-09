import VideoService from '.'

/**
 * Youtube service
 */
export default class YouTubeService extends VideoService {
    acceptsUri(uri) {
        return  /urn:youtube:(.*)/.test(uri);
    }
    resize() {
        this.iframe.style.width = this.iframe.parentNode.getBoundingClientRect().width + 'px';
        this.iframe.style.height = this.iframe.parentNode.getBoundingClientRect().height + 'px';
    }
    load (uri, pos) {
        this.initialPosition = pos;
        this.node.innerHTML = '<div id="ytplayer" style="width: 100%; height: 100%"></div>';

        this.player = new YT.Player('ytplayer', {
            width:  '100%',
            height: '100%',
            controls: 0,
            showinfo: 0,
            enablejsapi: true,
            videoId: uri.split(/\:/g)[2],
            playerVars: {
                controls: 0,
                disablekb: 1,
                html5: 1,
                enablejsapi: 1,
                iv_load_policy: 3,
                modestbranding: 1,
                showinfo: 0
            },
            events: {
                'onReady': this.onPlayerReady.bind(this),
                'onStateChange': this.onPlayerStateChange.bind(this)
            }
        });
    }
    onPlayerStateChange(event) {
        this.iframe = event.target.a;
        if (event.data === YT.PlayerState.PLAYING) {

            this.iframe.style.display = 'block';
        } else {

            this.iframe.style.display = 'none';
        }
        this.resize();

    }
    onPlayerReady(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
            setTimeout(stopVideo, 6000);
            done = true;
        }
        event.target.playVideo();

        this.player.seekTo(this.initialPosition, true);
    }
    seekTo(seconds) {
        if (!this.player) return;
        this.player.seekTo(seconds, true);
    }
    play() {
        if (!this.player) return;

    }
    pause() {
        if (!this.player) return;
    }
    stop() {
        if (!this.player) return;
        this.player.stopVideo();
    }
}
