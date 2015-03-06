var main = function() {

    var canvas = new Canvas(document.querySelector('.canvas'), 500, 500, 'white');


    /**
     * Velocity Slider
     */
    var velocitySlider = document.getElementById('velocitySlider');

    var computeVelocityInMs = function(max, currentValue) {
        return max - (currentValue - 1);
    };

    var velocity = function() {
        var max = document.getElementById('velocityInput').getAttribute('max');
        var current = getSliderValue(velocitySlider);

        return computeVelocityInMs(max, current);
    };

    var accuracySlider = document.getElementById('accuracySlider');
    var marginOfError = Math.pow(0.1, getSliderValue(accuracySlider));
    var calculator = new Calculator(marginOfError, 4, canvas, 'rgb(55, 137, 13)', 'rgb(137, 9, 139)', 'rgb(255, 0, 0)');
    var benchmarkCalculator = new Calculator(marginOfError, 4, canvas, 'rgb(55, 137, 13)', 'rgb(137, 9, 139)', 'rgb(255, 0, 0)');
    var render = null;
    var started = false;
    var progressBarValue = 0;
    var progressBar = document.getElementById('progressBar');

    displaySlider(velocitySlider);
    displaySlider(accuracySlider);

    var stopButton = document.getElementById('stopButton');
    stopButton.onclick = function() {

        if (started) {
            window.clearInterval(render);
            started = false;
        }

    };

    var startButton = document.getElementById('startButton');
    startButton.onclick = function() {

        if (!started) {
            render = setInterval( function() { loop(calculator); }, velocity());
            started = true;
        } else {
            window.clearInterval(render);
            render = setInterval(function() { loop(calculator); }, velocity());
            started = true;
        }

    };

    var clearButton = document.getElementById('restartButton');
    clearButton.onclick = function() {

        if (started) {
            window.clearInterval(render);
        }

        canvas.clear();
        calculator.clear();
        progressBarValue = 0;

        render = setInterval(function() { loop(calculator); }, velocity());
        started = true;

    };

    var benchButton = document.getElementById('benchmarkButton');
    benchButton.onclick = function() {
        marginOfError = Math.pow(0.1, getSliderValue(accuracySlider));
        var start = new Date().getTime();
        var approx = benchmarkCalculator.benchmark(marginOfError, false);
        var end = new Date().getTime();
        var time = end - start;
        displayPrompt(document.getElementById('bechmarkTime'), time);
        displayMeasurePrompts(benchmarkCalculator);
    };

    var benchRecursiveButton = document.getElementById('benchmarkRecursiveButton');
    benchRecursiveButton.onclick = function() {
        marginOfError = Math.pow(0.1, getSliderValue(accuracySlider));
        var start = new Date().getTime();
        var approx = benchmarkCalculator.benchmark(marginOfError, true);
        var end = new Date().getTime();
        var time = end - start;
        displayPrompt(document.getElementById('bechmarkTime'), time);
        displayMeasurePrompts(benchmarkCalculator);
    };

    /**
     * Thanks to Max Beier, we provide a download of the current canvas.
     */
    var downloadButton = document.getElementById('pngDownloadButton');
    downloadButton.onclick = function() {
        var canvas = document.getElementById('canvas');
        downloadButton.setAttribute('href', canvas.toDataURL("image/png"));
    };

    var loop = function(calculator) {
        marginOfError = Math.pow(0.1, getSliderValue(accuracySlider));
        calculator.makeFrame(render, marginOfError);
        progressBarValue = progressBarValue < calculator.calculateProgress() ? calculator.calculateProgress() : progressBarValue;
        displayProgressBar(progressBar, progressBarValue);
        displayMeasurePrompts(calculator);
    };

};

main();

