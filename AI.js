class AI {
    constructor(x, y, color, lvl) {
        this.x = x
        this.y = y
        this.color = color
        this.lvl = lvl
        this.matrix = new Object()
        for (let i = 1; i <= y; i++) {
            this.matrix[i] = new Object()
            for (let j = 1; j <= x; j++) {
                this.matrix[i][j] = 0
            };
        }
        this.tab_moves = []
        /* Exemple of variable 'matrix' :
        {
            col 1 => {row 1, row 2, row 3, ...},
            col 2 => {row 1, row 2, row 3, ...},
            col 3 => {row 1, row 2, row 3, ...},
            ...
        }

        4-in-a-row from the matrix :
        [
            [col1=>row1, col2=>row1, col3=>row1, ...],
            [col1=>row2, col2=>row2, col3=>row2, ...],
            [col1=>row3, col2=>row3, col3=>row3, ...],
            ...
        ] */
    }

    refresh_matrix(col, turn = 2) {
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
        // let tab_points = {}
        for (let m = 1; m <= this.y; m++) {
            if (Object.values(this.matrix[m]).includes(0)) {
                if (!isNaN(tab_points[m]) || tab_points[m] == 0) {
                    for (let n = this.x; n > 0; n--) {
                        if (this.matrix[m][n] == 0) {
                            let sign = recursive ? "O" : "X"
                            let sign2 = recursive ? "X" : "O"
                            let bool_temp = this.can_win_now(m, n, sign, recursive)
                            if (isNaN(bool_temp)) {
                                this.refresh_matrix(m)
                                return bool_temp
                            }
                            tab_points[m] += bool_temp
                            bool_temp = this.can_loose_now(m, n, sign2, recursive)
                            if (isNaN(bool_temp)) {
                                this.refresh_matrix(m)
                                return bool_temp
                            }
                            tab_points[m] += bool_temp
                            break
                        }
                    }
                }
            }
            else {
                tab_points[m] = -100000
            }
        }
        // console.log(tab_points)
        if (recursive == false && this.lvl >= 3) {
            this.level_3(tab_points)
        }
        if (recursive == false) {
            this.refresh_matrix(Object.values(tab_points).indexOf(Math.max(...Object.values(tab_points))) + 1)
            return $('#arrow' + (Object.values(tab_points).indexOf(Math.max(...Object.values(tab_points))) + 1))[0]
        }
    }

    can_win_now(col_origin, row_origin, sign, recursive) {
        var score_total = 0
        if (col_origin < this.y / 2) {
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
                if (sign == (recursive ? "O" : "X")) {
                    switch (line) {
                        case 1:
                            score += 100
                            break
                        case 2:
                            score += 500
                            break
                    }
                    if (this.lvl >= 2 && next_move == false) {
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
                        AI_game.matrix[col_origin][row_origin] = sign
                        var new_result = this.recursive_win(col_origin, row_origin - 1, modif_col, modif_row, sign, recursive, true)
                        if (isNaN(new_result)) {
                            score -= 5000
                        }
                        else {
                            score -= new_result / 5
                        }
                        AI_game.matrix[col_origin][row_origin] = 0
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
                        case 3:
                            score += 20000
                    }
                    if (this.lvl >= 2 && next_move == false) {
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
                        AI_game.matrix[col_origin][row_origin] = "X"
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
                        AI_game.matrix[col_origin][row_origin] = 0
                    }
                }
                return score
            }
        } while (line < 3 || sign == "O")
        return $('#arrow' + col_origin)[0]
    }
}