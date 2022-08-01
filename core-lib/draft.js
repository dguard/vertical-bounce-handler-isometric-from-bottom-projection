let canvas = document.querySelector('.statement-area').querySelector('.statement-at-front').querySelector('#scene')
let ctx = canvas.getContext('2d')

canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight

if(window.devicePixelRatio > 1) {
    canvas.width = canvas.clientWidth * 2
    canvas.height = canvas.clientHeight * 2

    ctx.scale(2, 2)
}

let width = canvas.clientWidth
let height = canvas.clientHeight

// kk
let Fabrick = function () {
    let that = this

    /* debth */
    that.constructKnot = function (w, h, d, f) {
        return new RectangleOnPaper(w, h, d, f)
    }
}
let Pencil = function () {
    let that = this

    let dict = {}
    let queue = []

    that.remember = function (knot) {
        dict[knot] = knot
        queue.push(knot)
    }
    that.put = function (knot, y, x, z) {
        if(dict[knot]) {
            dict[knot].assignCoordinates(y, x, z)
        }
    }

    that.draw = function () {
        for(let i = 0; i < queue.length; i++) {
            queue[i].draw()
        }
    }
}

let RectangleOnPaper = function (w, profileRatio, debthRatio, frontRatio) {
    let that = this

    let frontRadius = w

    let verticles = [[parseFloat('0'), parseFloat('0'), parseFloat('0')], [parseFloat('0'), 1, parseFloat('0')], [[1, '-'].reverse().join(''), 1, parseFloat('0')], [[1, '-'].reverse().join(''), parseFloat('0'), parseFloat('0')], [[1, '-'].reverse().join(''), parseFloat('0'), 1], [parseFloat('0'), parseFloat('0'), 1], [[1, '-'].reverse().join(''), 1, 1], /* take back - that's mine [[1, '-'].reverse().join(''), parseFloat('0'), 1] */ [[1, '-'].reverse().join(''), parseFloat('0'), 1] ]
    let lines = [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 0], [2, 6], [6, 7]]

    let FIELD_OF_VIEW = width * 0.8
    let PROJECTION_CENTER_Y = width * 0.5
    let PROJECTION_CENTER_X = width * 0.5

    that.assignCoordinates = function (y, x, z) {
        that.y = y
        that.x = x
        that.z = z
    }

    that.project = function (y, x, z) {
        let sizeProjection = FIELD_OF_VIEW / (FIELD_OF_VIEW + z)

        return {
            sizeProjection: sizeProjection,
            y: (sizeProjection * y) + PROJECTION_CENTER_Y,
            x: (sizeProjection * x) + PROJECTION_CENTER_X
        }
    }

    let bouncedPoints = {}

    let sequencedPoints = {}
    let latestSequencedPointer
    let anotherSequencePointer
    let restPointer
    let remainingPointer

    let bottomProjectionPointer
    let topLeftProjectionPointer
    let topRightProjectionPointer


    that.draw = function () {
        debugger
        for(let i = 0; i < lines.length; i++) {
            let radius = frontRadius
            let y, x

            let v1 = {
                y: that.y + (radius * verticles[lines[i][0]][0]),
                x: that.x + (radius * verticles[lines[i][0]][1]),
                z: that.z + (radius * verticles[lines[i][0]][2])
            }
            let v2 = {
                y: that.y + (radius * verticles[lines[i][1]][0]),
                x: that.x + (radius * verticles[lines[i][1]][1]),
                z: that.z + (radius * verticles[lines[i][1]][2])
            }

            let v1Project = that.project(v1.y, v1.x, v1.z)
            let v2Project = that.project(v2.y, v2.x, v2.z)

            // keep

            if([2].indexOf(i) !== -1) {
                bouncedPoints[[v1Project.y, v1Project.x].join('_')] = {
                    y: (v1Project.y - PROJECTION_CENTER_Y) * profileRatio + PROJECTION_CENTER_Y,
                    x: (v1Project.x - PROJECTION_CENTER_X) * frontRatio + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v1Project.y, v1Project.x].join('_')].y
                x = bouncedPoints[[v1Project.y, v1Project.x].join('_')].x

                v1Project.y = y
                v1Project.x = x

                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: (v2Project.y - PROJECTION_CENTER_Y) * profileRatio + PROJECTION_CENTER_Y,
                    x: (v2Project.x - PROJECTION_CENTER_X) * 1 + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x

                v2Project.y = y
                v2Project.x = x

                sequencedPoints[i] = {
                    "v1Project": v1Project,
                    "v2Project": v2Project
                }
            }
            if([0].indexOf(i) !== -1) {
                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: (v2Project.y - PROJECTION_CENTER_Y) * 1 + PROJECTION_CENTER_Y,
                    x: (v2Project.x - PROJECTION_CENTER_X) * frontRatio + PROJECTION_CENTER_X
                }
                y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x

                v2Project.y = y
                v2Project.x = x
            }

            if([6].indexOf(i) !== -1) {
                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: ((sequencedPoints[anotherSequencePointer].v2Project.y - PROJECTION_CENTER_Y)) + PROJECTION_CENTER_Y,
                    x: ((sequencedPoints[anotherSequencePointer].v2Project.x - PROJECTION_CENTER_X)) + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v1Project.y, v1Project.x].join('_')].y
                x = bouncedPoints[[v1Project.y, v1Project.x].join('_')].x

                v1Project.y = y
                v1Project.x = x

                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: (v2Project.y - PROJECTION_CENTER_Y) * 1 + PROJECTION_CENTER_Y,
                    x: (v2Project.x - PROJECTION_CENTER_X) * 1 + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x

                v2Project.y = y
                v2Project.x = x

                sequencedPoints[i] = {
                    "v1Project": v1Project,
                    "v2Project": v2Project
                }
                bottomProjectionPointer = i
            }
            if([4].indexOf(i) !== -1) {
                bouncedPoints[[v1Project.y, v1Project.x].join('_')] = {
                    y: (v1Project.y - PROJECTION_CENTER_Y) * profileRatio + PROJECTION_CENTER_Y,
                    x: (v1Project.x - PROJECTION_CENTER_X) * 1 + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v1Project.y, v1Project.x].join('_')].y
                x = bouncedPoints[[v1Project.y, v1Project.x].join('_')].x

                v1Project.y = y
                v1Project.x = x

                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: (v2Project.y - PROJECTION_CENTER_Y) * debthRatio + PROJECTION_CENTER_Y,
                    x: (v2Project.x - PROJECTION_CENTER_X) * debthRatio + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x

                v2Project.y = y
                v2Project.x = x

                sequencedPoints[i] = {
                    "v1Project": v1Project,
                    "v2Project": v2Project
                }
                v1Project = undefined
                v2Project = undefined

                restPointer = i
            }

            if([5].indexOf(i) !== -1) {
                bouncedPoints[[v1Project.y, v1Project.x].join('_')] = {
                    y: (v1Project.y - PROJECTION_CENTER_Y) * debthRatio + PROJECTION_CENTER_Y,
                    x: (v1Project.x - PROJECTION_CENTER_X) * debthRatio + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v1Project.y, v1Project.x].join('_')].y
                x = bouncedPoints[[v1Project.y, v1Project.x].join('_')].x

                v1Project.y = y
                v1Project.x = x

                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: ((sequencedPoints[latestSequencedPointer].v2Project.y - PROJECTION_CENTER_Y) + v2Project.y - PROJECTION_CENTER_Y) * debthRatio + PROJECTION_CENTER_Y,
                    x: (v2Project.x - PROJECTION_CENTER_X) * debthRatio + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x

                v2Project.y = y
                v2Project.x = x

                sequencedPoints[i] = {
                    "v1Project": v1Project,
                    "v2Project": v2Project
                }

                v1Project = undefined
                v2Project = undefined

                anotherSequencePointer = i
            }
            if([3].indexOf(i) !== -1) {
                bouncedPoints[[v1Project.y, v1Project.x].join('_')] = {
                    y: (v1Project.y - PROJECTION_CENTER_Y) * profileRatio + PROJECTION_CENTER_Y,
                    x: (v1Project.x - PROJECTION_CENTER_X) * 1 + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v1Project.y, v1Project.x].join('_')].y
                x = bouncedPoints[[v1Project.y, v1Project.x].join('_')].x

                v1Project.y = y
                v1Project.x = x

                // keep
                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: (v2Project.y - PROJECTION_CENTER_Y) * 1 + PROJECTION_CENTER_Y,
                    x: (v2Project.x - PROJECTION_CENTER_X) * 1 + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x

                v2Project.y = y
                v2Project.x = x

                sequencedPoints[i] = {
                    "v1Project": v1Project,
                    "v2Project": v2Project
                }
                latestSequencedPointer = i
            }
            if([1].indexOf(i) !== -1) {
                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: (v2Project.y - PROJECTION_CENTER_Y) * profileRatio + PROJECTION_CENTER_Y,
                    x: (v2Project.x - PROJECTION_CENTER_X) * frontRatio + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x

                v2Project.y = y
                v2Project.x = x

                bouncedPoints[[v1Project.y, v1Project.x].join('_')] = {
                    y: (v1Project.y - PROJECTION_CENTER_Y) + PROJECTION_CENTER_Y,
                    x: (v1Project.x - PROJECTION_CENTER_X) * frontRatio + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v1Project.y, v1Project.x].join('_')].y
                x = bouncedPoints[[v1Project.y, v1Project.x].join('_')].x

                v1Project.y = y
                v1Project.x = x
            }

            if([7].indexOf(i) !== -1) {
                v1Project = undefined
                v2Project = undefined
            }
            if([8].indexOf(i) !== -1) {
                v1Project = undefined
                v2Project = undefined
            }

            if(v1Project && v2Project) {
                // keep
            } else {
                continue
            }

            ctx.beginPath()
            ctx.moveTo(v1Project.x, v1Project.y)
            ctx.lineTo(v2Project.x, v2Project.y)

            ctx.stroke()
        }


        for(let i = 0; i < lines.length; i++) {
            let radius = frontRadius
            let y, x

            let v1 = {
                y: that.y + (radius * verticles[lines[i][0]][0]),
                x: that.x + (radius * verticles[lines[i][0]][1]),
                z: that.z + (radius * verticles[lines[i][0]][2])
            }
            let v2 = {
                y: that.y + (radius * verticles[lines[i][1]][0]),
                x: that.x + (radius * verticles[lines[i][1]][1]),
                z: that.z + (radius * verticles[lines[i][1]][2])
            }

            let v1Project = that.project(v1.y, v1.x, v1.z)
            let v2Project = that.project(v2.y, v2.x, v2.z)

            if([2].indexOf(i) !== -1) {
                continue
            }
            if([0].indexOf(i) !== -1) {
                continue
            }

            if([6].indexOf(i) !== -1) {
                continue
            }
            if([4].indexOf(i) !== -1) {
                bouncedPoints[[v1Project.y, v1Project.x].join('_')] = {
                    y: (v1Project.y - PROJECTION_CENTER_Y) * profileRatio + PROJECTION_CENTER_Y,
                    x: (v1Project.x - PROJECTION_CENTER_X) * 1 + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v1Project.y, v1Project.x].join('_')].y
                x = bouncedPoints[[v1Project.y, v1Project.x].join('_')].x

                v1Project.y = y
                v1Project.x = x

                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: (sequencedPoints[bottomProjectionPointer].v1Project.y - PROJECTION_CENTER_Y - frontRadius * profileRatio) + PROJECTION_CENTER_Y,
                    x: (sequencedPoints[bottomProjectionPointer].v1Project.x - PROJECTION_CENTER_X) * 1 + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x

                v2Project.y = y
                v2Project.x = x

                sequencedPoints[i] = {
                    "v1Project": v1Project,
                    "v2Project": v2Project
                }
                topLeftProjectionPointer = i
            }


            if([5].indexOf(i) !== -1) {
                bouncedPoints[[v1Project.y, v1Project.x].join('_')] = {
                    y: (sequencedPoints[topLeftProjectionPointer].v2Project.y - PROJECTION_CENTER_Y) + PROJECTION_CENTER_Y,
                    x: (sequencedPoints[topLeftProjectionPointer].v2Project.x - PROJECTION_CENTER_X) + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v1Project.y, v1Project.x].join('_')].y
                x = bouncedPoints[[v1Project.y, v1Project.x].join('_')].x

                v1Project.y = y
                v1Project.x = x

                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: (sequencedPoints[bottomProjectionPointer].v1Project.y - PROJECTION_CENTER_Y) + PROJECTION_CENTER_Y,
                    x: (sequencedPoints[bottomProjectionPointer].v1Project.x - PROJECTION_CENTER_X) + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x

                v2Project.y = y
                v2Project.x = x

                sequencedPoints[i] = {
                    "v1Project": v1Project,
                    "v2Project": v2Project
                }

                anotherSequencePointer = i
            }
            if([3].indexOf(i) !== -1) {
                continue
            }
            if([1].indexOf(i) !== -1) {
                continue
            }

            if([7].indexOf(i) !== -1) {
                bouncedPoints[[v1Project.y, v1Project.x].join('_')] = {
                    y: (v1Project.y - PROJECTION_CENTER_Y) * profileRatio + PROJECTION_CENTER_Y,
                    x: (v1Project.x - PROJECTION_CENTER_X) * frontRatio + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v1Project.y, v1Project.x].join('_')].y
                x = bouncedPoints[[v1Project.y, v1Project.x].join('_')].x

                v1Project.y = y
                v1Project.x = x

                // let me see
                // bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                //     y: (v2Project.y - PROJECTION_CENTER_Y) * debthRatio + PROJECTION_CENTER_Y,
                //     x: (v2Project.x - PROJECTION_CENTER_X) + PROJECTION_CENTER_X
                // }
                //
                // y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                // x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x
                //
                // v2Project.y = y
                // v2Project.x = x
                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: (sequencedPoints[topLeftProjectionPointer].v2Project.y - PROJECTION_CENTER_Y) + PROJECTION_CENTER_Y,
                    x: (v1Project.x - PROJECTION_CENTER_X - (sequencedPoints[topLeftProjectionPointer].v1Project.x - sequencedPoints[topLeftProjectionPointer].v2Project.x)) + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x

                v2Project.y = y
                v2Project.x = x

                sequencedPoints[i] = {
                    "v1Project": v1Project,
                    "v2Project": v2Project
                }
                topRightProjectionPointer = i
            }
            if([8].indexOf(i) !== -1) {
                bouncedPoints[[v1Project.y, v1Project.x].join('_')] = {
                    y: (sequencedPoints[topRightProjectionPointer].v2Project.y - PROJECTION_CENTER_Y) + PROJECTION_CENTER_Y,
                    x: (sequencedPoints[topRightProjectionPointer].v2Project.x - PROJECTION_CENTER_X) + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v1Project.y, v1Project.x].join('_')].y
                x = bouncedPoints[[v1Project.y, v1Project.x].join('_')].x

                v1Project.y = y
                v1Project.x = x

                bouncedPoints[[v2Project.y, v2Project.x].join('_')] = {
                    y: (sequencedPoints[topLeftProjectionPointer].v2Project.y - PROJECTION_CENTER_Y) + PROJECTION_CENTER_Y,
                    x: (sequencedPoints[topLeftProjectionPointer].v2Project.x - PROJECTION_CENTER_X) + PROJECTION_CENTER_X
                }

                y = bouncedPoints[[v2Project.y, v2Project.x].join('_')].y
                x = bouncedPoints[[v2Project.y, v2Project.x].join('_')].x

                v2Project.y = y
                v2Project.x = x
            }

            if(v1Project && v2Project) {
                // keep
            } else {
                continue
            }

            ctx.beginPath()
            ctx.moveTo(v1Project.x, v1Project.y)
            ctx.lineTo(v2Project.x, v2Project.y)

            ctx.stroke()
        }
    }
}

let radius = Math.floor(Math.random() * 12 /*+ 10*/ * 10 * 2)

let fabrick = new Fabrick()
let pencil = new Pencil()

let knot1 = fabrick.constructKnot(radius, 0.9, 0.4, 2)

pencil.remember(knot1)
pencil.put(knot1, Math.random() * width * 0.5, Math.random() * width * 0.5, Math.random() * width * 0.2)

pencil.draw()