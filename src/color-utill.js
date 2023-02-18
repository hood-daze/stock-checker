export class ColorUtill {
    static GREEN_COLOR_CODE = '#a3f7bf';
    static RED_COLOR_CODE = '#f87979';
    static BLUE_COLOR_CODE = '#a1caf1';
    static SCARRET_COLOR_CODE = '#ab3f5b';

    static transparentize(hex, opacity) {
        hex = hex.replace('#', '');
        var r = parseInt(hex.substring(0, 2), 16);
        var g = parseInt(hex.substring(2, 4), 16);
        var b = parseInt(hex.substring(4, 6), 16);
        return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
    }
}