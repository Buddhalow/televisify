export default class TelevisionElement extends HTMLElement {
    connectedCallback() {
        if (!this.created) {
            this.services = [];
            this.innerHTML = '<div id="content" style="width: 100%; height: 100%"></div><img id="icon" style="opacity: 0.5; position: fixed; right: 25pt; top: 25pt; z-index: 10000" width="64pt">';
            this.services.push(new YouTubeService(this.querySelector('#content')));
            this.service = null;
            this.schedule = null;
            setInterval(this.tick.bind(this ), 1000);
            this.currentProgramme = null;
            this.attributeChangedCallback('src', null, this.getAttribute('src'));
            window.addEventListener('resize', (event) => {
                this.resize();
            });
            this.created = true
        }

    }
    resize() {
        if (this.service != null)
            this.service.resize();
    }
    getServiceByUri(uri) {
        for(var i = 0; i < this.services.length; i++) {
            var service = this.services[i];
            if (service.acceptsUri(uri)) {
                return service;
            }
        }
        return null;
    }
    tick() {
        var now = new Date();
        var nowTime = now.getTime();
        this.schedule.entries.forEach((entry) => {
            var uri = entry.video.src;
            var startTime = new Date(entry.time).getTime();
            if (startTime == nowTime) {
                debugger;
            }
            var endTime = ( entry.video.duration) * 1000;
            var range = startTime + endTime ;
            if (nowTime > startTime && (nowTime < range) && this.currentProgramme != uri) {
                var service = this.getServiceByUri(uri);
                this.service = service;
                var pos = (nowTime - startTime) / 1000;
                service.load(uri, pos);
                this.currentProgramme = uri;
            }
        })
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName == 'src') {
            fetch(newVal, {
                credentials: 'include',
                
            }).then((response) => {
                response.json().then((schedule) => {
                    this.schedule = schedule;

                    this.querySelector('#icon').src = schedule.icon;
                });
            });
        }
    }
}