![alt text](https://raw.githubusercontent.com/albincorreya/essentia.js-examples/blob/master/src/img/essentiajsbanner.png)

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)


[Status]: Under development! Unoptimized, use at your own risk.


## Setup

You can find the pre-compiled modules in the `build/` directory.

If you need to recompile the bindings, you can either use the docker or build everything from source on your local system.

### Using docker


```bash
docker pull acorreya/essentia-emscripten:2.1-beta6-dev
```
- Run `build-bindings.sh` inside the docker image.


### Building from source


* Install emscripten https://emscripten.org/docs/getting_started/downloads.html.

* Compile essentia library with emscripten compiler. Check essentia documentation https://essentia.upf.edu/documentation/installing.html#compiling-essentia for more details.


```bash
# configure build settings for essentia using kissfft
emconfigure sh -c './waf configure --prefix=$EMSCRIPTEN/system/local/ --build-static --lightweight= --fft=KISS --emscripten'

# compile and build essentia
emmake ./waf

# (you might need sudo rights)
emmake ./waf install

```

* Build essentiamin.js module and the bindings.

```bash
emconfigure sh -c './build-bindings.sh'
```
Check the bash script for the intermediate steps.


OR 


## Usage

### Examples

- Usage in JavaScript


Eg: The follwing code block shows a few examples on how to use essentia.js. 

```html
<html lang="en">
  <script>

    var Module = {
        onRuntimeInitialized: function() {

            console.log("Essentia module loaded succesfuly ...");
            // get version of essentia used for this build
            console.log(Module.getEssentiaVersion());

            var frameSize = 1024;
            var hopSize = 1024;
            var signalArray = new Float32Array(audioBuffer); // get audio buffer from the audio context of web audio api

            var signal = typedFloat32ArrayVec(signalArray);

            var windowing = "hann";
            // generate overlapping windows frames of a given audio signal (usefull for framewise processing)
            var frames = Module.frameGenerator(signal, frameSize, hopSize, windowing);

            var toSmooth = false;
            // compute the hpcp chroma features for each audio frame
            for (var i=0; i<frames.size(); i++) {
                var hpcp = Module.hpcp(frames.get(i), toSmooth);
            }

            // compute logMelBands for the given audio signal
            var melBands = Module.logMelBandsExtractor(signal, frameSize, hopSize);
            
            // compute predominant melody contour from monophonic/polyphonic music signal using melodia alogirithm
            var pitches = new Module.VectorFloat();
            var pitchConfidence = new Module.VectorFloat();
            // fill the vectors with the output
            Module.predominantPitchMelodiaExtractor(signal, pitches, pitchConfidence);

            // if you want to enable essentia debugging mode 
            Module.initEssentia(true);

            // shutdown the essentia instance if you no longer need.
            Module.shutdownEssentia();
    
        }
    };
  </script>
  <head>
      <script src="web/dist/essentiamin.js"></script>
      <script>
            // function to convert javascript float 32 typed array to a std::vector<float>
            typedFloat32Array2Vec = function(typedArray) {

                var vec = new Module.VectorFloat();
                for (var i=0; i<typedArray.length; i++) {
                    if (typeof typedArray[i] === 'undefined') {
                        vec.push_back(0);
                    }
                    else {
                        vec.push_back(typedArray[i]);
                    }
                }
                return vec;
            }
      </script>
  </head>
</html>
```

## Web demos

```bash
./server.sh
```
