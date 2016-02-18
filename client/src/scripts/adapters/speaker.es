import { Deferred } from 'jquery-deferred';
import NetworkAdapter from './network_adapter';
import Constants from '../constants/constants';
import AudioVisualizator from '../renderer/audio_visualizator';

class Speaker {

    speak(url) {
        const dfd = new Deferred();

        const context = new AudioContext();
        let sound;

        NetworkAdapter.getSound(url).then( (response) => {
            context.decodeAudioData(response, (buffer) => {

                sound = buffer;
                const playSound = context.createBufferSource();
                playSound.buffer = sound;
                playSound.connect(context.destination);

                setTimeout(AudioVisualizator.renderAudio({
                    source: playSound,
                    context
                }), 0);
                playSound.start(0);
                dfd.resolve();
            });

        });

        return dfd.promise();
    }

    // COMMANDS
    greeting(data) {
        const dfd = new Deferred();

        NetworkAdapter.getSoundUrl(Constants.SpeakAudioTemplates.GREETING.replace('${name}', data.name)).then((data) => {
            this.speak(data.snd_url).then(() => {
                dfd.resolve();
            });
        });

        return dfd.promise();
    }

    parting(data) {
        const dfd = new Deferred();

        NetworkAdapter.getSoundUrl(Constants.SpeakAudioTemplates.PARTING.replace('${name}', data.name)).then((data) => {
             this.speak(data.snd_url).then(() => {
                dfd.resolve();
             });
        });

        return dfd.promise();
    }
}

const speaker = new Speaker();

export default speaker;
