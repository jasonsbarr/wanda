/**
 * @class
 * @desc Source location info for a token
 * @property {number} pos
 * @property {number} line
 * @property {number} col
 * @property {string} file
 */
export class SrcLoc {
    /**
     * Constructs an SrcLoc object
     * @param {number} pos
     * @param {number} line
     * @param {number} col
     * @param {string} file
     */
    constructor(pos, line, col, file) {
        this.pos = pos;
        this.line = line;
        this.col = col;
        this.file = file;
    }

    /**
     * Static constructor for SrcLoc class
     * @param {number} pos
     * @param {number} line
     * @param {number} col
     * @param {string} file
     */
    static new(pos, line, col, file) {
        return new SrcLoc(pos, line, col, file);
    }
}
