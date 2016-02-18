import Constants from '../constants/constants';

class AudioVisualizator {
    constructor () {
        this.ctx = null;
        this.now = Date.now();

        this.context = null;
        this.analyser = null;
        this.source = null;

        this.stop = false;

        this.maxMagnitude = 600 * 255;
    }

    animate = () => {
        window.requestAnimationFrame(() => {

            if (!this.stop) {
                this.animate();
            }

        });


        const now = Date.now();
        let waveformArray;

        // redraw
        if (now - this.now >= Constants.DRAW_INTERVAL) {
            waveformArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(waveformArray);
        }

        this.renderCircles(waveformArray);
    };

    renderCircles = (waveformArray) => {
        let totals = [];
        let ratio;
        let totalMagnitude = 0;

        // set background color
        this.ctx.fillStyle = 'rgba(18, 18, 29, 1)';
        this.ctx.fillRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);

        for (let i = 0; i < Constants.CIRCLES_COUNT; i++) {

            totals[i] = {
                magnitude: 0
            };

            for (let j = 0; j < (1024 / (i + 1)); j++) {
                totals[i].magnitude += waveformArray[j];
            }

            totals[i].ratio = totals[i].magnitude / (this.maxMagnitude / Constants.CIRCLES_COUNT);
            totals[i].strength = totals[i].ratio * Constants.CANVAS_HEIGHT / Constants.CIRCLES_COUNT;

            this.ctx.strokeStyle = 'hsla(' + Constants.CANVAS_HUE + ', 50%, 50%, ' + ((1 / Constants.CIRCLES_COUNT) + 0.1) + ')';
            this.ctx.fillStyle = 'hsla(' + Constants.CANVAS_HUE + ', 50%, 50%, ' + (1 / Constants.CIRCLES_COUNT) + ')';
            this.ctx.beginPath();
            this.ctx.arc(Constants.CANVAS_WIDTH / 2, Constants.CANVAS_HEIGHT / 2, totals[i].strength, 0, Math.PI * 2, true);
            this.ctx.stroke();
            this.ctx.fill();

            totalMagnitude += totals[i].magnitude;
        }

        ratio = totalMagnitude / this.maxMagnitude;
        this.ctx.fillStyle = 'hsla(' + Constants.CANVAS_HUE + ', 50%, 50%, ' + (0.005 * ratio) + ')';
        this.ctx.fillRect(0, 0, Constants.CANVAS_WIDTH, Constants.CANVAS_HEIGHT);
    };


    /*
        * source - audioBufferSourceNode
        * context - AudioContext
    */
    renderAudio({ source, context }) {
        this.context = context;
        this.source = source;

        this.analyser = this.context.createAnalyser();
        this.source.connect(this.analyser);

        this.stop = false;
        this.animate();
    }

    stopRenderAudio() {
        this.stop = true;
    }

    setCanvas(canvas) {
        this.ctx = canvas.getContext('2d');
        this.ctx.canvas.width = Constants.CANVAS_WIDTH;
        this.ctx.canvas.height = Constants.CANVAS_HEIGHT;
    }

    removeCanvas() {
        this.ctx = null;
        this.context = null;
        this.analyser = null;
        this.source = null;
    }
}

const audioVisualizator = new AudioVisualizator();
export default audioVisualizator;