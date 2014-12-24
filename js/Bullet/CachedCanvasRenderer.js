Bullet.CachedCanvasRenderer = function(){

    this.cache = {};
    this.element = document.createElement('canvas');
    this.context = this.element.getContext('2d');

    this.element.setAttribute('class', 'renderer');
    this.element.width = 1280;
    this.element.height = 960;

}

Bullet.CachedCanvasRenderer.prototype = {

    getElement: function(){
        return this.element;
    },

    generateCircle: function(basedColor, pixelSize){

        var canvas = document.createElement('canvas'),
            context = canvas.getContext('2d');

        canvas.width = canvas.height = pixelSize;

        var base = Bullet.Options.colorBase;

        var rgb = Bullet.Util.baseToRgb(basedColor, base),
            rgbString = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";

        var rasterSize = Bullet.Util.getRasterWidth(basedColor, base) * ((pixelSize) / 2),
            xOnCanvas = yOnCanvas = Math.floor(pixelSize / 2);

        context.beginPath();
        context.fillRect(0, 0, pixelSize, pixelSize);
        context.arc(xOnCanvas, yOnCanvas, rasterSize, 0, Math.PI * 2, false);
        context.fillStyle = rgbString;
        context.fill();
        context.closePath();

        return canvas;

    },

    render: function(encoderOutput){

        var matrix = encoderOutput.matrix,
            cols = encoderOutput.metadata.cols,
            pixelSize = Math.round(this.element.width / cols),
            pixelRadius = pixelSize / 2;

        pixelSize += pixelSize % 2;

        for(var pixelColor in matrix) {

            var pixelIndexArray = matrix[pixelColor];

            var context = this.context,
                cache = this.cache;

            var sourcePixel = cache[pixelColor];

            if (!sourcePixel) {
                sourcePixel = this.cache[pixelColor] = this.generateCircle(pixelColor, pixelSize);
            }

            var row, col, xOffset;

            for (var p = 0; p < pixelIndexArray.length; p++) {

                var pixelIndex = pixelIndexArray[p];

                // decode pixelIndex (find row and col)
                row = Math.floor(pixelIndex / cols);
                col = pixelIndex % cols;

                if (row % 2 === 0) {
                    xOffset = pixelRadius
                }

                var xOnCanvas = (col * pixelSize) + xOffset,
                    yOnCanvas = row * pixelSize;

                context.drawImage(sourcePixel, 0, 0, pixelSize, pixelSize, xOnCanvas, yOnCanvas, pixelSize, pixelSize);

                xOffset = 0;


            }

        }

    }
};