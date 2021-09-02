class Four_in_a_row {
    constructor(x, y, color_1, color_2, color_board, player_1, player_2, AI_help, lvl, AI_bool) {
        this.x = x > 11 ? 11 : x
        this.y = y > 13 ? 13 : y
        this.x = this.x < 6 ? 6 : this.x
        this.y = this.y < 6 ? 6 : this.y

        this.color_1 = color_1
        this.color_2 = color_2
        this.player_1 = player_1 != '' ? player_1 : 'Player 1'
        this.player_2 = player_2 != '' ? player_2 : 'Player 2'
        this.AI_help = AI_help
        this.AI_lvl = lvl
        this.AI_bool = AI_bool
        this.score_1 = 0
        this.score_2 = 0
        this.tab_moves = []
        this.color_board = color_board
    }

    componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    new_game() {
        $('body').connect_4({
            x: this.x,
            y: this.y,
            color_1: this.color_1,
            color_2: this.color_2,
            player_1: this.player_1,
            player_2: this.player_2,
            AI_lvl: this.AI_lvl,
        })
        this.matrix = new Object()
        for (let i = 1; i <= this.y; i++) {
            this.matrix[i] = new Object()
            for (let j = 1; j <= this.x; j++) {
                this.matrix[i][j] = 0
            };
        }
        $('body')[0].style.pointerEvents = 'auto'
    }

    refresh_matrix(col, turn = 1) {
        let sign = turn == 1 ? 'O' : 'X'
        for (let k = Object.keys(this.matrix[col]).length; k > 0; k--) {
            if (this.matrix[col][k] == 0) {
                // console.log('col ' + col + ' = row ' + k)
                this.matrix[col][k] = sign
                this.tab_moves.push(col + "/" + k)
                break
            }
        }
    }

    remove(deleted_cell) {
        this.matrix[deleted_cell[0]][deleted_cell[1]] = 0
    }

    play(recursive = false, tab_points = {}) {
        if (tab_points[1] == undefined) {
            for (let z = 1; z <= this.y; z++) {
                tab_points[z] = 0
            }
        }
        for (let m = 1; m <= this.y; m++) {
            if (Object.values(this.matrix[m]).includes(0)) {
                // console.log(tab_points[m])
                if (!isNaN(tab_points[m]) || tab_points[m] == 0) {
                    for (let n = this.x; n > 0; n--) {
                        if (this.matrix[m][n] == 0) {
                            // console.log(turn)
                            let sign = turn == 1 ? "O" : "X"
                            let sign2 = turn == 2 ? "O" : "X"
                            let sign1 = recursive ? sign2 : sign
                            sign2 = recursive ? sign : sign2
                            let bool_temp = this.can_win_now(m, n, sign1, recursive)
                            tab_points[m] = bool_temp
                            if (!isNaN(bool_temp)) {
                                bool_temp = this.can_loose_now(m, n, sign2, recursive)
                                if (isNaN(bool_temp)) {
                                    tab_points[m] = bool_temp
                                }
                                else {
                                    tab_points[m] += bool_temp
                                }
                            }
                            break
                        }
                    }
                }
            }
        }
        if (recursive == false && this.lvl >= 3) {
            this.level_3(tab_points)
        }
        if (recursive == false) {
            return tab_points
        }
        // console.log(tab_points)
    }

    can_win_now(col_origin, row_origin, sign, recursive) {
        var score_total = 0
        if (col_origin <= this.y / 2) {
            score_total += Math.round(2 * col_origin - 1)
        }
        else {
            let temp_number = this.y - col_origin
            score_total += Math.round(2 * temp_number)
        }
        let retour = this.recursive_win(col_origin, row_origin, 1, 0, sign, recursive)
        if (isNaN(retour)) {
            return retour
        }
        else {
            score_total += retour
        }
        if (recursive == false) {
            retour = this.recursive_win(col_origin, row_origin, 0, 1, sign, recursive)
            if (isNaN(retour)) {
                return retour
            }
            else {
                score_total += retour
            }
        }
        retour = this.recursive_win(col_origin, row_origin, 1, 1, sign, recursive)
        if (isNaN(retour)) {
            return retour
        }
        else {
            score_total += retour
        }
        retour = this.recursive_win(col_origin, row_origin, -1, 1, sign, recursive)
        if (isNaN(retour)) {
            return retour
        }
        else {
            score_total += retour
        }
        return score_total
    }

    can_loose_now(col_origin, row_origin, sign, recursive) {
        var score_total = 0
        let retour = this.recursive_win(col_origin, row_origin, 1, 0, sign, recursive)
        if (isNaN(retour)) {
            return retour
        }
        else {
            score_total += retour
        }
        retour = this.recursive_win(col_origin, row_origin, 0, 1, sign, recursive)
        if (isNaN(retour)) {
            return retour
        }
        else {
            score_total += retour
        }
        retour = this.recursive_win(col_origin, row_origin, 1, 1, sign, recursive)
        if (isNaN(retour)) {
            return retour
        }
        else {
            score_total += retour
        }
        retour = this.recursive_win(col_origin, row_origin, -1, 1, sign, recursive)
        if (isNaN(retour)) {
            return retour
        }
        else {
            score_total += retour
        }
        return score_total
    }

    level_3(tab_points) {
        this.play(true, tab_points)
    }

    recursive_win(col_origin, row_origin, modif_col, modif_row, sign, recursive, next_move = false) {
        var line = 0
        var line_continue = true
        var score = 0
        do {
            if (this.matrix[col_origin + modif_col] != undefined && this.matrix[col_origin + modif_col][row_origin + modif_row] == sign) {
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
                if ((turn == 1 && !recursive && sign == "O") || (turn == 2 && !recursive && sign == "X") || (turn == 2 && recursive && sign == "O") || (turn == 1 && recursive && sign == "X")) {
                    switch (line) {
                        case 1:
                            score += 100
                            break
                        case 2:
                            score += 500
                            break
                    }
                    if (this.AI_lvl >= 2 && next_move == false) {
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
                        game.matrix[col_origin][row_origin] = sign
                        var new_result = this.recursive_win(col_origin, row_origin - 1, modif_col, modif_row, sign, recursive, true)
                        if (isNaN(new_result)) {
                            score -= 5000
                        }
                        else {
                            score -= new_result / 5
                        }
                        game.matrix[col_origin][row_origin] = 0
                    }
                }
                else {
                    switch (line) {
                        case 1:
                            score += 100
                            break
                        case 2:
                            score += 1000
                            break
                    }
                    if (this.AI_lvl >= 2 && next_move == false) {
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
                        game.matrix[col_origin][row_origin] = sign == "X" ? "O" : "X"
                        var new_result = this.recursive_win(col_origin, row_origin - 1, modif_col, modif_row, sign, recursive, true)
                        if (isNaN(new_result)) {
                            score -= 10000
                        }
                        else {
                            if (this.lvl >= 3) {
                                score -= new_result
                            }
                            else {
                                score -= new_result / 5
                            }
                        }
                        game.matrix[col_origin][row_origin] = 0
                    }
                }
                return score
            }
        } while (line < 3)
        if ((turn == 1 && sign == "O") || (turn == 2 && sign == "X")) {
            return "WIN"
        }
        else {
            return "PREVENT LOOSE"
        }
    }
}