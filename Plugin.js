$.fn.connect_4 = function (options) {

    let player_1 = options['player_1']
    let player_2 = options['player_2']

    this.parent().css('margin', 'auto')
    this.css({
        'display': 'flex',
        'justify-content': 'center',
    })
    this.html('')
    this.append('<div id="grille"></div>')
    this.append('<div id="infos_jeu"></div>')
    this.children('#grille').css({
        'display': 'grid',
        'width': '60vw',
        'height': '80vh',
        'grid-template-columns': 'repeat(' + options["y"] + ', 1fr)'
    })
    let width_case = window.getComputedStyle(this.children('#grille')[0]).getPropertyValue("width").slice(0, -2) / options["y"]
    this.children('#infos_jeu').css({
        'display': 'block',
        'text-align': 'center',
        'color': 'white',
        'width': '40vw',
        'height': '80vh'

    })
    let color1 = hexToRgb(options['color_1'])
    color1 = "rgb(" + color1['r'] + "," + color1['g'] + "," + color1['b'] + ")"
    let values_c1 = color1.slice(4, -1).split(',')
    let count_light_values = 0;
    let count_dark_values = 0;
    let count_middle_values = 0;
    values_c1.forEach(element => {
        if (element > 210) {
            count_light_values++
        }
        else if (element < 45) {
            count_dark_values++;
        }
        else if (110 < element && element < 150) {
            count_middle_values++
        }
    });
    if (count_light_values == 3) {
        color_1 = "rgb(210,210,210)";
        $210 = true;
    }
    else {
        color_1 = color1;
        $210 = false;
    }
    // console.log(values_c1)
    let color2 = hexToRgb(options['color_2'])
    color2 = "rgb(" + color2['r'] + "," + color2['g'] + "," + color2['b'] + ")"
    let values_c2 = color2.slice(4, -1).split(',')
    // console.log(values_c2)
    count_light_values = 0
    let n = 0
    let to_close = 0
    values_c2.forEach(element => {
        if ($210 == true && element > 170) {
            to_close++
        }
        else if (element > 210) {
            count_light_values++
            if (210 - values_c1[n] < 45 && 210 - values_c1[n] >= -45) {
                to_close++
            }
        }
        else {
            if (element - values_c1[n] < 45 && element - values_c1[n] > -45) {
                to_close++
            }
        }
        n++
    });
    if (count_light_values == 3) {
        color_2 = "rgb(210,210,210)";
    }
    else {
        color_2 = color2;
    }
    if (to_close == 3) {
        if (count_dark_values == 3) {
            color_2 = "rgb(210,210,210)"
            // $('#player_turn')[0].css('background-color', 'rgb(0,255,0)')
        }
        else if (count_middle_values == 3) {
            color_2 = "rgb(0,0,0)"
        }
        else {
            color_2 = hexToRgb(invert(color_2));
            color_2 = "rgb(" + color_2['r'] + "," + color_2['g'] + "," + color_2['b'] + ")"
        }
    }
    this.children('#infos_jeu').append('<p id="player_turn"></p>')
    this.children('#infos_jeu').append('<p id="score_display"><span style="color:' + color_1 + '">' + player_1 + '</span> ' + game.score_1 + ' - ' + game.score_2 + ' <span style="color:' + color_2 + '">' + player_2 + '</span></p>')
    this.children('#infos_jeu').append('<p id="next_game" class="button" onclick="game.new_game()">New Game</p>')
    $('#next_game')[0].style.pointerEvents = 'none'
    this.children('#infos_jeu').append('<p id="remove_last" class="button"><span id="visible">Remove last<span></p>')
    $('#remove_last').click(function () {
        remove_last()
    })
    let checked_AI = game.AI_bool ? 'checked' : ''
    let checked_Help = game.AI_help ? 'checked' : ''
    let AI_disable = game.AI_bool || game.AI_help ? '' : 'disabled'
    let Help1 = game.AI_lvl == 1 ? 'selected' : ''
    let Help2 = game.AI_lvl == 2 ? 'selected' : ''
    let Help3 = game.AI_lvl == 3 ? 'selected' : ''
    this.children('#infos_jeu').append('<section id="form">'
        + '<label for="x_value">Number of rows : <span>' + options['x'] + '</span></label>'
        + '<input type="range" class="range" id="x_value" name="x_value" value="' + options['x'] + '" min="6" max="11" step="1">'
        + '<label for="y_value">Number of columns : <span">' + options['y'] + '</span></label>'
        + '<input type="range" class="range" id="y_value" name="y_value" value="' + options['y'] + '" min="7" max="13" step="1">'
        + '<label for="P1_name">Player 1\'s name (max 14) : </label>'
        + '<input type="text" value="' + player_1 + '" name="P1_name" id="P1_name" maxlength="14">'
        + '<label for="P2_name">Player 2\'s name (max 14) : </label>'
        + '<input type="text" value="' + player_2 + '" name="P2_name" id="P2_name" maxlength="14">'
        + '<label for="P1_color">Player 1\'s color : </label>'
        + '<input type="color" class="color" id="P1_color" name="P1_color" value="' + rgbToHex(parseInt(color_1.slice(4, -1).split(',')[0]), parseInt(color_1.slice(4, -1).split(',')[1]), parseInt(color_1.slice(4, -1).split(',')[2])) + '">'
        + '<label for="P2_color">Player 2\'s color : </label>'
        + '<input type="color" class="color" id="P2_color" name="P2_color" value="' + rgbToHex(parseInt(color_2.slice(4, -1).split(',')[0]), parseInt(color_2.slice(4, -1).split(',')[1]), parseInt(color_2.slice(4, -1).split(',')[2])) + '">'
        + '<label for="boardColor">Board\'s Color : </label>'
        + '<input type="color" class="color" id="Board_color" name="boardcolor" value="' + game.color_board + '">'
        + '<label for="AI">AI (player 2)</label>'
        + '<input type=checkbox name="AI" id="AI" class="AI" ' + checked_AI + '>'
        + '<label for="AI_help">AI support</label>'
        + '<input type=checkbox name="AI_help" id="AI_help" class="AI" ' + checked_Help + '>'
        + '<label for="AI_level">AI level</label>'
        + '<select name="AI_level" id="AI_level" ' + AI_disable + '>'
        + '<option value="1"' + Help1 + '>1</option>'
        + '<option value="2"' + Help2 + '>2</option>'
        + '<option value="3"' + Help3 + '>3</option>'
        + '</select>'
        + '<button id="reset">Reset</button>'
        + '</section>')
    $('#form').css({
        "padding": "10px 0",
        "display": "grid",
        "grid-template-columns": "repeat(2,1fr)",
        "grid-row-gap": "10px",
        "background-color": "rgb(134,134,134)",
        "border": "4px solid black",
        "border-radius": "5px",
        "width": '75%',
        "margin": 'auto',
    })
    $('#form').children().css("margin", "auto")
    $('#form').children('input').css({
        "width": "60%",
    })
    $('#form').children('button').css({
        "width": "50px",
        "grid-column": "1 / 3"
    })
    $('.color').css({
        "width": "13%"
    })
    $('.range').mousemove((e) => {
        e.target.previousSibling.children[0].innerHTML = e.target.value
    })
    $('.range').mouseup((e) => {
        e.target.previousSibling.children[0].innerHTML = e.target.value
    })
    $('.AI').change(() => {
        if ($('#AI')[0].checked || $('#AI_help')[0].checked) {
            $('#AI_level')[0].disabled = false
        }
        else {
            $('#AI_level')[0].disabled = true
        }
    })
    $('#reset').click(() => {
        game = new Four_in_a_row(
            parseInt($('#x_value')[0].value), // x (min 6, max 11)
            parseInt($('#y_value')[0].value), // y (min 7, max 13)
            $('#P1_color')[0].value, // Player 1 color
            $('#P2_color')[0].value, // Player 2 color
            $('#Board_color')[0].value, // Board color
            $('#P1_name')[0].value, // Player 1 name
            $('#P2_name')[0].value, // Player 2 name
            $('#AI_help')[0].checked, // AI help, according to AI help
            $('#AI_level')[0].value, // AI lvl (1 to 3)
            $('#AI')[0].checked // If true, Player 2 will be an AI
        )
        game.new_game()
        alert("The settings have been reset")
    })
    this.children('#infos_jeu').children('p').css({
        'margin': '30px auto',
        'padding': '10px',
        'min-width': 'max-content',
        'max-height': '40px',
        'background-color': 'black',
        'width': '25%'
    })
    this.children('#infos_jeu').children('.button').css({
        'background-color': 'rgb(65,65,65)',
        'border-radius': '50%',
        'cursor': 'pointer'
    })
    $('#visible').css('visibility', 'hidden')
    $('#remove_last').css("background-color", "rgb(255,255,255)")
    $('#remove_last').mouseover(() => {
        $('#visible').css('visibility', 'visible')
        $('#remove_last').css("background-color", "rgb(65,65,65)")
        $('#remove_last').mouseleave(() => {
            $('#visible').css('visibility', 'hidden')
            $('#remove_last').css("background-color", "rgb(255,255,255)")
        })
    })

    for ($j = 1; $j <= options['y']; $j++) {
        this.children("#grille").append('<canvas id="arrow' + $j + '" class="arrow" width=' + width_case + 'px height=' + window.getComputedStyle($('#grille')[0]).getPropertyValue("height").slice(0, -2) / options["x"] + '"></canvas>')
        $('#arrow' + $j).css('cursor', 'pointer')
        var canvas = document.getElementById('arrow' + $j);
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = 'goldenrod'
            ctx.beginPath();
            ctx.moveTo(window.getComputedStyle($('#arrow' + $j)[0]).getPropertyValue("width").slice(0, -2) * 2 / 5, window.getComputedStyle($('#arrow' + $j)[0]).getPropertyValue("height").slice(0, -2) / 3);
            ctx.lineTo(window.getComputedStyle($('#arrow' + $j)[0]).getPropertyValue("width").slice(0, -2) * 3 / 5, window.getComputedStyle($('#arrow' + $j)[0]).getPropertyValue("height").slice(0, -2) / 3);
            ctx.lineTo(window.getComputedStyle($('#arrow' + $j)[0]).getPropertyValue("width").slice(0, -2) / 2, window.getComputedStyle($('#arrow' + $j)[0]).getPropertyValue("height").slice(0, -2) * 2 / 3);
            ctx.fill();
        }
    }
    $('.arrow').mouseenter(function (e) {
        var ctx = e.target.getContext('2d');
        ctx.beginPath();
        ctx.clearRect(0, 0, e.target.width, e.target.height)
        ctx.fillStyle = 'darkgoldenrod'
        ctx.moveTo(window.getComputedStyle(e.target).getPropertyValue("width").slice(0, -2) / 3, window.getComputedStyle(e.target).getPropertyValue("height").slice(0, -2) * 2 / 7);
        ctx.lineTo(window.getComputedStyle(e.target).getPropertyValue("width").slice(0, -2) * 2 / 3, window.getComputedStyle(e.target).getPropertyValue("height").slice(0, -2) * 2 / 7);
        ctx.lineTo(window.getComputedStyle(e.target).getPropertyValue("width").slice(0, -2) / 2, window.getComputedStyle(e.target).getPropertyValue("height").slice(0, -2) * 5 / 7);
        ctx.fill();
        ctx.closePath()
        // console.log(tab_proba[e.target.id.slice(5)])
        if ($('#AI_help')[0].checked == true) {
            tab_proba = game.play()
            ctx.fillStyle = 'black'
            ctx.font = "12px Comic Sans MS";
            ctx.textAlign = "center";
            ctx.fillText(tab_proba[e.target.id.slice(5)], canvas.width / 2, canvas.height / 5);
        }
        let possible_pos = 0
        let possible_pos_tab = game.matrix[e.target.id.slice(5)]
        for (let n = Object.keys(possible_pos_tab).length; n >= 0; n--) {
            if (possible_pos_tab[n] == 0) {
                possible_pos = n
                break
            }
        }
        possible_pos = (possible_pos - 1) * game.y + parseInt(e.target.id.slice(5))
        let new_ctx = document.getElementById('element'+possible_pos).getContext('2d')
        new_ctx.beginPath();
        var finalAngle = Math.PI + (Math.PI * 2) / 2;
        new_ctx.fillStyle = '#9C9C9C';
        new_ctx.arc(window.getComputedStyle($('#element' + possible_pos)[0]).getPropertyValue("width").slice(0, -2) / 2, window.getComputedStyle($('#element' + possible_pos)[0]).getPropertyValue("height").slice(0, -2) / 2, window.getComputedStyle($('#element' + possible_pos)[0]).getPropertyValue("height").slice(0, -2) / 2.25, 0, finalAngle);
        new_ctx.fill();
    })
    $('.arrow').mouseleave(function (e) {
        var ctx = e.target.getContext('2d');
        ctx.beginPath();
        ctx.clearRect(0, 0, e.target.width, e.target.height)
        ctx.fillStyle = 'goldenrod'
        ctx.moveTo(window.getComputedStyle(e.target).getPropertyValue("width").slice(0, -2) * 2 / 5, window.getComputedStyle(e.target).getPropertyValue("height").slice(0, -2) / 3);
        ctx.lineTo(window.getComputedStyle(e.target).getPropertyValue("width").slice(0, -2) * 3 / 5, window.getComputedStyle(e.target).getPropertyValue("height").slice(0, -2) / 3);
        ctx.lineTo(window.getComputedStyle(e.target).getPropertyValue("width").slice(0, -2) / 2, window.getComputedStyle(e.target).getPropertyValue("height").slice(0, -2) * 2 / 3);
        ctx.fill();
        let possible_pos = 0
        let possible_pos_tab = game.matrix[e.target.id.slice(5)]
        for (let n = Object.keys(possible_pos_tab).length; n >= 0; n--) {
            if (possible_pos_tab[n] == 0) {
                possible_pos = n
                break
            }
        }
        possible_pos = (possible_pos - 1) * game.y + parseInt(e.target.id.slice(5))
        let new_ctx = document.getElementById('element'+possible_pos).getContext('2d')
        new_ctx.beginPath();
        var finalAngle = Math.PI + (Math.PI * 2) / 2;
        new_ctx.fillStyle = '#FFFFFF';
        new_ctx.arc(window.getComputedStyle($('#element' + possible_pos)[0]).getPropertyValue("width").slice(0, -2) / 2, window.getComputedStyle($('#element' + possible_pos)[0]).getPropertyValue("height").slice(0, -2) / 2, window.getComputedStyle($('#element' + possible_pos)[0]).getPropertyValue("height").slice(0, -2) / 2.25, 0, finalAngle);
        new_ctx.fill();
    })

    if (color_1.slice(0, 1) == '#') {
        temp_1 = Object.values(hexToRgb(color_1))
    }
    else {
        temp_1 = color_1.slice(4, -1).split(',')
    }
    to_dark_1 = 0
    temp_1.forEach((rgb) => {
        if (rgb <= 45) {
            to_dark_1++
        }
    })
    if (temp_1[0] < 45 && temp_1[1] > 210 && temp_1[2] < 45) {
        green_1 = true
    }
    else {
        green_1 = false
    }
    if (color_2.slice(0, 1) == '#') {
        temp_2 = Object.values(hexToRgb(color_2))
    }
    else {
        temp_2 = color_2.slice(4, -1).split(',')
    }
    to_dark_2 = 0
    temp_2.forEach((rgb) => {
        if (rgb <= 45) {
            to_dark_2++
        }
    })
    if (temp_2[0] < 45 && temp_2[1] > 210 && temp_2[2] < 45) {
        green_2 = true
    }
    else {
        green_2 = false
    }
    AI_game = new AI(options['x'], options['y'], color_2, options['AI_lvl'])

    if ((to_dark_1 == 3 && green_2 == false) || (to_dark_2 == 3 && green_1 == false)) {
        $('#player_turn').css('background-color', 'green')
        $('#score_display').css('background-color', 'green')
    }
    else if (to_dark_1 == 3 || to_dark_2 == 3) {
        $('#player_turn').css('background-color', 'red')
        $('#score_display').css('background-color', 'red')
    }
    $('#player_turn').html("Playing now : <span style='color: " + color_1 + "'>" + player_1 + "</span>")
    for ($i = 1; $i <= options["y"] * options["x"]; $i++) {
        this.children("#grille").append('<canvas id="element' + $i + '" width=' + window.getComputedStyle($('#grille')[0]).getPropertyValue("width").slice(0, -2) / options["y"] + 'px height=' + window.getComputedStyle($('#grille')[0]).getPropertyValue("height").slice(0, -2) / options["x"] + '></canvas>')
        canvas = document.getElementById('element' + $i)
        if (canvas.getContext) {
            var ctx = canvas.getContext("2d");
            ctx.fillStyle = game.color_board
            ctx.fillRect(0, 0, window.getComputedStyle($('#element' + $i)[0]).getPropertyValue("width").slice(0, -2) / 2, window.getComputedStyle($('#element' + $i)[0]).getPropertyValue("height").slice(0, -2));

            ctx.fillRect(window.getComputedStyle($('#element' + $i)[0]).getPropertyValue("width").slice(0, -2) / 2, 0, window.getComputedStyle($('#element' + $i)[0]).getPropertyValue("width").slice(0, -2) / 2, window.getComputedStyle($('#element' + $i)[0]).getPropertyValue("height").slice(0, -2));

            ctx.beginPath();
            var finalAngle = Math.PI + (Math.PI * 2) / 2;
            ctx.fillStyle = '#FFFFFF';
            ctx.arc(window.getComputedStyle($('#element' + $i)[0]).getPropertyValue("width").slice(0, -2) / 2, window.getComputedStyle($('#element' + $i)[0]).getPropertyValue("height").slice(0, -2) / 2, window.getComputedStyle($('#element' + $i)[0]).getPropertyValue("height").slice(0, -2) / 2.25, 0, finalAngle);
            ctx.fill();
        }
    }
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        // console.log(r+" "+g+" "+b)
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function hexToRgb(hex) {
        // console.log(hex)
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function invert() {
        rgb = [].slice.call(arguments).join(",").replace(/rgb\(|\)|rgba\(|\)|\s/gi, '').split(',');
        for (var i = 0; i < rgb.length; i++) rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
        return rgbToHex(rgb[0], rgb[1], rgb[2]);
    }
    turn = 1
    total_moves = []
    $('.arrow').click(function () {
        // console.log(this)
        error = drop_piece(this, turn)
        if (error != true) {
            AI_game.refresh_matrix(this.id.substring(5), turn)
            game.refresh_matrix(this.id.substring(5), turn)
            turn = turn == 1 ? 2 : 1
        }
    })

    function turn_display() {
        if (turn == 1 && $('body')[0].style.pointerEvents == 'auto') {
            $('#player_turn').html("Playing now : <span style='color: " + color_1 + "'>" + player_1 + "</span>")
        }
        else if (turn == 2 && $('body')[0].style.pointerEvents == 'auto') {
            $('#player_turn').html("Playing now : <span style='color: " + color_2 + "'>" + player_2 + "</span>")
            if (game.AI_bool) {
                // if ($('#AI')[0].checked) {
                col = AI_game.play()
                drop_piece(col, turn)
                game.refresh_matrix(col.id.substring(5), turn)
                turn = 1
            }
        }
    }
    function drop_piece(col, turn) {
        let possible_pos = 0
        // console.log(col.id.substring(5))
        let possible_pos_tab = game.matrix[col.id.substring(5)]
        // console.log(possible_pos_tab)
        for (let n = Object.keys(possible_pos_tab).length; n >= 0; n--) {
            if (possible_pos_tab[n] == 0) {
                possible_pos = n
                break
            }
        }
        possible_pos = (possible_pos - 1) * game.y + parseInt(col.id.slice(5))
        // console.log(document.getElementById('element'+possible_pos))
        let new_ctx = document.getElementById('element'+possible_pos).getContext('2d')
        new_ctx.beginPath();
        var finalAngle = Math.PI + (Math.PI * 2) / 2;
        new_ctx.fillStyle = '#FFFFFF';
        new_ctx.arc(window.getComputedStyle($('#element' + possible_pos)[0]).getPropertyValue("width").slice(0, -2) / 2, window.getComputedStyle($('#element' + possible_pos)[0]).getPropertyValue("height").slice(0, -2) / 2, window.getComputedStyle($('#element' + possible_pos)[0]).getPropertyValue("height").slice(0, -2) / 2.25, 0, finalAngle);
        new_ctx.fill();

        $('body')[0].style.pointerEvents = 'none'
        color = turn == 1 ? color_1 : color_2
        return in_drop(0)
        function in_drop($j) {
            column_number = parseInt(col.id.substring(5))
            place = column_number + (options['y'] * $j)
            next_place = column_number + (options['y'] * ($j + 1))
            canvas = document.getElementById('element' + place)
            next_canvas = document.getElementById('element' + next_place)
            if (next_canvas == null && canvas.getContext) {
                let ctx = canvas.getContext("2d");
                ctx.beginPath();
                var finalAngle = Math.PI + (Math.PI * 2) / 2;
                ctx.fillStyle = color;
                ctx.arc(window.getComputedStyle($('#element' + place)[0]).getPropertyValue("width").slice(0, -2) / 2, window.getComputedStyle($('#element' + place)[0]).getPropertyValue("height").slice(0, -2) / 2, window.getComputedStyle($('#element' + place)[0]).getPropertyValue("height").slice(0, -2) / 2.25, 0, finalAngle);
                ctx.fill();
                let row_number = 1
                for (let n = Object.values(game.matrix[column_number]).length; n > 0; n--) {
                    if (game.matrix[column_number][n] == 0) {
                        row_number = n + 1
                        break
                    }
                }
                sign = turn == 1 ? "O" : "X"
                not_over = can_win_now(column_number, row_number, sign)
                if (not_over == 'continue') {
                    total_moves.push(column_number + "_" + row_number)
                    if (total_moves.length == options['x'] * options['y']) {
                        alert('DRAW')
                        $('#next_game')[0].style.pointerEvents = 'auto'
                        $('#player_turn').html("Draw")

                    }
                    else {
                        setTimeout(() => {
                            $('body')[0].style.pointerEvents = 'auto'
                            turn_display()
                        }, 200)
                    }
                }
                else {
                    alert("Win !")
                    $('#player_turn').html(not_over)
                    $('#next_game')[0].style.pointerEvents = 'auto'
                    if (turn == 1) {
                        game.score_1++
                    }
                    else {
                        game.score_2++
                    }
                    $('#score_display').html('<span style="color:' + color_1 + '">' + player_1 + '</span> ' + game.score_1 + ' - ' + game.score_2 + ' ' + '<span style="color:' + color_2 + '">' + player_2 + '</span>')
                    return false
                }
            }
            else if (canvas.getContext && next_canvas.getContext) {
                let ctx = canvas.getContext("2d");
                data = ctx.getImageData(window.getComputedStyle($('#element' + place)[0]).getPropertyValue("width").slice(0, -2) / 2, window.getComputedStyle($('#element' + place)[0]).getPropertyValue("height").slice(0, -2) / 2, 1, 1)['data']
                data = Array.prototype.slice.call(data)
                if (data[0] != 255 || data[1] != 255 || data[2] != 255) {
                    $('body')[0].style.pointerEvents = 'auto'
                    return true;
                }
                ctx.beginPath();
                var finalAngle = Math.PI + (Math.PI * 2) / 2;
                ctx.fillStyle = color;
                ctx.arc(window.getComputedStyle($('#element' + place)[0]).getPropertyValue("width").slice(0, -2) / 2, window.getComputedStyle($('#element' + place)[0]).getPropertyValue("height").slice(0, -2) / 2, window.getComputedStyle($('#element' + place)[0]).getPropertyValue("height").slice(0, -2) / 2.25, 0, finalAngle);
                ctx.fill();
                setTimeout(() => {
                    let next_ctx = next_canvas.getContext("2d");
                    next_data = next_ctx.getImageData(window.getComputedStyle($('#element' + next_place)[0]).getPropertyValue("width").slice(0, -2) / 2, window.getComputedStyle($('#element' + next_place)[0]).getPropertyValue("height").slice(0, -2) / 2, 1, 1)['data']
                    next_data = Array.prototype.slice.call(next_data)
                    if (next_data[0] == 255 && next_data[1] == 255 && next_data[2] == 255) {
                        ctx.beginPath();
                        var finalAngle = Math.PI + (Math.PI * 2) / 2;
                        ctx.fillStyle = 'white';
                        ctx.arc(window.getComputedStyle($('#element' + place)[0]).getPropertyValue("width").slice(0, -2) / 2, window.getComputedStyle($('#element' + place)[0]).getPropertyValue("height").slice(0, -2) / 2, window.getComputedStyle($('#element' + place)[0]).getPropertyValue("height").slice(0, -2) / 2.25, 0, finalAngle);
                        ctx.fill();
                        in_drop($j + 1);
                    }
                    else {
                        let row_number = 1
                        for (let n = Object.values(game.matrix[column_number]).length; n > 0; n--) {
                            if (game.matrix[column_number][n] == 0) {
                                row_number = n + 1
                                break
                            }
                        }
                        sign = turn == 1 ? "O" : "X"
                        not_over = can_win_now(column_number, row_number, sign)
                        if (not_over == 'continue') {
                            total_moves.push(column_number + "_" + row_number)
                            if (total_moves.length == options['x'] * options['y']) {
                                $('body')[0].style.pointerEvents = 'auto'
                                alert('DRAW')
                                $('#player_turn').html("Draw")
                            }
                            else {
                                setTimeout(() => {
                                    $('body')[0].style.pointerEvents = 'auto'
                                    turn_display()
                                }, 200)
                            }
                        }
                        else {
                            alert("Win !")
                            $('#player_turn').html(not_over)
                            $('#next_game')[0].style.pointerEvents = 'auto'
                            if (turn == 1) {
                                game.score_1++
                            }
                            else {
                                game.score_2++
                            }
                            $('#score_display').html('<span style="color:' + color_1 + '">' + player_1 + '</span> ' + game.score_1 + ' - ' + game.score_2 + ' ' + '<span style="color:' + color_2 + '">' + player_2 + '</span>')
                            return false
                        }
                    }
                }, 1000 / game.x)
            }
        }
    }

    function can_win_now(col_origin, row_origin, sign) {
        let retour = recursive_win(col_origin, row_origin, 1, 0, sign)
        if (retour == "win") {
            return sign == "O" ? "Winner : <span style='color: " + color_1 + "'>" + player_1 + " </span>!" : "Winner : <span style='color: " + color_2 + "'>" + player_2 + " </span>!"
        }
        retour = recursive_win(col_origin, row_origin, 0, 1, sign)
        if (retour == "win") {
            return sign == "O" ? "Winner : <span style='color: " + color_1 + "'>" + player_1 + " </span>!" : "Winner : <span style='color: " + color_2 + "'>" + player_2 + " </span>!"
        }
        retour = recursive_win(col_origin, row_origin, 1, 1, sign)
        if (retour == "win") {
            return sign == "O" ? "Winner : <span style='color: " + color_1 + "'>" + player_1 + " </span>!" : "Winner : <span style='color: " + color_2 + "'>" + player_2 + " </span>!"
        }
        retour = recursive_win(col_origin, row_origin, -1, 1, sign)
        if (retour == "win") {
            return sign == "O" ? "Winner : <span style='color: " + color_1 + "'>" + player_1 + " </span>!" : "Winner : <span style='color: " + color_2 + "'>" + player_2 + " </span>!"
        }
        return 'continue'
    }

    function recursive_win(col_origin, row_origin, modif_col, modif_row, sign) {
        var line = 1
        var line_continue = true
        do {
            // if (game.matrix[col_origin + modif_col] == undefined){
            //     console.log(game.matrix + " / " + (col_origin + modif_col))
            // }
            if (game.matrix[col_origin + modif_col] != undefined && game.matrix[col_origin + modif_col][row_origin + modif_row] == sign) {
                line++
                if (modif_col > 0) {
                    modif_col++
                }
                else if (modif_col < 0) {
                    modif_col--
                }
                if (modif_row > 0) {
                    modif_row++
                }
                else if (modif_row < 0) {
                    modif_row--
                }
            }
            else if (line_continue == true) {
                line_continue = false
                if (modif_col > 0) {
                    modif_col = -1
                }
                else if (modif_col < 0) {
                    modif_col = 1
                }
                if (modif_row > 0) {
                    modif_row = -1
                }
                else if (modif_row < 0) {
                    modif_row = 1
                }
            }
            else {
                return 'continue'
            }
        } while (line < 4)
        return 'win'
    }

    function remove_last(AI_on = false) {
        if (total_moves.length > 0) {
            let number_temp = total_moves[total_moves.length - 1].split('_')
            number = (parseInt(number_temp[1]) - 1) * game.y + parseInt(number_temp[0])
            console.log(number)
            let last_move = document.getElementById('element' + number)
            let last_cell = last_move.getContext("2d")
            last_cell.beginPath();
            var finalAngle = Math.PI + (Math.PI * 2) / 2;
            last_cell.fillStyle = 'white';
            last_cell.arc(window.getComputedStyle(last_move).getPropertyValue("width").slice(0, -2) / 2, window.getComputedStyle(last_move).getPropertyValue("height").slice(0, -2) / 2, window.getComputedStyle(last_move).getPropertyValue("height").slice(0, -2) / 2.25, 0, finalAngle);
            last_cell.fill();
            total_moves.splice([total_moves.length - 1], 1)
            AI_game.remove(number_temp)
            game.remove(number_temp)
            if (AI_on == false && game.AI_bool){
                remove_last(true)
            }
            else if (!game.AI_bool){
                turn = turn == 1 ? 2 : 1
            }
            turn_display()
        }
    }
}

$('document').ready(function () {
    game = new Four_in_a_row(
        6, // x (min 6, max 11)
        7, // y (min 7, max 13)
        '#FF0000', // Player 1 color
        '#FFFF00', // Player 2 color
        '#0000FF', // Board color
        'Player 1', // Player 1 name
        'Player 2', // Player 2 name
        false, // AI help, according to AI help
        1, // AI lvl (1 to 3)
        false // If true, Player 2 will be an AI
    )
    game.new_game()
})